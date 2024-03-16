#!/usr/bin/python3
"""Defines Class Task"""

import models
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey


class Task(BaseModel, Base):
    """Representation of a user """
    if models.storage_t == 'db':
        __tablename__ = 'tasks'
        user_id = Column(String(60), ForeignKey('users.id'), nullable=False)
        content = Column(String(1024), nullable=False)

    else:
       task_id = ""
       content = ""

