const yargs = require("yargs");

const OuterSet = artifacts.require("OuterSet");
const InnerMajoritySet = artifacts.require("InnerMajoritySet");

const clearTruffle = () => {
  process.stdout.write("\r\x1b[A\x1b[A\x1b[2K");
};

const handleInner = async argv => {
  if (argv.quiet) {
    clearTruffle();
  }

  const outer = await OuterSet.at(argv.outerset);

  switch (argv.action) {
    case "deploy": {
      const validators = argv.copy
        ? await outer.getValidators()
        : argv.validators;

      const newInner = await InnerMajoritySet.new(outer.address, validators);
      outer.setInner(newInner.address);
      console.log(await outer.innerSet()); // eslint-disable-line
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
      const validators = await outer.getValidators();
      console.log(validators.join("\n")); // eslint-disable-line
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
            .positional("action", {
              choices: ["deploy"],
              description:
                "Action to peform \n - deploy: Deploy and upgrade the InnerSet contract",
              type: "string"
            })
            .option("outerset", {
              requiresArg: true,
              description: "Address of the OuterSet validator contract",
              string: true
            })
            .option("validators", {
              description:
                "list of validators to add. This has to be identical to the *existing* InnerSet",
              default: [],
              type: "array",
              string: true
            })
            .option("copy", {
              description:
                "copies existing validator set into new InnerSet, overrides `validators` option"
            });
        },
        handler: handleInner
      })
      .command({
        command: "validator <action> [address]",
        description: "interact with validators",
        builder: _yargs => {
          _yargs
            .positional("action", {
              choices: ["list", "propose", "getsupport", "addsupport"],
              type: "string",
              description:
                "Action to perform\n" +
                "- list: List the current validators\n" +
                "- propose: Propose a new validator\n" +
                "- getsupport: Gets the number of support for a current or new validator\n" +
                "- addsupport: Add support to a pending validator"
            })
            .positional("address", {
              type: "string",
              demand: true,
              description: "validator address"
            })
            .option("outerset", {
              requiresArg: true,
              description: "Address of the OuterSet validator contract",
              string: true
            });
        },
        handler: handleValidator
      })
      .command({
        command: "report <mode> <address>",
        description: "report a validator (malicious requires prior support)",
        builder: _yargs => {
          _yargs
            .positional("mode", {
              choices: ["benign", "malicious"],
              description: "The type of report to make",
              string: true
            })
            .positional("address", { type: "string", demand: true })
            .option("proof", {
              default: "0x0",
              description: "proof of maliciousnesses in bytes"
            })
            .option("outerset", {
              requiresArg: true,
              description: "Address of the OuterSet validator contract",
              string: true
            });
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
