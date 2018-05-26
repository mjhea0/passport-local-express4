const dbConfig = require('./config/db-config.json');

module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: dbConfig.ganache.state === 'remote' ? dbConfig.remoteUrl : dbConfig.localUrl,
      port: dbConfig.ganache.port,
      network_id: dbConfig.ganache.networkId
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 500
    }
  } 
};
