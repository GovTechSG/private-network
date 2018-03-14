const yargs = require("yargs");
const _ = require("lodash");

const OuterSet = artifacts.require("OuterSet");
const InnerSetInitial = artifacts.require("InnerSetInitial");
const InnerMajoritySet = artifacts.require("InnerMajoritySet");
const InnerSet = artifacts.require("InnerSet");

const clearScreen = () => {
  console.log("\x1Bc"); // eslint-disable-line
};

const handleInner = async argv => {
  if (argv.clear) {
    clearScreen();
  }

  const outer = await OuterSet.at(argv.outerset);
  const inner = await InnerSet.at(await outer.innerSet());

  switch (argv.action) {
    case "deploy": {
      const newInner = await InnerMajoritySet.new(
        outer.address,
        argv.validators
      );
      outer.setInner(newInner.address);
      console.log(await outer.innerSet()); // eslint-disable-line
      break;
    }
    case "validators": {
      const [validators, validatorCount] = await inner.getValidators();
      console.log(validators.slice(0, validatorCount).join("\n")); // eslint-disable-line
      break;
    }
    default:
      break;
  }
};

module.exports = async function cli(cb) {
  try {
    yargs
      .option("clear", {
        description: "clear the screen before printing output",
        default: false,
        type: "boolean"
      })
      .command({
        command: "inner <action>",
        description: "interact with inner validator contracts",
        builder: _yargs => {
          _yargs
            .choices("action", ["deploy", "validators"])
            .option("outerset", { string: true, default: OuterSet.address })
            .option("validators", {
              description: "list of validators in the *existing* InnerSet",
              default: [],
              type: "array",
              string: true
            });
        },
        handler: handleInner
      })
      .parse(process.argv.slice(4)); // slice out truffle nonsense
  } catch (e) {
    cb(e);
    return;
  }
  cb();
};
