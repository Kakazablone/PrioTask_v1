#!/usr/bin/python3
"""Initiates the Priotask Web Application """
from models import storage
from models.task import Task
from models.user import User
from flask import Flask, render_template, redirect, url_for, request, flash
from flask_login import login_user, current_user, logout_user, login_required
from flask_bcrypt import Bcrypt, check_password_hash
from flask_login import LoginManager
from PIL import Image
from web_dynamic.forms import LoginForm, RegistrationForm, UpdateAccountForm
import os
import secrets
import uuid


app = Flask(__name__)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
app.config['SECRET_KEY'] = os.urandom(24)


@app.teardown_appcontext
def close_db(error):
    """ Remove the current SQLAlchemy Session """
    storage.close()


@login_manager.user_loader
def load_user(user_id):
    """loads the current user (Object) to authenticate
    login details
    """
    user = storage.get(User, user_id)
    if user:
        return user


@app.route("/")
def home():
    """The root endpoint, main section of the priotask
    web application
    """
    return render_template('timer.html')


@app.route("/about")
def about():
    """This route gives a glimpse of what the entire
    web application is about & higlights some info
    about our team
    """
    return render_template('about.html')


@app.route("/register", methods=['GET', 'POST'])
def register():
    """This route provides the gateway for a user to register
    to our web application before they can enjoy selected routes
    or services
    """
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data)\
            .decode('utf-8')
        user = User(username=form.username.data,
                    first_name=form.first_name.data,
                    last_name=form.last_name.data, email=form.email.data,
                    password=hashed_password)
        storage.new(user)
        storage.save()
        flash('Your account has been created! You are now able to log in')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)


@app.route("/login", methods=['GET', 'POST'])
def login():
    """Provides a gateway for an already registered user to
    log into the web application
    """
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = LoginForm()
    """Instantiates the Login form and make it available for
    other operations
    """
    if form.validate_on_submit():
        """Validates the details of the submitted form
        according to the fields and details required
        """
        email = form.email.data
        users = storage.all(User)
        user = next((user for user in users.values()
                     if user.email == email), None)
        if user and check_password_hash(user.password, form.password.data):
            login_user(user, remember=form.remember.data)
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else\
                redirect(url_for('home'))
        else:
            flash('Login Unsuccessful. Please check email and password')
    return render_template('login.html', title='Login', form=form)


@app.route("/logout")
def logout():
    """Logs out a user from an ongoing session
    on the web application
    """
    logout_user()
    return redirect(url_for('home'))


def save_picture(form_picture):
    """A helper function that standardizes all
    images that users will upload to their
    account profiles
    """
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(form_picture.filename)
    picture_fn = random_hex + f_ext
    picture_path = os.path.join(app.root_path, 'static/images', picture_fn)

    output_size = (125, 125)
    i = Image.open(form_picture)
    i.thumbnail(output_size)
    i.save(picture_path)

    return picture_fn


@app.route("/account", methods=['GET', 'POST'])
@login_required
def account():
    """Route that points to the account of the currently
    logged in user. This route demands that a user MUST be
    logged in and redirects you to a login page if not logged
    in
    """
    form = UpdateAccountForm()
    if form.validate_on_submit():
        """Validates all input from the form according
        to fields and data submitted
        """
        if form.picture.data:
            picture_file = save_picture(form.picture.data)
            current_user.image_file = picture_file
        current_user.username = form.username.data
        current_user.email = form.email.data
        storage.save()
        flash('Your account has been updated!')
        return redirect(url_for('account'))
    elif request.method == 'GET':
        form.username.data = current_user.username
        form.email.data = current_user.email
    image_file = url_for('static',
                         filename='images/' + current_user.image_file)
    return render_template('account.html', title='Account',
                           image_file=image_file, form=form)


@app.route('/save_custom_timer', methods=['POST', 'GET'])
def save_custom_timer():
    # Parse request data
    data = request.json
    user_id = data.get('user_id')
    name = data.get('name')
    pomodoro_value = data.get('pomodoro_value')
    short_value = data.get('short_value')
    long_value = data.get('long_value')

    # Check if user already has a custom entry
    custom_entry = storage.get_custom_by_user_id(user_id)

    if custom_entry:
        # Update existing entry
        custom_entry.name = name
        custom_entry.pomodoro_value = pomodoro_value
        custom_entry.short_value = short_value
        custom_entry.long_value = long_value
    else:
        # Create new entry
        custom_entry = Custom(
            user_id=user_id,
            name=name,
            pomodoro_value=pomodoro_value,
            short_value=short_value,
            long_value=long_value
        )

    # Save changes to the database
    storage.save()

    return jsonify({'message': 'Custom timer values saved successfully'})

