#!/usr/bin/python3
"""A collection of all the forms that the web application
will use to collect information from users
"""
from flask_login import current_user
from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from models import storage
from models.user import User
from wtforms import StringField, PasswordField, SubmitField, BooleanField
from wtforms.validators import DataRequired, Length, Email, EqualTo
from wtforms.validators import ValidationError


class RegistrationForm(FlaskForm):
    """This form collects information relevant for
    registering a user to our platform
    """
    username = StringField('Username',
                           validators=[DataRequired(), Length(min=2, max=20)])
    first_name = StringField('First Name',
                             validators=[DataRequired(),
                                         Length(min=2, max=20)])
    last_name = StringField('Last Name',
                            validators=[DataRequired(), Length(min=2, max=20)])
    email = StringField('Email',
                        validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password',
                                     validators=[DataRequired(),
                                                 EqualTo('password')])
    submit = SubmitField('Sign Up')

    def validate_username(self, username):
        """This function is used to validate username input
        to avoid integrity issues with database
        """
        username = username.data
        users = storage.all(User)
        for user in users.values():
            if user.username == username:
                raise ValidationError('Username unavailable.\
                                      Please choose a different one.')

    def validate_email(self, email):
        """This function is used to validate email input
        from user to avoid duplication
        """
        email.data = email.data.lower()
        email = email.data
        users = storage.all(User)
        for user in users.values():
            if user.email == email:
                raise ValidationError('Email already exists.\
                                      Please choose a different one.')


class LoginForm(FlaskForm):
    """Login form is used to verify that user already exists in
    our database. If true the user is logged in, otherwise required
    to sign up"""
    email = StringField('Email',
                        validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember = BooleanField('Remember Me')
    submit = SubmitField('Login')

    def validate_email(self, email):
        email.data = email.data.lower() 


class UpdateAccountForm(FlaskForm):
    """This form is used to update information for existing
    users according to their preference
    """
    username = StringField('Username',
                           validators=[DataRequired(), Length(min=2, max=20)])
    email = StringField('Email',
                        validators=[DataRequired(), Email()])
    picture = FileField('Update Profile Picture',
                        validators=[FileAllowed(['jpg', 'png', 'jpeg'])])
    submit = SubmitField('Update')

    def validate_username(self, username):
        """This function is used to validate username input
        to avoid integrity issues with database
        """
        if username.data != current_user.username:
            users = storage.all(User)
            for user in users.values():
                if user.username == username:
                    raise ValidationError('Username unavailable. \
                                          Please choose a different one.')

    def validate_email(self, email):
        """This function is used to validate email input
        from user to avoid duplication"""
        email.data = email.data.lower()
        if email.data != current_user.email:
            users = storage.all(User)
            for user in users.values():
                if user.email == email:
                    raise ValidationError('Email already exists.\
                                          Please choose a different one.')
