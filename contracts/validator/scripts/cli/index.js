const yargs = require("yargs");

const OuterSet = artifacts.require("OuterSet");
const InnerMajoritySet = artifacts.require("InnerMajoritySet");
const InnerSet = artifacts.require("InnerSet");

const clearTruffle = () => {
  process.stdout.write("\r\x1b[A\x1b[A\x1b[2K");
};

const handleInner = async argv => {
  if (argv.quiet) {
    clearTruffle();
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
    case "list": {
      const [validators, validatorCount] = await inner.getValidators();
      console.log(validators.slice(0, validatorCount).join("\n")); // eslint-disable-line
      break;
    }
    default:
      break;
  }
};

const handleValidator = async argv => {
  if (argv.quiet) {
    clearTruffle();
  }

  const outer = await OuterSet.at(argv.outerset);

  switch (argv.action) {
    case "list": {
      const inner = await InnerSet.at(await outer.innerSet());
      const [validators, validatorCount] = await inner.getValidators();
      console.log(validators.slice(0, validatorCount).join("\n")); // eslint-disable-line
      break;
    }
    case "propose": {
      const inner = await InnerMajoritySet.at(await outer.innerSet());
      await inner.addValidator(argv.address);
      console.log(`${await inner.getSupport(argv.address)}`); // eslint-disable-line
      break;
    }
    case "getsupport": {
      const inner = await InnerMajoritySet.at(await outer.innerSet());
      console.log(`${await inner.getSupport(argv.address)}`); // eslint-disable-line
      break;
    }
    case "addsupport": {
      const inner = await InnerMajoritySet.at(await outer.innerSet());
      await inner.addSupport(argv.address);
      console.log(`${await inner.getSupport(argv.address)}`); // eslint-disable-line
      break;
    }
    default:
      break;
  }
};

const handleReport = async argv => {
  if (argv.quiet) {
    clearTruffle();
  }

  const outer = await OuterSet.at(argv.outerset);
  const inner = await InnerMajoritySet.at(await outer.innerSet());

  switch (argv.mode) {
    case "benign": {
      await inner.reportBenign(argv.address, web3.eth.blockNumber);
      console.log(`${await inner.getSupport(argv.address)}`); // eslint-disable-line
      break;
    }
    case "malicious": {
      await inner.reportMalicious(
        argv.address,
        web3.eth.blockNumber,
        argv.proof
      );
      console.log(`${await inner.getSupport(argv.address)}`); // eslint-disable-line
      break;
    }
    default:
      break;
  }
};

module.exports = async function cli(cb) {
  try {
    yargs
      .usage("yarn --silent run cli --help --quiet")
      .option("quiet", {
        description: 'silence Truffle "Using network ..."',
        default: false,
        type: "boolean"
      })
      .command({
        command: "inner <action>",
        description: "interact with inner validator set contract",
        builder: _yargs => {
          _yargs
            .choices("action", ["deploy"])
            .option("outerset", { default: OuterSet.address })
            .option("validators", {
              description:
                "list of validators to add. This has to be identical to the *existing* InnerSet",
              default: [],
              type: "array",
              string: true
            });
        },
        handler: handleInner
      })
      .command({
        command: "validator <action> [address]",
        description: "interact with validators",
        builder: _yargs => {
          _yargs
            .choices("action", ["list", "propose", "getsupport", "addsupport"])
            .positional("address", {
              type: "string",
              demand: true,
              describe: "validator address"
            })
            .option("outerset", { default: OuterSet.address });
        },
        handler: handleValidator
      })
      .command({
        command: "report <mode> <address>",
        description: "report a validator (malicious requires prior support)",
        builder: _yargs => {
          _yargs
            .choices("mode", ["benign", "malicious"])
            .positional("address", { type: "string", demand: true })
            .option("proof", {
              default: "0x0",
              describe: "proof of maliciousnesses in bytes"
            })
            .option("outerset", { default: OuterSet.address });
        },
        handler: handleReport
      })
      .string("_")
      .parse(process.argv.slice(4)); // slice out truffle nonsense
  } catch (e) {
    cb(e);
    return;
  }
  cb();
};
