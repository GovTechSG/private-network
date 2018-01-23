pragma solidity ^0.4.15;

contract ValidatorSet {
	/// Issue this log event to signal a desired change in validator set.
	/// This will not lead to a change in active validator set until
	/// finalizeChange is called.
	///
	/// Only the last log event of any block can take effect.
	/// If a signal is issued while another is being finalized it may never
	/// take effect.
	///
	/// _parent_hash here should be the parent block hash, or the
	/// signal will not be recognized.
	event InitiateChange(bytes32 indexed _parent_hash, address[] _new_set);

	/// Get current validator set (last enacted or initial if no changes ever made)
	function getValidators() public constant returns (address[]);

	/// Called when an initiated change reaches finality and is activated.
	/// Only valid when msg.sender == SYSTEM (EIP96, 2**160 - 2)
	///
	/// Also called when the contract is first enabled for consensus. In this case,
	/// the "change" finalized is the activation of the initial set.
	function finalizeChange() public;

	// Reporting functions: operate on current validator set.
	// malicious behavior requires proof, which will vary by engine.

	function reportBenign(address validator, uint256 blockNumber) public;
	function reportMalicious(address validator, uint256 blockNumber, bytes proof) public;
}

contract SafeValidatorSet is ValidatorSet {
	function reportBenign(address validator, uint256 blockNumber) public {}
	function reportMalicious(address validator, uint256 blockNumber, bytes proof) public {}
}

contract ImmediateSet is ValidatorSet {
	function finalizeChange() public {}
}


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

	function getValidators() public constant returns (address[]) {
		address addr = innerSet;
		bytes4 sig = SIGNATURE;
		assembly {
			mstore(0, sig)
			let ret := call(0xfffffffface8, addr, 0, 0, 4, 0, 0)
			jumpi(fail,iszero(ret))
			returndatacopy(0, 0, returndatasize)
		fail:
			return(0, returndatasize)
		}
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

	function getValidators() public constant returns (address[]);
	function finalizeChange() public;
	function reportBenign(address validator, uint256 blockNumber) public;
	function reportMalicious(address validator, uint256 blockNumber, bytes proof) public;
}

contract InnerSetInitial is InnerSet {
    // Initial set of validator list
    address[] public validatorList = [0x00D6Cc1BA9cf89BD2e58009741f4F7325BAdc0ED];

    function InnerSetInitial(address outerSetAddress) public {
        if (outerSetAddress == 0) {
            outerSetAddress = 0x0000000000000000000000000000000000000005;
        }

        outerSet = OuterSet(outerSetAddress);
    }

    function getValidators() public constant returns (address[]) {
        return validatorList;
    }

    function finalizeChange() public { }
    function reportBenign(address validator, uint256 blockNumber) public { }
    function reportMalicious(address validator, uint256 blockNumber, bytes proof) public {}
}
