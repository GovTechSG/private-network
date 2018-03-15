const yargs = require("yargs");
const _ = require("lodash");
const template = require("./genesisTemplate.json");

const OuterSet = artifacts.require("OuterSet");
const InnerSetInitial = artifacts.require("InnerSetInitial");

const clearTruffle = () => {
  process.stdout.write("\r\x1b[A\x1b[A\x1b[2K");
};

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
        string: true,
        default: "DemoPoA"
      })
      .option("blockReward", {
        describe: "in Wei",
        string: true,
        default: "0x4563918244F40000"
      })
      .option("stepDuration", {
        describe: "voting round length in seconds",
        string: true,
        default: "5"
      })
      .option("outer", {
        demand: true,
        describe: "outer set contract address",
        string: true,
        default: "0x0000000000000000000000000000000000000005"
      })
      .option("inner", {
        demand: true,
        describe: "initial inner set contract address",
        string: true,
        default: "0x0000000000000000000000000000000000000006"
      })
      .option("networkID", {
        describe: "network ID",
        string: true,
        default: "0x4242"
      })
      .option("stderr", {
        describe: "print to stderr instead of stdout",
        default: false
      })
      .option("quiet", {
        describe: "clear Truffle output noise",
        default: false
      });

    if (argv.quiet) {
      clearTruffle();
    }

    const output = argv.stderr ? console.error : console.log; // eslint-disable-line

    const outer = await OuterSet.new(argv.inner, argv.master);
    const outerTransaction = outer.contract.transactionHash;

    const initial = await InnerSetInitial.new(
      [].concat(argv.validator),
      argv.validator.length
    );
    const initialTransaction = initial.contract.transactionHash;

    const accounts = {};
    accounts[argv.outer] = {
      balance: 1,
      constructor: web3.eth.getTransaction(outerTransaction).input
    };
    accounts[argv.inner] = {
      balance: 1,
      constructor: web3.eth.getTransaction(initialTransaction).input
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
