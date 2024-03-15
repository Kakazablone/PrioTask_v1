-- prepares a MySQL server for the project

CREATE DATABASE IF NOT EXISTS priotask_test_db;
CREATE USER IF NOT EXISTS 'priotask_test'@'localhost' IDENTIFIED BY 'priotask_test_pwd';
GRANT ALL PRIVILEGES ON `priotask_test_db`.* TO 'priotask_test'@'localhost';
GRANT SELECT ON `performance_schema`.* TO 'priotask_test'@'localhost';
FLUSH PRIVILEGES;
