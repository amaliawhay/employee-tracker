/*# Unit 12 MySQL Homework: Employee Tracker

Developers are often tasked with creating interfaces that make it easy for non-developers to view and 
interact with information stored in databases. Often these interfaces are known as 
**C**ontent **M**anagement **S**ystems. In this homework assignment, your challenge is to architect and 
build a solution for managing a company's employees using node, inquirer, and MySQL.

Bonus points if you're able to:

  * Update employee managers

  * View employees by manager

  * Delete departments, roles, and employees

  * View the total utilized budget of a department -- ie the combined salaries of all employees in 
  that department

We can frame this challenge as follows:

```
As a business owner
I want to be able to view and manage the departments, roles, and employees in my company
So that I can organize and plan my business
```

How do you deliver this? Here are some guidelines:

* Use the [MySQL](https://www.npmjs.com/package/mysql) NPM package to connect to your MySQL database and 
perform queries.

* Use [InquirerJs](https://www.npmjs.com/package/inquirer/v/0.2.3) NPM package to interact with the user
via the command-line.

* Use [console.table](https://www.npmjs.com/package/console.table) to print MySQL rows to the console. 
There is a built-in version of `console.table`, but the NPM package formats the data a little better for 
our purposes.

* You may wish to have a separate file containing functions for performing specific SQL queries you'll 
need to use. Could a constructor function or a class be helpful for organizing these?

* You will need to perform a variety of SQL JOINS to complete this assignment, and it's recommended you 
review the week's activities if you need a refresher on this.

![Employee Tracker](Assets/employee-tracker.gif)

### Hints

* You may wish to include a `seed.sql` file to pre-populate your database. This will make development of 
individual features much easier.

* Focus on getting the basic functionality completed before working on more advanced features.

* Review the week's activities for a refresher on MySQL.

* Check out [SQL Bolt](https://sqlbolt.com/) for some extra MySQL help.

## Minimum Requirements

* Functional application.

* GitHub repository with a unique name and a README describing the project.

* The command-line application should allow users to:

  * Add departments, roles, employees

  * View departments, roles, employees

  * Update employee roles

## Bonus

* The command-line application should allow users to:

  * Update employee managers

  * View employees by manager

  * Delete departments, roles, and employees

  * View the total utilized budget of a department -- ie the combined salaries of all employees in 
  that department*/
//Dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: ")F*WGUsVpV",
  database: "top_songsDB",
});

connection.connect(function (err) {
  if (err) throw err;
  mainMenu();
});

//Portal to menu or quit
function mainMenu() {
  inquirer
    .prompt({
      name: "menu",
      type: "confirm",
      message: "Do you want to add, view or update data?",
    })
    .then(function (res) {
      switch (res.repeat) {
        case true:
          initTracker();
          break;
        case false:
          connection.end();
          break;
      }
    });
}

//function for beginning inquirer prompts
// Build a command-line application that at a minimum allows the user to:

//   * Add departments, roles, employees

//   * Update employee roles
function initTracker() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add a department",
        "Add a role",
        "Add an employee",
        "View departments",
        "View roles",
        "View employees",
        "Update employee roles",
        "exit",
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "Add a department":
          addDept();
          break;

        case "Add a role":
          addRole();
          break;

        case "Add an employee":
          addEmp();
          break;

        case "View departments":
          viewDept();
          break;

        case "View roles":
          viewRole();
          break;

        case "View employees":
          viewEmp();
          break;

        case "Update employee roles":
          update();
          break;
      }
    });
}

//To add a department
function addDept() {
  inquirer
    .prompt({
      name: "newDept",
      type: "input",
      message: "What is the department name?",
    })
    .then(function (res) {
      var query = connection.query(
        "INSERT INTO department SET ?",
        {
          name: res.newDept,
        },
        function (err, res) {
          if (err) throw err;
          console.log(
            res.affectedRows + "department added"
          );
          mainMenu();
        }
      );
      console.log(query.sql);
    });
}

//To add a role
function addRole() {
  inquirer
    .prompt([
      {
        name: "newRole",
        type: "input",
        message: "What is the name of this role?",
      },
      {
        name: "salary",
        type: "input",
        message: "How much is the salary?",
        // decimals?
        // validate: function (value) {
        //   if (isNaN(value) === false) {
        //     return true;
        //   }
        //   return false;
        // },
      },
      {
        name: "deptID",
        type: "input",
        message: "What is the dept. ID number?",
      },
    ])
    .then(function (res) {
      console.log(res);
      var query = connection.query(
        "INSERT INTO role SET ?",
        {
          title: res.newRole,
          salary: res.salary,
          department_id: res.deptID,
        },
        function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + "Role added");
          mainMenu();
        }
      );
      console.log(query.sql);
    });
}

//To add an employee
function addEmp() {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the employee's first name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the employee's last name?",
      },
      {
        name: "roleID",
        type: "input",
        message: "What is this employee's role ID number?",
      },
      {
        name: "managerID",
        type: "input",
        message:
          "What is this employee's manager's ID number?",
      },
    ])
    .then(function (res) {
      console.log(res);
      var query = connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: res.firstName,
          last_name: res.lastName,
          role_id: res.roleID,
          manager_id: res.managerID,
        },
        function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + "Role added");
          mainMenu();
        }
      );
      console.log(query.sql);
    });
}

//   * View departments, roles, employees
//To view departments
function viewDept() {
  var query =
    "SELECT department.name, department.id FROM department";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);

    return res;
  });
}
