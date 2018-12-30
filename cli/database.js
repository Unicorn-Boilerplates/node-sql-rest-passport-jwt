#!/usr/bin/env node

const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const shell = require("shelljs");
  
  const Sequelize = require('sequelize');

const init = () => {
  console.log(
    chalk.green(
      figlet.textSync("Setup Database", {
        horizontalLayout: "default",
        font: 'chunky',
        verticalLayout: "default"
      })
    )
  );
};

const askDatabaseConnectionInfo = () => {
  const questions = [
    {
      name: "DatabaseType",
      type: "list",
      message: "What database do you plan to use?",
      choices: ["mysql", "sqlite", "postgres", "mssql"],
      filter: function(val) {
        return val.split(".")[1];
      }
    },
    {
      type: "input",
      name: "Host",
      message: "What's the host name? (port will be asked next)",
    },
    {
      type: "input",
      name: "Port",
      message: "What's the port number?",
    },
    {
      type: "input",
      name: "Username",
      message: "What's the database username?",
    },
    {
			type: 'password',
		  mask: '*',
      name: "Password",
      message: "What's the database password?",
    },
    {
      type: "input",
      name: "DatabaseName",
      message: "What's the database name? This must exist already.",
    }
  ];
  return inquirer.prompt(questions);
};

const createFile = (filename, extension) => {
	shell.mkdir('-p', `${process.cwd()}/config`);
  const filePath = `${process.cwd()}/config/database.js`
  shell.touch(filePath);
  return filePath;
};

const success = filepath => {
  console.log(
    chalk.green.bold(`Database configured, configuration file available at: ${filepath}`)
  );
};

const checkDatabase = settings => {
	const { DatabaseType, Host, Port, Username, Password, DatabaseName } = settings;
	const sequelize = new Sequelize(DatabaseName, Username, Password, {
	  host: Host,
		port: Port || 3306,
	  dialect: DatabaseType || 'mysql',
	  "operatorsAliases": false,
	  logging: false
	});

	return sequelize.authenticate();

}

const run = async () => {
  // show script introduction
  init();

  // ask questions
  const settings = await askDatabaseConnectionInfo();
 
  // try configuration
	checkDatabase(settings).then(() => {
		const filePath = createFile(settings);
		success(filePath);
		shell.exit(1);
	}).catch(err => {
	  console.log(chalk.red.bold('There was a problem:', err.name));
	  console.log(chalk.white('Run again the configuration script, to start over'));
	  shell.exit(1);
	});
};
run();