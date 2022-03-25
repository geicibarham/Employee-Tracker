INSERT INTO department (name)
VALUES 
    ('sales'),
     ('finance'),
    ('legal'),
    ('engineering')


INSERT INTO roles (title,salary,department_id) 
VALUES
 ('sales representative', 50000, 1),
  ('finance', 80000, 2),
   ('lawyer', 90000 3),
    ('software enginner', 120000, 4);


INSERT INTO employee (first_name, last_name,role_id, manager_id) 
VALUES
 ('Alex', 'Foster',1 ,2),
  ('Katherine', 'Jones',2),
   ('Debra',  'Miller',3,2),
    ('Joseph' ,'Martinez', 4, 2)
    );