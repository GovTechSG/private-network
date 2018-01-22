pragma solidity ^0.4.15;

import "./interfaces/ValidatorSet.sol";

contract OuterSet is ValidatorSet {
	// System address, used by the block sealer.
	address constant SYSTEM_ADDRESS = 0xffffFFFfFFffffffffffffffFfFFFfffFFFfFFfE;
	// `getValidators()` method signature.
	bytes4 constant SIGNATURE = 0xb7ab4db5;

    address public owner;
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    event FinalizeChange(address[] netSet);

	InnerSet public innerSet;
	// Was the last validator change finalized.
	bool public finalized;

    /**
    * @dev Throws if called by any account other than the owner.
    */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function OuterSet(address innerSetInitial) public {
        // Set original owner here!
        owner = 0xffffFFFfFFffffffffffffffFfFFFfffFFFfFFfE;
		OwnershipTransferred(0, owner);

        if (innerSetInitial == 0) {
            innerSetInitial = 0x0000000000000000000000000000000000000006;
        }

        innerSet = InnerSet(innerSetInitial);
    }

    /**
    * @dev Allows the current owner to transfer control of the contract to a newOwner.
    * @param newOwner The address to transfer ownership to.
    */
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    /**
    * @dev Disallows direct send by settings a default function without the `payable` flag.
    */
    function() external {
    }

	modifier onlySystemAndNotFinalized() {
		require(msg.sender == SYSTEM_ADDRESS && !finalized);
		_;
	}

	modifier onlyInnerAndFinalized() {
		require(msg.sender == address(innerSet) && finalized);
		_;
	}

	function setInner(address _inner) public onlyOwner {
		innerSet = InnerSet(_inner);
	}

	// For innerSet
	function initiateChange(bytes32 parentHash, address[] newSet) public onlyInnerAndFinalized {
		finalized = false;
		InitiateChange(parentHash, newSet);
	}

	// For sealer.
	function finalizeChange() public onlySystemAndNotFinalized {
		finalized = true;
		innerSet.finalizeChange();
		FinalizeChange(getValidators());
	}


	// FIXME: Why does this not work in Parity?
	// function getValidators() public constant returns (address[]) {
	// 	address addr = innerSet;
	// 	bytes4 sig = SIGNATURE;
	// 	assembly {
	// 		mstore(0, sig)
	// 		let ret := call(0xfffffffface8, addr, 0, 0, 4, 0, 0)
	// 		jumpi(0x02,iszero(ret))
	// 		returndatacopy(0, 0, returndatasize)
	// 		return(0, returndatasize)
	// 	}
	// }

	function getValidators() public constant returns (address[]) {
		uint length;
		address[32] memory validators;
		(validators, length) = innerSet.getValidators();

		address[] memory returnValidators = new address[](length);

		for (uint i = 0; i < length; i++) {
			returnValidators[i] = validators[i];
		}
		return returnValidators;
	}

	function reportBenign(address validator, uint256 blockNumber) public {
		innerSet.reportBenign(validator, blockNumber);
	}
	function reportMalicious(address validator, uint256 blockNumber, bytes proof) public {
		innerSet.reportMalicious(validator, blockNumber, proof);
	}
}

/// Limit to 32 validators
contract InnerSet {
	OuterSet public outerSet;

	modifier only_outer() {
		require(msg.sender == address(outerSet));
		_;
	}

	function getValidators() public constant returns (address[32], uint);
	function finalizeChange() public;
	function reportBenign(address validator, uint256 blockNumber) public;
	function reportMalicious(address validator, uint256 blockNumber, bytes proof) public;
}

contract InnerSetInitial is InnerSet {
    // Initial set of validator list
    address[32] public validatorList = [0x00D6Cc1BA9cf89BD2e58009741f4F7325BAdc0ED];
	// Number of initial validator list
	uint numberOfValidators = 1;

    function InnerSetInitial(address outerSetAddress) public {
        if (outerSetAddress == 0) {
            outerSetAddress = 0x0000000000000000000000000000000000000005;
        }

        outerSet = OuterSet(outerSetAddress);
    }

    function getValidators() public constant returns (address[32], uint) {
        return (validatorList, numberOfValidators);
    }

    function finalizeChange() public { }
    function reportBenign(address validator, uint256 blockNumber) public { }
    function reportMalicious(address validator, uint256 blockNumber, bytes proof) public {}
}
