const dbConfig = require('./config/db-config.json');

module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: dbConfig.state === 'remote' ? dbConfig.remoteUrl : dbConfig.localUrl,
      port: 8545,
      network_id: "5378"
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 500
    }
  } 
};
