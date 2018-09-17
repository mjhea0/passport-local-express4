const path = require('path');
require('dotenv').config();
const env = process.env;


module.exports = {
    contracts_directory: "./app/ethereum/contracts",
    migrations_directory: "./app/ethereum/migrations",
    contracts_build_directory: path.join(__dirname, "./app/ethereum/build/contracts"),
    test_directory: "./test/ethereum",
    networks: {
        development: {
            host: env.GANACHE_URL,
            port: env.GANACHE_PORT,
            network_id: env.GANACHE_NETWORK_ID
        }
    },
    solc: {
        optimizer: {
            enabled: true,
            runs: 500
        }
    }
};
