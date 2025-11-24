from sqlmodel import Session, create_engine, SQLModel
from typing import Generator

# Configuration for the SQLite database
# The database file will be created in the 'backend' directory
SQLMODEL_DATABASE_URL = "sqlite:///./database/sqlite.db"

# Create the SQLAlchemy engine
# connect_args={"check_same_thread": False} is needed for SQLite with FastAPI
# because SQLite only allows one thread to interact with it at a time.
# FastAPI uses multiple threads, so we need to disable this check.
engine = create_engine(SQLMODEL_DATABASE_URL, echo=True, connect_args={"check_same_thread": False})

def create_db_and_tables():
    """
    Creates all tables defined as SQLModel models in the database.
    """
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    """
    Dependency to get a database session.
    Yields a session which is then closed automatically.
    """
    with Session(engine) as session:
        yield session
