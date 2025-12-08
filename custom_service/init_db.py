#!/usr/bin/env python3
import os
import time
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError

# Ensure project root is on sys.path so 'app' package can be imported when running as script
PROJECT_ROOT = os.path.abspath(os.path.dirname(__file__))  # should be /app in the container
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

DATABASE_URL = os.environ.get("DATABASE_URL") or os.environ.get("POSTGRES_URL") or "postgresql://app:app@postgres_app:5432/app_db"

def wait_for_db(url, retries=20, delay=3):
    for i in range(retries):
        try:
            engine = create_engine(url)
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            print(f"[init_db] DB reachable (attempt {i+1})")
            return engine
        except OperationalError as e:
            print(f"[init_db] DB not ready yet: {e} - retrying in {delay}s...")
            time.sleep(delay)
    raise SystemExit("[init_db] Database not reachable, aborting.")

def create_tables_from_models(engine):
    try:
        # Try absolute import of your SQLAlchemy Base
        from app.db.postgres import PostgresBase as AppBase
        AppBase.metadata.create_all(bind=engine)
        print("[init_db] Created tables from app models (Base.metadata.create_all)")
        return True
    except Exception as e:
        # If import fails, log full traceback for debugging
        import traceback
        print(f"[init_db] Could not create from app models: {e}")
        traceback.print_exc()
        return False

def create_example_table(engine):
    with engine.begin() as conn:
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS example_table (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT now()
            );
        """))
    print("[init_db] Created fallback example_table")

if __name__ == "__main__":
    engine = wait_for_db(DATABASE_URL)
    success = create_tables_from_models(engine)
    if not success:
        # fallback: create a safe example - adapte en SQL nécessaire
        create_example_table(engine)
    print("[init_db] init complete.")
