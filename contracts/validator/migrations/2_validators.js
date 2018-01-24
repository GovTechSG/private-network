// var AddressVotes = artifacts.require("./libraries/AddressVotes.sol");
// var MajoritySet = artifacts.require("./MajoritySet.sol")

// module.exports = function (deployer) {
//     deployer.deploy(AddressVotes);
//     deployer.link(AddressVotes, [MajoritySet]);
//     deployer.deploy(MajoritySet);
// };

const OuterSet = artifacts.require("./OuterSet.sol");
const InnerSetInitial = artifacts.require("./InnerSetInitial.sol");
const InnerMajortiySet = artifacts.require("./InnerMajoritySet");
const AddressVotes = artifacts.require("./libraries/AddressVotes.sol");

const genesisOuterSetAddress = "0x0000000000000000000000000000000000000005";

const networkDeployers = {
    "development": deployDevelopment,
    "parity": deployParity
};

function deployInnerMajoritySet(deployer, outerSetAddress) {
    deployer.deploy(AddressVotes);
    deployer.link(AddressVotes, InnerMajortiySet);

    return deployer.deploy(InnerMajortiySet, outerSetAddress)
        .then(() => OuterSet.at(outerSetAddress))
        .then(instance => instance.setInner(InnerMajortiySet.address));
}

// In a development environment, we need to deploy `OuterSet` manually.
// `InnerSetInitial` can be skipped
function deployDevelopment(deployer) {
    deployer.deploy(InnerSetInitial).then(() => deployer.deploy(OuterSet, InnerSetInitial.address));

    return deployInnerMajoritySet(deployer, OuterSet.address);
}

function deployParity(deployer) {
    return deployInnerMajoritySet(deployer, genesisOuterSetAddress);
}

module.exports = function (deployer, network) {
    networkDeployers[network](deployer);
};
