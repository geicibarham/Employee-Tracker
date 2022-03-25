
const mysql = require("mysql2");
require('dotenv').config();
const inquirer = require('inquirer');
const cTable = require('console.table');
const chalk = require('chalk');
const CFonts = require('cfonts');

// Connect to database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const welcome = () => {
  return CFonts.say('Welcome|to|Employee|Tracker!', {
    font: 'simple',
    align: 'center',
    colors: ['magentaBright'],
    background: 'transparent',
    letterSpacing: 0,
    lineHeight: 1,
    maxLength: '8',
    env: 'node'
  });
}
welcome();

const options = [
  {
    type: 'list',
    name: 'options',
    message: 'what Would you like to do?',
    choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'quit']

  },
];

const optionsAsk = () => {


  return inquirer.prompt(options)

    .then((answers) => {

      if (answers.options === 'view all departments') {
        viewDepartments();

      }
      if (answers.options === 'view all roles') {
        viewRoles();

      }

      if (answers.options === 'view all employees') {
        viewEmployees();

      }

      if (answers.options === 'add a department') {
        addDeparment();

      }

      if (answers.options === 'add a role') {
        addRole();

      }

      if (answers.options === 'add an employee') {
        addEmployee();
      }

      if (answers.options === 'update an employee role') {
        updateEmployee();
      }

      if (answers.options === 'quit') {
        quit();
      }

    });
}

const viewDepartments = () => {
  let query = `SELECT * FROM department`

  connection.query(query, function (err, res) {
    if (err) throw err;


    console.table(res);
    console.log(chalk.white.bgMagentaBright.bold('Viewing departments!'));


    optionsAsk();

  });
}

const viewRoles = () => {
  let query = `SELECT * FROM roles`

  connection.query(query, function (err, res) {
    if (err) throw err;


    console.table(res);
    console.log(chalk.green('Viewing roles!'));

    optionsAsk();

  });
}

const viewEmployees = () => {
  // HEELLLLLLLLLLLLLP WITH JOIN QUERY
  let query = `
  SELECT first_name, last_name, title, salary, department.name 
  FROM employee
  LEFT JOIN roles
  ON role_id = roles.id
  LEFT JOIN department
  ON department_id = department.id`

  connection.query(query, function (err, res) {
    if (err) throw err;


    console.table(res);
    console.log("Viewing roles!");

    optionsAsk();

  });
}

const addDeparment = () => {

  inquirer.prompt([

    {

      type: 'input',
      name: 'name',
      message: 'What department would you like to add?'
    }
  ])
    .then((answers) => {

      let query = `INSERT INTO department (name) VALUES ("${answers.name}");`
      connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log(chalk.yellowBright('Department added!'));
        optionsAsk();
      })
    })



}

const addRole = () => {

  inquirer.prompt([

    {
      type: 'input',
      name: 'title',
      message: 'What role would you like to add?'
    },

  ])
    .then((answers) => {

      let query = `INSERT INTO roles (title,salary,department_id)  VALUES ("${answers.title}" ,"${answers.salary}" ,"${answers.id}");`

      connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log(chalk.magenta('Department added!'));
        optionsAsk();
      })
    })


}

const addEmployee = () => {

  inquirer.prompt([

    {
      type: 'input',
      name: 'firstname',
      message: "What is the employee's first name?"
    },

    {
      type: 'input',
      name: 'lastname',
      message: "What is the employee's last name?"
    },

    {
      type: 'input',
      name: 'roleid',
      message: "What is the employee's role_id?"
    },

    {
      type: 'input',
      name: 'managerid',
      message: "What is the employee's manager_id? - type null if they do't have a manager!"
    },
  ])
    .then((answers) => {

      let query = `INSERT INTO employee (first_name, last_name, role_id, manager_id)  VALUES ("${answers.firstname}" ,"${answers.lastname}" ,"${answers.roleid}" ,"${answers.managerid});`

      connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log(chalk.yellowBright('Employee added!'));
        optionsAsk();
      })
    })


}

const getRoles = () => {
  return connection.promise().query('SELECT * FROM roles')
}

const getEmployees = () => {
  return connection.promise().query('SELECT * FROM employee')
}

const updateEmployee = async () => {
  const [rows] = await getEmployees();
  // console.log(rows)
  const employeeChoices = rows.map(employee => (
    {
      name: employee.first_name,
      value: employee.id
    }
  ))
  console.log(employeeChoices)

  inquirer.prompt([

    {
      type: 'list',
      name: 'employee',
      message: 'What employee would you like to update?',
      choices: employeeChoices
    },
  ])
    .then(async (answers) => {
      // console.log(answers)
      const [rows] = await getRoles();
      // console.log(rows)
      // const roleChoices = rows.map(roles => (
      //   {
      //     name: roles.title,
      //     value: roles.id
      //   }
      // ))

      const newArr = [];
      for (i = 0; i < rows.length; i++) {
        let newObj = {
          name: rows[i].title,
          value: rows[i].id
        }

        newArr.push(newObj)
      }

      inquirer.prompt([
        {
          type: 'list',
          name: 'role',
          message: 'What employee would you like to update?',
          // choices: roleChoices
          choices: newArr
        },
      ]).then(roleAnswers => {

        // let query = `ALTER TABLE eployee (title,salary,department_id)  VALUES ("${answers.title}" ,"${answers.salary}" ,"${answers.id}");`
        let example = `
        UPDATE employee
        SET role_id = ?
        WHERE id = ?
        `
        connection.query(example, [roleAnswers.role, answers.employee], function (err, res) {
          if (err) throw err;
          // console.table(res);
          console.log(chalk.cyanBright('Role updated'));
          optionsAsk();
        })
      })
    })


}

const quit = () => {
  
  return CFonts.say('GoodBye', {
    font: 'simple',
    align: 'center',
    colors: ['magentaBright'],
    background: 'transparent',
    letterSpacing: 0,
    lineHeight: 1,
    maxLength: '8',
    env: 'node'
  });
}

optionsAsk();


