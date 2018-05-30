const mongoose = require('mongoose');
const dbConfig = require('../config/db-config.json');

if(dbConfig.mongo.state === 'remote') {
    mongoose.connect(`mongodb://${dbConfig.mongo.id}:${dbConfig.mongo.password}@${dbConfig.remoteUrl}:${dbConfig.mongo.port}/vote`);
} else {
    mongoose.connect(`mongodb://${dbConfig.mongo.id}:${dbConfig.mongo.password}@${dbConfig.localUrl}:${dbConfig.mongo.port}/vote`);
}

module.exports = mongoose;