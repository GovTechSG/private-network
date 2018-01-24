module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*' // Match any network id
    },
    parity: { // test parity client
      host: '127.0.0.1',
      port: 8545,
      network_id: '16962'
    }
  }
}
