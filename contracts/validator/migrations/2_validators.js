const OuterSet = artifacts.require("./OuterSet.sol");
const InnerSetInitial = artifacts.require("./InnerSetInitial.sol");
const InnerMajortiySet = artifacts.require("./InnerMajoritySet");
const AddressVotes = artifacts.require("./libraries/AddressVotes.sol");

const genesisOuterSetAddress = "0x0000000000000000000000000000000000000005";

const initialValidators = [
  "0xfC4C1475C4DaBfcBB49dc2138337F9db8eedfF58",
  "0xa2557aB1F214600A7AD1fA12fCad0C97135eeEA6",
  "0x442290b65483DB5F2520b1E8609Bd3e47fd3F3C4"
];

function deployInnerMajoritySet(deployer, outerSetAddress) {
  return deployer
    .deploy(AddressVotes)
    .then(() => deployer.link(AddressVotes, InnerMajortiySet))
    .then(() => deployer.deploy(InnerMajortiySet, outerSetAddress))
    .then(() => OuterSet.at(outerSetAddress))
    .then(instance => instance.setInner(InnerMajortiySet.address))
    .catch(err => console.error(err)); // eslint-disable-line
}

// In a development environment, we need to deploy `OuterSet` manually.
// `InnerSetInitial` can be skipped
async function deployDevelopment(deployer) {
  await deployer
    .deploy(InnerSetInitial, genesisOuterSetAddress, initialValidators)
    .then(() => deployer.deploy(OuterSet, InnerSetInitial.address))
    .then(() => OuterSet.deployed())
    .then(() => deployInnerMajoritySet(deployer, OuterSet.address));
}

async function deployParity(deployer) {
  await deployInnerMajoritySet(
    deployer,
    genesisOuterSetAddress,
    initialValidators
  );
}

const networkDeployers = {
  development: deployDevelopment,
  docker_ci: deployDevelopment,
  parity_master: deployParity,
  parity_authority1: () => {},
  parity_authority2: () => {},
  parity_authority3: () => {}
};

module.exports = (deployer, network) => {
  networkDeployers[network](deployer);
};
