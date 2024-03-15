#!/usr/bin/python3
""" Starts a Flash Web Application """
from models import storage
from models.task import Task

from os import environ
from flask import Flask, render_template
import uuid
app = Flask(__name__)
# app.jinja_env.trim_blocks = True
# app.jinja_env.lstrip_blocks = True


@app.teardown_appcontext
def close_db(error):
    """ Remove the current SQLAlchemy Session """
    storage.close()


@app.route('/101-hbnb/', strict_slashes=False)
def hbnb():
    """ HBNB is alive! """
    states = storage.all(Task).values()
    states = sorted(states, key=lambda k: k.name)
    st_ct = []



    return render_template('101-hbnb.html',
                           states=st_ct,
                           cache_id=uuid.uuid4())


if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5000)
