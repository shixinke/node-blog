const db = {};
const Sequelize = require('sequelize');
const conf = require('./conf.js').database;
db.Sequelize = Sequelize;
db.db = new Sequelize(conf.dbname, conf.user, conf.password, {host : conf.host, port : conf.port, pool : conf.pool});


module.exports = db;