from fastapi import APIRouter

general_router = APIRouter()


@general_router.get("/")
def root():
    return {"message": "Hello from Backend!"}
