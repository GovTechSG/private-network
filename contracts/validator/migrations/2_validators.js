const OuterSet = artifacts.require("./OuterSet.sol");
const InnerSetInitial = artifacts.require("./InnerSetInitial.sol");
const InnerMajoritySet = artifacts.require("./InnerMajoritySet");
const AddressVotes = artifacts.require("./libraries/AddressVotes.sol");

const genesisOuterSetAddress = "0x0000000000000000000000000000000000000005";

const parityInitialValidators = [
  "0xfC4C1475C4DaBfcBB49dc2138337F9db8eedfF58",
  "0xa2557aB1F214600A7AD1fA12fCad0C97135eeEA6",
  "0x442290b65483DB5F2520b1E8609Bd3e47fd3F3C4"
];

function deployInnerMajoritySet(deployer, outerSetAddress, initialPending) {
  return deployer
    .deploy(AddressVotes)
    .then(() => deployer.link(AddressVotes, InnerMajoritySet))
    .then(() =>
      deployer.deploy(InnerMajoritySet, outerSetAddress, initialPending)
    )
    .then(() => OuterSet.at(outerSetAddress))
    .then(instance => instance.setInner(InnerMajoritySet.address));
}

// In a development environment, we need to deploy `OuterSet` manually.
// `InnerSetInitial` can be skipped
async function deployDevelopment(deployer, _network, accounts) {
  await deployer
    // Arbitrary decision to use only three accounts. Otherwise we will run out of gas.
    .deploy(InnerSetInitial, accounts.slice(0, 3), 3)
    .then(() => deployer.deploy(OuterSet, InnerSetInitial.address, 0))
    .then(() => OuterSet.deployed())
    .then(() =>
      deployInnerMajoritySet(deployer, OuterSet.address, accounts.slice(0, 3))
    );
}

async function deployParity(deployer, _network, _accounts) {
  await deployInnerMajoritySet(
    deployer,
    genesisOuterSetAddress,
    parityInitialValidators
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

module.exports = (deployer, network, accounts) => {
  networkDeployers[network](deployer, network, accounts);
};
