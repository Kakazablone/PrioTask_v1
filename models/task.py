#!/usr/bin/python3
"""Defines Class Task"""

import models
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey
from models.user import User



class Task(BaseModel, Base):
    """Representation of a user """
    if models.storage_t == 'db':
        __tablename__ = 'tasks'
        task_id = Column(String(60), ForeignKey('user.id'), nullable=False)
       
    else:
       pass