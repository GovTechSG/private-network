// var AddressVotes = artifacts.require("./libraries/AddressVotes.sol");
// var MajoritySet = artifacts.require("./MajoritySet.sol")

// module.exports = function (deployer) {
//     deployer.deploy(AddressVotes);
//     deployer.link(AddressVotes, [MajoritySet]);
//     deployer.deploy(MajoritySet);
// };

var OuterSet = artifacts.require("./OuterSet.sol");
var InnerSetInitial = artifacts.require("./InnerSetInitial.sol");

module.exports = function (deployer) {
    deployer.deploy(InnerSetInitial).then(() => {
        return deployer.deploy(OuterSet, InnerSetInitial.address);
    });
};
