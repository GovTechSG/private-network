module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 4600000
    },
    parity_master: {
      // test parity client master
      host: "127.0.0.1",
      port: 8545,
      network_id: "16962",
      gasLimit: 4600000,
      gas: 4600000
    },
    parity_authority1: {
      // test parity client master
      host: "127.0.0.1",
      port: 8546,
      network_id: "16962"
    },
    parity_authority2: {
      // test parity client master
      host: "127.0.0.1",
      port: 8547,
      network_id: "16962"
    },
    parity_authority3: {
      // test parity client master
      host: "127.0.0.1",
      port: 8548,
      network_id: "16962"
    },
    docker_ci: {
      host: "ganache",
      port: 8545,
      network_id: "1337",
      gas: 4600000
    }
  }
};
