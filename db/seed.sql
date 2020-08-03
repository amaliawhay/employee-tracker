INSERT INTO department
    (name)
VALUES
    ("Laboratory"),
    ("Office"),
    ("Administration")

INSERT INTO role
    (title, salary, department_id)
VALUES
    ("Lab Technician", 40000.00, 1),
    ("Toxicologist", 100000.00, 1),
    ("Office Manager", 60000.00, 2),
    ("Office Assistant", 20000.00, 2),
    ("Business Manager", 150000.00, 3)

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ("Kerry", "Smith", 1, 2),
    ("Emily", "Gregory", 2),
    ("Ian", "Martinez", 3, 5),
    ("Amalia", "Hay", 4, 3),
    ("Matt", "Jones", 5)

