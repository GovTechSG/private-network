// truffle exec scripts/generateGenesis.js \
// --validator=0xfC4C1475C4DaBfcBB49dc2138337F9db8eedfF58 \
// --validator=0xa2557aB1F214600A7AD1fA12fCad0C97135eeEA6 \
// --master=0xfC4C1475C4DaBfcBB49dc2138337F9db8eedfF58 \
// --outer=0x0000000000000000000000000000000000000005 \
// --inner=0x0000000000000000000000000000000000000006 \
// --validatorsContract=0x0000000000000000000000000000000000000005

const yargs = require("yargs");
const _ = require("lodash");
const template = require("./genesisTemplate.json");

const OuterSet = artifacts.require("OuterSet");
const InnerSetInitial = artifacts.require("InnerSetInitial");

module.exports = async function generateGenesis(cb) {
  try {
    const { argv } = yargs
      .usage(
        [
          "Use Truffle to generate a genesis JSON file for a Parity PoA network",
          "",
          "truffle exec scripts/generateGenesis.js -v <addr> -v <addr> --master=<addr> --outer=<addr> --inner=<addr> --validatorsContract=<addr>"
        ].join("\n")
      )
      .version("0.0.1")
      .option("master", {
        demand: true,
        describe: "address for master account"
      })
      .option("validator", {
        alias: "v",
        describe:
          "(multiple) addresses of initial validators, repeat option for multiple"
      })
      .option("name", { describe: "network name" })
      .option("blockReward")
      .option("stepDuration", { describe: "voting round length" })
      .option("outer", { demand: true, describe: "outer set contract address" })
      .option("inner", {
        demand: true,
        describe: "initial inner set contract address"
      })
      .option("validatorsContract", { demand: true })
      .option("networkId", { describe: "network ID" });

    const outer = await OuterSet.new(0, argv.master);
    const initial = await InnerSetInitial.new(0, [].concat(argv.validator));

    const accounts = {};
    accounts[argv.outer] = {
      balance: 1,
      constructor: outer.constructor.bytecode
    };
    accounts[argv.inner] = {
      balance: 1,
      constructor: initial.constructor.bytecode
    };

    const options = {
      name: argv.name,
      engine: {
        authorityRound: {
          params: {
            stepDuration: argv.stepDuration,
            validators: {
              contract: argv.validatorsContract
            },
            blockReward: argv.blockReward
          }
        }
      },
      params: {
        networkID: argv.networkID
      },
      accounts
    };

    // Deep merge
    const result = _.merge({}, template, options);
    console.log(JSON.stringify(result, null, 2)); // eslint-disable-line
  } catch (e) {
    cb(e);
    return;
  }
  cb();
};
