#!/usr/bin/python3
"""Runs the Priotask Web Application """
from web_dynamic.routes import app

if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5000)
    # Remember to disbale debug for production
