var settings = require("../settings");
var mongodb = require("mongodb");
var Db = mongodb.Db;
var Server = mongodb.Server;

module.exports = new Db(settings.db, new Server(settings.host, settings.port, {}));