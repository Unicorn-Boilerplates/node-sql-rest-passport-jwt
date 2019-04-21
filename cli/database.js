#!/usr/bin/env node

const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const shell = require("shelljs");
  
const Sequelize = require('sequelize');

const init = () => {
  console.log('Setupd DB'
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

const writeConfig = (settings) => {
	shell.mkdir('-p', `${process.cwd()}/config`);
  const filePath = `${process.cwd()}/config/database.js`
  shell.touch(filePath);

	var configuration = {}
	configuration.development = {
    username: settings.Username,
    password: settings.Password,
    database: settings.DatabaseName,
    host: settings.Host,
    port: settings.Port,
    dialect: settings.DatabaseType,
	};


	const exportString = 'module.exports = ' + JSON.stringify(configuration);
	shell.ShellString(exportString).to(filePath);
  console.log(
    chalk.green.bold(`Database configured, configuration file available at: ${filePath}`)
  );
  return filePath;	
};

const checkDatabase = settings => {
	settings.Port = settings.Port || 3306;
	settings.DatabaseType = settings.DatabaseType || 'mysql';
	const { DatabaseType, Host, Port, Username, Password, DatabaseName } = settings;
	const sequelize = new Sequelize(DatabaseName, Username, Password, {
	  host: Host,
		port: Port,
	  dialect: DatabaseType,
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
		writeConfig(settings);
		shell.exit(0);
	}).catch(err => {
	  console.log(chalk.red.bold('There was a problem:', err.name));
	  console.log(chalk.white('Run again the configuration script, to start over'));
	  shell.exit(1);
	});
};
run();