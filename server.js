//Dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: ")F*WGUsVpV",
  database: "cms_db",
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
      switch (res.menu) {
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
        //validate to check for decimals/number input
        validate: function (value) {
          if (isNaN(parseFloat(value))) {
            console.log("\n Please enter a decimal value.");
            return false;
          }
          return true;
        },
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
          salary: parseFloat(res.salary).toFixed(2),
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
    "SELECT department.id, department.name FROM department";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    mainMenu();
    return res;
  });
}

//To view roles
function viewRole() {
  var query =
    "SELECT role.id, role.title, role.salary, role.department_id FROM role";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);

    mainMenu();
    return res;
  });
}

//To view employees
function viewEmp() {
  var query =
    "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id FROM employee";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);

    mainMenu();
    return res;
  });
}

//   * Update employee roles
//To update employee roles
function update() {
  var employeeQuery =
    "SELECT employee.first_name, employee.last_name, employee.id FROM employee";
  connection.query(employeeQuery, function (
    err,
    employeeRes
  ) {
    if (err) throw err;
    var roleQuery =
      "SELECT role.title, role.department_id FROM role";
    connection.query(roleQuery, function (err, roleRes) {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: "employeeId",
            type: "rawlist",
            message:
              "What is the first and last name of the employee you would like to update?",
            choices: function () {
              var employeesArr = [];
              for (var i = 0; i < employeeRes.length; i++) {
                employeesArr.push(
                  employeeRes[i].first_name +
                    " " +
                    employeeRes[i].last_name
                );
              }
              return employeesArr;
            },
          },
          {
            name: "newRole",
            type: "rawlist",
            message: "What is this employee's new role?",
            choices: function () {
              var rolesArr = [];
              for (var i = 0; i < roleRes.length; i++) {
                rolesArr.push(roleRes[i].title);
              }
              return rolesArr;
            },
          },
        ])
        .then(function (answer) {
          console.log(answer);

          var chosenEmployee;
          for (var i = 0; i < employeeRes.length; i++) {
            if (
              employeeRes[i].first_name +
                " " +
                employeeRes[i].last_name ===
              answer.employeeId
            ) {
              chosenEmployee = employeeRes[i];
              console.log(chosenEmployee.id);
            }
          }
          // console.log(answer.newRole);
          var chosenRole;
          for (var i = 0; i < roleRes.length; i++) {
            // console.log(roleRes[i]);
            if (roleRes[i].title === answer.newRole) {
              chosenRole = roleRes[i];
              console.log(chosenRole.department_id);
            }
          }
          connection.query(
            "UPDATE employee SET ? WHERE ?",
            [
              { role_id: chosenRole.department_id },
              {
                id: chosenEmployee.id,
              },
            ],
            function (error) {
              if (error) throw err;
              console.log("updated successfully!");
              mainMenu();
            }
          );
        });
    });
  });
}
