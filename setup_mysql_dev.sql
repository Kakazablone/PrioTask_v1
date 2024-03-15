-- prepares a MySQL server for the project

CREATE DATABASE IF NOT EXISTS priotask_dev_db;
CREATE USER IF NOT EXISTS 'priotask_dev'@'localhost' IDENTIFIED BY 'priotask_dev_pwd';
GRANT ALL PRIVILEGES ON `priotask_dev_db`.* TO 'priotask_dev'@'localhost';
GRANT SELECT ON `performance_schema`.* TO 'priotask_dev'@'localhost';
FLUSH PRIVILEGES;
