import unittest
import models
from models import custom
from models.base_model import BaseModel

Custom = custom.Custom


class TestCustom(unittest.TestCase):
    """Test the Custom class"""

    @classmethod
    def setUpClass(cls):
        """Set up for the test"""
        cls.custom = Custom()

    def test_is_subclass(self):
        """Test that Custom is a subclass of BaseModel"""
        self.assertIsInstance(self.custom, BaseModel)
        self.assertTrue(hasattr(self.custom, "id"))
        self.assertTrue(hasattr(self.custom, "created_at"))
        self.assertTrue(hasattr(self.custom, "updated_at"))

    def test_user_id_attr(self):
        """Test that Custom has attr user_id, and it's an empty string"""
        self.assertTrue(hasattr(self.custom, "user_id"))
        if models.storage_t == 'db':
            self.assertEqual(self.custom.user_id, None)
        else:
            self.assertEqual(self.custom.user_id, "")

    def test_name_attr(self):
        """Test that Custom has attr name, and it's an empty string"""
        self.assertTrue(hasattr(self.custom, "name"))
        if models.storage_t == 'db':
            self.assertEqual(self.custom.name, None)
        else:
            self.assertEqual(self.custom.name, "")

    def test_pomodoro_value_attr(self):
        """Test that Custom has attr pomodoro_value, and it's an empty string"""
        self.assertTrue(hasattr(self.custom, "pomodoro_value"))
        if models.storage_t == 'db':
            self.assertEqual(self.custom.pomodoro_value, None)
        else:
            self.assertEqual(self.custom.pomodoro_value, "")

    def test_short_value_attr(self):
        """Test that Custom has attr short_value, and it's an empty string"""
        self.assertTrue(hasattr(self.custom, "short_value"))
        if models.storage_t == 'db':
            self.assertEqual(self.custom.short_value, None)
        else:
            self.assertEqual(self.custom.short_value, "")

    def test_long_value_attr(self):
        """Test that Custom has attr long_value, and it's an empty string"""
        self.assertTrue(hasattr(self.custom, "long_value"))
        if models.storage_t == 'db':
            self.assertEqual(self.custom.long_value, None)
        else:
            self.assertEqual(self.custom.long_value, "")

    def test_to_dict_creates_dict(self):
        """test to_dict method creates a dictionary with proper attrs"""
        new_d = self.custom.to_dict()
        self.assertEqual(type(new_d), dict)
        self.assertFalse("_sa_instance_state" in new_d)
        for attr in self.custom.__dict__:
            if attr is not "_sa_instance_state":
                self.assertTrue(attr in new_d)
        self.assertTrue("__class__" in new_d)

    def test_to_dict_values(self):
        """test that values in dict returned from to_dict are correct"""
        t_format = "%Y-%m-%dT%H:%M:%S.%f"
        new_d = self.custom.to_dict()
        self.assertEqual(new_d["__class__"], "Custom")
        self.assertEqual(type(new_d["created_at"]), str)
        self.assertEqual(type(new_d["updated_at"]), str)
        self.assertEqual(new_d["created_at"], self.custom.created_at.strftime(t_format))
        self.assertEqual(new_d["updated_at"], self.custom.updated_at.strftime(t_format))

    def test_str(self):
        """test that the str method has the correct output"""
        string = "[Custom] ({}) {}".format(self.custom.id, self.custom.__dict__)
        self.assertEqual(string, str(self.custom))


if __name__ == "__main__":
    unittest.main()
