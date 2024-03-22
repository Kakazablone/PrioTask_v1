#!/usr/bin/python3
"""Defines Class Task"""

import models
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey, Integer


class Custom(BaseModel, Base):
    """Representation of custom setting """
    if models.storage_t == 'db':
        __tablename__ = 'customes'
        user_id = Column(String(60), ForeignKey('users.id'), nullable=False)
        name = Column(String(60), nullable=False)
        pomodoro_value = Column(Integer, nullable=False)
        short_value = Column(Integer, nullable=False)
        long_value = Column(Integer, nullable=False)
    else:
        user_id = ""
        name = ""
        pomodoro_value = ""
        short_value = ""
        long_value = ""
