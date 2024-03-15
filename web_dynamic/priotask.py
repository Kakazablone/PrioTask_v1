#!/usr/bin/python3
""" Starts a Flash Web Application """
from models import storage
from models.task import Task
from models.user import User
from web_dynamic.forms import LoginForm, RegistrationForm
from flask_login import login_user, current_user, logout_user, login_required
from flask_bcrypt import Bcrypt, check_password_hash
from flask_login import LoginManager

import os
from flask import Flask, render_template, redirect, url_for, request, flash
import uuid
app = Flask(__name__)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
app.config['SECRET_KEY'] = os.urandom(24)

@app.teardown_appcontext
def close_db(error):
    """ Remove the current SQLAlchemy Session """
    storage.close()

@login_manager.user_loader
def load_user(user_id):
    user = storage.get(User, user_id)
    if user:
        return user

@app.route("/")
def home():
    return render_template('101-hbnb.html')

@app.route("/about")
def about():
    return render_template('about.html')


@app.route("/register", methods=['GET', 'POST'])
def register():
    """  """
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = User(username=form.username.data, first_name=form.first_name.data,
            last_name=form.last_name.data, email=form.email.data,
            password=hashed_password)
        storage.new(user)
        storage.save()
        flash('Your account has been created! You are now able to log in')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)

@app.route("/login", methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = LoginForm()
    if form.validate_on_submit():
        email=form.email.data
        users = storage.all(User)
        user = next((user for user in users.values() if user.email == email), None)
        if user and check_password_hash(user.password, form.password.data):
            login_user(user, remember=form.remember.data)
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('home'))
        else:
            flash('Login Unsuccessful. Please check email and password')
    return render_template('login.html', title='Login', form=form)

@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('home'))



if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5000)