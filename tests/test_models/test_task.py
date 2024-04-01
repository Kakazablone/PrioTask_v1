#!/usr/bin/python3
"""
Contains the TestTaskDocs and TestTask classes
"""

import inspect
import models
from models import task
from models.base_model import BaseModel
import pep8
import unittest
Task = task.Task


class TestTaskDocs(unittest.TestCase):
    """Tests to check the documentation of Task class"""
    @classmethod
    def setUpClass(cls):
        """Set up for the doc tests"""
        cls.task_f = inspect.getmembers(Task, inspect.isfunction)

    def test_pep8_conformance_task(self):
        """Test that task.py adheres to PEP8."""
        pep8s = pep8.StyleGuide(quiet=True)
        result = pep8s.check_files(['models/task.py'])
        self.assertEqual(result.total_errors, 0,
                         "Found code style errors.")

    def test_task_module_docstring(self):
        """Test for the task.py module docstring"""
        self.assertIsNot(task.__doc__, None,
                         "input a docstring")
        self.assertTrue(len(task.__doc__) >= 1,
                        "input a docstring")

    def test_task_class_docstring(self):
        """Test for the Task class docstring"""
        self.assertIsNot(Task.__doc__, None,
                         "Task class needs a docstring")
        self.assertTrue(len(Task.__doc__) >= 1,
                        "Task class needs a docstring")

    def test_task_func_docstrings(self):
        """Test for the presence of docstrings in Task methods"""
        for func in self.task_f:
            self.assertIsNot(func[1].__doc__, None,
                             "{:s} method needs a docstring".format(func[0]))
            self.assertTrue(len(func[1].__doc__) >= 1,
                            "{:s} method needs a docstring".format(func[0]))


class TestTask(unittest.TestCase):
    """Test the Task class"""
    def test_is_subclass(self):
        """Test that Task is a subclass of BaseModel"""
        task = Task()
        self.assertIsInstance(task, BaseModel)
        self.assertTrue(hasattr(task, "id"))
        self.assertTrue(hasattr(task, "created_at"))
        self.assertTrue(hasattr(task, "updated_at"))

    def test_user_id_attr(self):
        """Test that Task has attr user_id, and it's an empty string"""
        task = Task()
        self.assertTrue(hasattr(task, "user_id"))
        if models.storage_t == 'db':
            self.assertEqual(task.user_id, None)
        else:
            self.assertEqual(task.user_id, "")

    def test_content_attr(self):
        """Test that Task has attr content, and it's an empty string"""
        task = Task()
        self.assertTrue(hasattr(task, "content"))
        if models.storage_t == 'db':
            self.assertEqual(task.content, None)
        else:
            self.assertEqual(task.content, "")

    def test_to_dict_creates_dict(self):
        """test to_dict method creates a dictionary with proper attrs"""
        t = Task()
        new_d = t.to_dict()
        self.assertEqual(type(new_d), dict)
        self.assertFalse("_sa_instance_state" in new_d)
        for attr in t.__dict__:
            if attr is not "_sa_instance_state":
                self.assertTrue(attr in new_d)
        self.assertTrue("__class__" in new_d)

    def test_to_dict_values(self):
        """test that values in dict returned from to_dict are correct"""
        t_format = "%Y-%m-%dT%H:%M:%S.%f"
        t = Task()
        new_d = t.to_dict()
        self.assertEqual(new_d["__class__"], "Task")
        self.assertEqual(type(new_d["created_at"]), str)
        self.assertEqual(type(new_d["updated_at"]), str)
        self.assertEqual(new_d["created_at"], t.created_at.strftime(t_format))
        self.assertEqual(new_d["updated_at"], t.updated_at.strftime(t_format))

    def test_str(self):
        """test that the str method has the correct output"""
        task = Task()
        string = "[Task] ({}) {}".format(task.id, task.__dict__)
        self.assertEqual(string, str(task))


if __name__ == "__main__":
    unittest.main()
