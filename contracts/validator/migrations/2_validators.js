const OuterSet = artifacts.require("./OuterSet.sol");
const InnerSetInitial = artifacts.require("./InnerSetInitial.sol");
const InnerMajortiySet = artifacts.require("./InnerMajoritySet");
const AddressVotes = artifacts.require("./libraries/AddressVotes.sol");

const genesisOuterSetAddress = "0x0000000000000000000000000000000000000005";

function deployInnerMajoritySet(deployer, outerSetAddress) {
  return deployer
    .deploy(AddressVotes)
    .then(() => deployer.link(AddressVotes, InnerMajortiySet))
    .then(() => deployer.deploy(InnerMajortiySet, outerSetAddress))
    .then(() => OuterSet.at(outerSetAddress))
    .then(instance => instance.setInner(InnerMajortiySet.address));
}

// In a development environment, we need to deploy `OuterSet` manually.
// `InnerSetInitial` can be skipped
async function deployDevelopment(deployer) {
  await deployer
    .deploy(InnerSetInitial)
    .then(() => deployer.deploy(OuterSet, InnerSetInitial.address));

  await deployInnerMajoritySet(deployer, OuterSet.address);
}

async function deployParity(deployer) {
  await deployInnerMajoritySet(deployer, genesisOuterSetAddress);
}

const networkDeployers = {
  development: deployDevelopment,
  parity_master: deployParity,
  parity_authority1: () => {},
  parity_authority2: () => {},
  parity_authority3: () => {}
};

module.exports = (deployer, network) => {
  networkDeployers[network](deployer);
};
