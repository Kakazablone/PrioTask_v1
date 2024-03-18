#!/usr/bin/python3
"""Holds class User"""

import models
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from flask_login import UserMixin

class User(BaseModel, UserMixin, Base):
    """Representation of a user """
    if models.storage_t == 'db':
        __tablename__ = 'users'
        username = Column(String(128), nullable=False)
        email = Column(String(128), nullable=False)
        password = Column(String(128), nullable=False)
        first_name = Column(String(128), nullable=True)
        last_name = Column(String(128), nullable=True)
        image_file = Column(String(20), nullable=False, default='default.jpg')
        tasks = relationship("Task", backref="user", cascade="all, delete-orphan")
    else:
        username = ""
        email = ""
        password = ""
        first_name = ""
        last_name = ""
        image_file = "default.jpg"



