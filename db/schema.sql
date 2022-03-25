DROP DATABASE IF EXISTS employeeTracker_db;
CREATE DATABASE employeeTracker_db;

USE employeeTracker_db;

CREATE TABLE department (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(30) NOT NULL,


);

CREATE TABLE roles (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
 title VARCHAR(30) NOT NULL,
 salary DECIMAL NOT NULL,
 department_id INTEGER
 FOREIGN KEY (deparment_id) REFERENCES deparment(id) ON DELETE SET NULL

);

CREATE TABLE employee (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INTEGER,
 manager_id INTEGER
 FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
 FOREIGN KEY (manager_id) REFERENCES employee(manager_id) ON DELETE SET NULL
);




);