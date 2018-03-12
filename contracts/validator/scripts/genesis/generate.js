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
          "truffle exec scripts/genesis/generate.js -v <addr> -v <addr> --master=<addr> --outer=<addr> --inner=<addr> --validatorsContract=<addr>"
        ].join("\n")
      )
      .version("0.0.1")
      .option("master", {
        demand: true,
        describe: "address for master account",
        string: true
      })
      .option("validator", {
        alias: "v",
        describe:
          "(multiple) addresses of initial validators, repeat option for multiple",
        string: true
      })
      .option("name", {
        describe: "network name",
        string: true
      })
      .option("blockReward", {
        describe: "in Wei",
        string: true
      })
      .option("stepDuration", {
        describe: "voting round length in seconds",
        string: true
      })
      .option("outer", {
        demand: true,
        describe: "outer set contract address",
        string: true
      })
      .option("inner", {
        demand: true,
        describe: "initial inner set contract address",
        string: true
      })
      .option("networkId", {
        describe: "network ID",
        string: true
      })
      .option("stderr", {
        describe: "print to stderr instead of stdout",
        default: false
      });

    const output = argv.stderr ? console.error : console.log; // eslint-disable-line

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
              contract: argv.outer
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
    output(JSON.stringify(result, null, 2)); // eslint-disable-line
  } catch (e) {
    cb(e);
    return;
  }
  cb();
};
