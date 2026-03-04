# 🔄 Celery Worker

Service Celery responsable de l'exécution de tâches asynchrones : génération de factures, notifications, uploads de fichiers.

## 📦 Structure

```
celery_worker/
├── app/
│   ├── __init__.py
│   └── celery_app.py          # Celery configuration
├── tasks/
│   ├── __init__.py
│   ├── invoice.py             # Invoice generation tasks
│   ├── notifications.py       # Email/SMS notifications
│   ├── uploads.py             # File upload processing
│   └── cleanup.py             # Scheduled cleanup tasks
├── Dockerfile
├── requirements.txt
├── .env.example
└── README.md
```

## 🚀 Key Features

- **Async Job Processing**: Offload long-running tasks
- **Broker**: RabbitMQ (message queue)
- **Backend**: Redis (result storage)
- **Scheduled Tasks**: Periodic tasks via Celery Beat
- **Retries**: Automatic retry with exponential backoff
- **Dead Letter Queue (DLQ)**: Failed task handling

## 📋 Task Types

### Invoice Generation

```python
# Triggered by: order.confirmed event

@app.task(bind=True, max_retries=3)
def generate_invoice(self, order_id: str):
    try:
        # Fetch order from database
        order = get_order(order_id)
        
        # Generate PDF invoice
        invoice_pdf = create_invoice_pdf(order)
        
        # Upload to MinIO
        minio_path = upload_to_minio(invoice_pdf)
        
        # Save invoice record
        save_invoice_record(order_id, minio_path)
        
        # Send email
        send_email(order.user_email, minio_path)
        
        return {"status": "completed", "invoice_path": minio_path}
    
    except Exception as exc:
        # Retry with exponential backoff
        self.retry(exc=exc, countdown=2 ** self.request.retries)
```

### Email Notifications

```python
@app.task(bind=True, max_retries=2)
def send_order_confirmation(self, order_id: str, email: str):
    try:
        order = get_order(order_id)
        
        email_content = render_template(
            "order_confirmation.html",
            order=order
        )
        
        send_email(
            to=email,
            subject="Order Confirmation",
            html=email_content
        )
        
        return {"status": "sent"}
    
    except SMTPError as exc:
        self.retry(exc=exc, countdown=60)
```

### File Upload Processing

```python
@app.task
def process_product_image(self, upload_id: str):
    # Fetch uploaded file
    upload = get_upload(upload_id)
    
    # Generate thumbnails
    thumbnail = create_thumbnail(upload.file, (200, 200))
    
    # Optimize for web
    optimized = optimize_image(upload.file)
    
    # Upload to MinIO
    minio_upload(thumbnail, f"products/thumbnails/{upload_id}")
    minio_upload(optimized, f"products/originals/{upload_id}")
    
    return {"status": "processed"}
```

### Scheduled Cleanup Tasks

```python
# Run every day at 2 AM
@app.task
def cleanup_old_uploads():
    # Delete uploads older than 30 days
    old_uploads = Upload.query.filter(
        Upload.created_at < datetime.now() - timedelta(days=30)
    ).all()
    
    for upload in old_uploads:
        minio_delete(upload.minio_path)
        db.delete(upload)
    
    return {"deleted": len(old_uploads)}

# Schedule
from celery.schedules import crontab

app.conf.beat_schedule = {
    "cleanup-every-day": {
        "task": "tasks.cleanup.cleanup_old_uploads",
        "schedule": crontab(hour=2, minute=0),
    }
}
```

## ⚙️ Configuration

```python
# app/celery_app.py

from celery import Celery

app = Celery('komkom')

app.conf.update(
    broker_url='amqp://rabbit:rabbit@rabbitmq:5672//',
    result_backend='redis://redis:6379/0',
    
    # Task settings
    task_serializer='json',
    result_serializer='json',
    accept_content=['json'],
    
    # Timezone
    timezone='UTC',
    enable_utc=True,
    
    # Task retries
    task_acks_late=True,
    task_reject_on_worker_lost=True,
    
    # Task timeout
    task_soft_time_limit=600,  # 10 minutes
    task_time_limit=900,        # 15 minutes
    
    # Workers
    worker_prefetch_multiplier=1,  # One task at a time
)
```

## 🔄 Event Integration

### Consume Events

**Trigger on order.confirmed**:

```python
# In event consumer
if event["event_type"] == "order.confirmed":
    # Queue invoice generation
    generate_invoice.delay(order_id=event["order_id"])
    
    # Queue notification
    send_order_confirmation.delay(
        order_id=event["order_id"],
        email=event["email"]
    )
```

**Event Queue in RabbitMQ**:
```
Exchange: events (topic)
Queue: celery_worker_tasks
Routing key: order.*
```

## 📊 Task Monitoring

### Health Check

```http
GET /health
```

Response:
```json
{
  "status": "healthy",
  "active_tasks": 5,
  "queued_tasks": 12
}
```

### Task Status

```python
# Check task result
from celery.result import AsyncResult

result = AsyncResult(task_id)
print(result.state)  # PENDING, STARTED, SUCCESS, FAILURE
print(result.result)  # Return value or exception
```

## 🚨 Error Handling & DLQ

### Failed Task Flow

```
Task Failed
  │
  ├─ Retry 1 (countdown=2s)
  ├─ Retry 2 (countdown=4s)
  ├─ Retry 3 (countdown=8s)
  └─ Max retries exceeded
      │
      └─ Send to Dead Letter Queue (DLQ)
          └─ Manual review + fix + requeue
```

### DLQ Management

```python
# Send to DLQ
dlq_exchange = "celery_worker_dlq"
send_to_dlq(task_id, error_details)

# Requeue from DLQ
async def requeue_from_dlq(task_id: str):
    task = get_dlq_task(task_id)
    # Regenerate and send to queue
    queue_task(task)
```

## 🐳 Docker

```bash
# Build
docker build -t komkom/celery-worker:latest .

# Run
docker run \
  -e CELERY_BROKER_URL=amqp://rabbit:rabbit@rabbitmq:5672// \
  -e CELERY_RESULT_BACKEND=redis://redis:6379/0 \
  komkom/celery-worker:latest
```

### Run Multiple Workers

Scale workers for throughput:

```bash
# In docker-compose.yml
celery_worker_1:
  build: ./workers/celery_worker
  environment:
    - CELERY_QUEUES=invoices,notifications
  
celery_worker_2:
  build: ./workers/celery_worker
  environment:
    - CELERY_QUEUES=uploads,cleanup
```

## 📚 Dependencies

- **celery**: Task queue framework
- **redis**: Result backend
- **amqp**: RabbitMQ client
- **pydantic**: Configuration
- **requests**: HTTP calls
- **pillow**: Image processing (for thumbnails)
- **reportlab**: PDF generation (for invoices)

## 💡 Task Best Practices

### 1. Idempotency

Tasks can run multiple times; make them idempotent:

```python
@app.task
def send_invoice(self, order_id: str):
    # Check if invoice already sent
    if Invoice.exists(order_id):
        return {"status": "already_sent"}
    
    # Create invoice
    invoice = Invoice.create(order_id)
    return {"status": "created"}
```

### 2. Progress Tracking

Update progress for long-running tasks:

```python
@app.task(bind=True)
def bulk_export(self, export_id: str):
    total_items = 10000
    
    for i, item in enumerate(fetch_items()):
        process_item(item)
        
        # Update progress
        self.update_state(
            state='PROGRESS',
            meta={'current': i, 'total': total_items}
        )
```

### 3. Logging

Always log task execution:

```python
import logging

logger = logging.getLogger(__name__)

@app.task
def my_task(self):
    logger.info(f"Task {self.request.id} started")
    try:
        # Do work
        result = do_work()
        logger.info(f"Task {self.request.id} completed")
        return result
    except Exception as e:
        logger.error(f"Task {self.request.id} failed: {e}")
        raise
```

## 🔧 Management Commands

```bash
# Check worker status
celery -A app.celery_app inspect active

# Show registered tasks
celery -A app.celery_app inspect registered

# Purge queue
celery -A app.celery_app purge

# Monitor in real-time
celery -A app.celery_app events
```

## ?️ Support

For issues:
- Check logs: `docker logs komkom_celery_worker`
- RabbitMQ Management: http://localhost:15672
- Flower (task monitoring): (planned setup)

---

**Last Updated**: 2026-03-04
