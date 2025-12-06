from datetime import datetime

from app.db.postgres import PostgresBase
from sqlalchemy import Column, DateTime, String


class User(PostgresBase):
    __tablename__ = "users"

    id = Column(String, primary_key=True)  # UUID ou ID Keycloak
    firstName = Column(String)
    lastName = Column(String)
    name = Column(String)  # Calculé : f"{firstName} {lastName}"
    email = Column(String, unique=True)
    birthday = Column(DateTime)
    gender = Column(String)  # "homme" ou "femme"
    address = Column(String)
    phone = Column(String)
    createdAt = Column(DateTime, default=datetime.now)
    updatedAt = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    def dict(self) -> dict:
        return {
            "id": self.id,
            "firstName": self.firstName,
            "lastName": self.lastName,
            "name": self.name,
            "email": self.email,
            "birthday": self.birthday.isoformat() + "Z"
            if self.birthday is not None
            else None,
            "gender": self.gender,
            "address": self.address,
            "phone": self.phone,
            "createdAt": self.createdAt,
            "updatedAt": self.updatedAt,
        }
