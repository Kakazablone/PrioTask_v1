#!/usr/bin/python3
""" objects that handle all default RestFul API actions for Users """
from models.custom import Custom
from models import storage
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request
from flasgger.utils import swag_from


@app_views.route('/users/custom', methods=['GET'], strict_slashes=False)
@swag_from('documentation/custom/all_custom.yml')
def get_custom():
    """
    Retrieves the list of all custom objects
    of all users
    """
    all_custom = storage.all(Custom).values()
    list_custom = []
    for custom in all_custom:
        list_custom.append(custom.to_dict())
    return jsonify(list_custom)


@app_views.route('/users/<user_id>/custom', methods=['GET'],
                 strict_slashes=False)
@swag_from('documentation/custom/get_user_custom.yml')
def get_user_custom(user_id):
    """
    Retrieves the list of all custom objects
    of a specific user
    """
    custom = storage.get_user_objects(user_id, Custom)
    if not custom:
        abort(404)

    return jsonify(custom)


@app_views.route('/users/<user_id>/custom/<custom_id>', methods=['GET'],
                 strict_slashes=False)
@swag_from('documentation/custom/get_specific_custom.yml', methods=['GET'])
def get_specific_custom(user_id, custom_id):
    """ Retrieves a specific custom of a specific user """
    custom = storage.get_user_objects(user_id, Custom).get(custom_id)
    if not custom:
        abort(404)
    else:
        return jsonify(custom)


@app_views.route('/users/<user_id>/custom/<custom_id>', methods=['DELETE'],
                 strict_slashes=False)
@swag_from('documentation/custom/delete_custom.yml', methods=['DELETE'])
def delete_custom(user_id, custom_id):
    """
    Deletes a specific custom Object
    """

    custom = storage.get_user_objects(user_id, Custom)
    if not custom:
        abort(404)
    if custom_id in custom:
        customs = storage.get(Custom, custom_id)
        if customs:
            storage.delete(customs)
            storage.save()
        else:
            abort(404)
    else:
        abort(404)

    return make_response(jsonify({}), 200)


@app_views.route('/users/<user_id>/custom', methods=['DELETE'],
                 strict_slashes=False)
@swag_from('documentation/custom/delete_all_custom.yml', methods=['DELETE'])
def delete_all_custom(user_id):
    """
    Deletes all custom Objects
    """

    custom = storage.get_user_objects(user_id, Custom)

    if not custom:
        abort(404)

    for custom_id in custom:
        customs = storage.get(Custom, custom_id)
        if customs:
            storage.delete(customs)
        else:
            abort(404)

    storage.save()
    return make_response(jsonify({}), 200)


@app_views.route('/users/<user_id>/custom', methods=['POST'],
                 strict_slashes=False)
@swag_from('documentation/custom/post_custom.yml', methods=['POST'])
def post_custom(user_id):
    """
    Creates a custom object
    """
    if not request.get_json():
        abort(400, description="Not a JSON")

    if 'name' not in request.get_json():
        abort(400, description="Missing name")
    if 'pomodoro_value' not in request.get_json():
        abort(400, description="Missing pomodoro_value")
    if 'short_value' not in request.get_json():
        abort(400, description="Missing short_value")
    if 'long_value' not in request.get_json():
        abort(400, description="Missing long_value")

    data = request.get_json()
    required_fields = ['name', 'pomodoro_value', 'short_value', 'long_value']
    for field in required_fields:
        if field not in data:
            abort(400, description=f"Missing {field}")

    name = data['name']
    pomodoro_value = data['pomodoro_value']
    short_value = data['short_value']
    long_value = data['long_value']

    instance = Custom(user_id=user_id, name=name,
                      pomodoro_value=pomodoro_value,
                      short_value=short_value,
                      long_value=long_value)
    instance.save()
    return make_response(jsonify(instance.to_dict()), 201)


@app_views.route('/users/<user_id>/custom/<custom_id>', methods=['PUT'],
                 strict_slashes=False)
@swag_from('documentation/custom/put_custom.yml', methods=['PUT'])
def put_custom(user_id, custom_id):
    """
    Updates user specific custom settings
    """
    if not request.get_json():
        abort(400, description="Not a JSON")

    custom = storage.get(Custom, custom_id)
    if not custom:
        abort(404)

    ignore = ['id', 'created_at', 'updated_at']
    data = request.get_json()
    for key, value in data.items():
        if key not in ignore:
            setattr(custom, key, value)
    storage.save()
    return make_response(jsonify(custom.to_dict()), 200)
