#!/usr/bin/python3
""" objects that handle all default RestFul API actions for Users """
from models.task import Task
from models import storage
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request
from flasgger.utils import swag_from

@app_views.route('/tasks', methods=['GET'], strict_slashes=False)
@swag_from('documentation/task/all_tasks.yml')
def get_tasks():
    """
    Retrieves the list of all tasks objects
    """
    all_tasks = storage.all(Task).values()
    list_tasks = []
    for task in all_tasks:
        list_tasks.append(task.to_dict())
    return jsonify(list_tasks)


@app_views.route('/tasks/<task_id>', methods=['GET'], strict_slashes=False)
@swag_from('documentation/task/get_task.yml', methods=['GET'])
def get_tasks_by_id(task_id):
    """ Retrieves a specific task """
    task = storage.get(Task, task_id)
    if not task:
        abort(404)

    return jsonify(task.to_dict())


@app_views.route('/users/<user_id>/tasks', methods=['GET'],
                 strict_slashes=False)
@swag_from('documentation/task/get_user_tasks.yml', methods=['GET'])
def get_user_tasks(user_id):
    """ Retrieves all tasks specific to a user """
    tasks = storage.get_user_objects(user_id, Task)
    if not tasks:
        abort(404)

    return jsonify(tasks)


@app_views.route('/users/<user_id>/tasks/<task_id>', methods=['GET'],
                 strict_slashes=False)
@swag_from('documentation/task/get_specific_user_task.yml', methods=['GET'])
def get_specific_user_task(user_id, task_id):
    """ Retrieves specific task to a user """
    tasks = storage.get_user_objects(user_id, Task)
    if not tasks:
        abort(404)
    if task_id in tasks:
        return jsonify(tasks[task_id])


@app_views.route('/users/<user_id>/tasks/<task_id>', methods=['DELETE'],
                 strict_slashes=False)
@swag_from('documentation/task/delete_task.yml', methods=['DELETE'])
def delete_task(user_id, task_id):
    """
    Deletes a user Object
    """

    tasks = storage.get_user_objects(user_id, Task)
    if not tasks:
        abort(404)
    if task_id in tasks:
        task = storage.get(Task, task_id)
        if task:
            storage.delete(task)
            storage.save()
        else:
            abort(404)
    else:
        abort(404)

    return make_response(jsonify({}), 200)


@app_views.route('/users/<user_id>/tasks', methods=['DELETE'],
                 strict_slashes=False)
@swag_from('documentation/task/delete_all_tasks.yml', methods=['DELETE'])
def delete_all_tasks(user_id):
    """
    Deletes all tasks from a specific user Object
    """

    tasks = storage.get_user_objects(user_id, Task)
    if not tasks:
        abort(404)
    for task_id in tasks:
        task = storage.get(Task, task_id)
        if task:
            storage.delete(task)
        else:
            abort(404)

    storage.save()
    return make_response(jsonify({}), 200)


@app_views.route('/users/<user_id>/tasks', methods=['POST'],
                 strict_slashes=False)
@swag_from('documentation/task/post_task.yml', methods=['POST'])
def post_task(user_id):
    """
    Creates a task
    """
    if not request.get_json():
        abort(400, description="Not a JSON")

    if 'content' not in request.get_json():
        abort(400, description="Missing content")

    data = request.get_json()['content']
    instance = Task(user_id=user_id, content=data)
    instance.save()
    return make_response(jsonify(instance.to_dict()), 201)


@app_views.route('/users/<user_id>/tasks/<task_id>', methods=['PUT'],
                 strict_slashes=False)
@swag_from('documentation/task/put_task.yml', methods=['PUT'])
def put_task(user_id, task_id):
    """
    Updates a task
    """
    if not request.get_json():
        abort(400, description="Not a JSON")

    task = storage.get(Task, task_id)
    if not task:
        abort(404)

    ignore = ['id', 'user_id','created_at', 'updated_at']
    data = request.get_json()
    for key, value in data.items():
        if key not in ignore:
            setattr(task, key, value)

    storage.save()
    return make_response(jsonify(task.to_dict()), 200)
