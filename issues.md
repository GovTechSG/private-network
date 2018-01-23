# Issues with Assembly in Contract

## Validator Contract

```solidity
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
```

### Chainfile

Address `5` is the validator contract. `6` is the `InnerSetInitial`.

```json
{
    "name": "DemoPoA",
    "engine": {
        "authorityRound": {
            "params": {
                "stepDuration": "5",
                "validators": {
                    "contract": "0x0000000000000000000000000000000000000005"
                }
            }
        }
    },
    "params": {
        "gasLimitBoundDivisor": "0x400",
        "maximumExtraDataSize": "0x20",
        "minGasLimit": "0x1388",
        "networkID": "0x4242"
    },
    "genesis": {
        "seal": {
            "authorityRound": {
                "step": "0x0",
                "signature": "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
            }
        },
        "difficulty": "0x20000",
        "gasLimit": "0x5B8D80"
    },
    "accounts": {
        "0x0000000000000000000000000000000000000001": {
            "balance": "1",
            "builtin": {
                "name": "ecrecover",
                "pricing": {
                    "linear": {
                        "base": 3000,
                        "word": 0
                    }
                }
            }
        },
        "0x0000000000000000000000000000000000000002": {
            "balance": "1",
            "builtin": {
                "name": "sha256",
                "pricing": {
                    "linear": {
                        "base": 60,
                        "word": 12
                    }
                }
            }
        },
        "0x0000000000000000000000000000000000000003": {
            "balance": "1",
            "builtin": {
                "name": "ripemd160",
                "pricing": {
                    "linear": {
                        "base": 600,
                        "word": 120
                    }
                }
            }
        },
        "0x0000000000000000000000000000000000000004": {
            "balance": "1",
            "builtin": {
                "name": "identity",
                "pricing": {
                    "linear": {
                        "base": 15,
                        "word": 3
                    }
                }
            }
        },
        "0x0000000000000000000000000000000000000005": {
            "balance": "1",
            "constructor": "0x6060604052341561000f57600080fd5b604051602080610ce08339810160405280805190602001909190505073fffffffffffffffffffffffffffffffffffffffe6000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660007f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a360008173ffffffffffffffffffffffffffffffffffffffff16141561010957600690505b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050610b868061015a6000396000f3006060604052600436106100a4576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806375286211146100b15780638da5cb5b146100c6578063a0285c011461011b578063b3f05b9714610182578063b7991443146101af578063b7ab4db5146101e8578063c476dd4014610252578063d69f13bb146102d7578063f2fde38b14610319578063f4de3b1e14610352575b34156100af57600080fd5b005b34156100bc57600080fd5b6100c46103a7565b005b34156100d157600080fd5b6100d9610542565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561012657600080fd5b61018060048080356000191690602001909190803590602001908201803590602001908080602002602001604051908101604052809392919081815260200183836020028082843782019150505050505091905050610567565b005b341561018d57600080fd5b610195610677565b604051808215151515815260200191505060405180910390f35b34156101ba57600080fd5b6101e6600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061068a565b005b34156101f357600080fd5b6101fb610729565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b8381101561023e578082015181840152602081019050610223565b505050509050019250505060405180910390f35b341561025d57600080fd5b6102d5600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919050506107a5565b005b34156102e257600080fd5b610317600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919080359060200190919050506108ef565b005b341561032457600080fd5b610350600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506109cb565b005b341561035d57600080fd5b610365610b20565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b73fffffffffffffffffffffffffffffffffffffffe73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161480156104035750600160149054906101000a900460ff16155b151561040e57600080fd5b60018060146101000a81548160ff021916908315150217905550600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663752862116040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401600060405180830381600087803b15156104ad57600080fd5b6102c65a03f115156104be57600080fd5b5050507fc91c5b6efe36a2b67e6d53af99c9d4b661a8f697a5e9e35dbe31211c78f28fc76104ea610729565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b8381101561052d578082015181840152602081019050610512565b505050509050019250505060405180910390a1565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161480156105d05750600160149054906101000a900460ff165b15156105db57600080fd5b6000600160146101000a81548160ff02191690831515021790555081600019167f55252fa6eee4741b4e24a74a70e9c11fd2c2281df8d6ea13126ff845f7825c89826040518080602001828103825283818151815260200191508051906020019060200280838360005b83811015610660578082015181840152602081019050610645565b505050509050019250505060405180910390a25050565b600160149054906101000a900460ff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156106e557600080fd5b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b610731610b46565b600080600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16915063b7ab4db57c01000000000000000000000000000000000000000000000000000000000290508060005260008060046000808665fffffffface8f180156107a0573d6000803e5b3d6000f35b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663c476dd408484846040518463ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200180602001828103825283818151815260200191508051906020019080838360005b8381101561088957808201518184015260208101905061086e565b50505050905090810190601f1680156108b65780820380516001836020036101000a031916815260200191505b50945050505050600060405180830381600087803b15156108d657600080fd5b6102c65a03f115156108e757600080fd5b505050505050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663d69f13bb83836040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b15156109b357600080fd5b6102c65a03f115156109c457600080fd5b5050505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610a2657600080fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614151515610a6257600080fd5b8073ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6020604051908101604052806000815250905600a165627a7a723058207f531cbc5d97fde3fdb50ee21b9119ff09c969c34db862111a9721e66c1106000029"
        },
        "0x0000000000000000000000000000000000000006": {
            "balance": "1",
            "constructor": "0x606060405260206040519081016040528072d6cc1ba9cf89bd2e58009741f4f7325badc0ed73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681525060019060016100639291906100f5565b50341561006f57600080fd5b60405160208061058f8339810160405280805190602001909190505060008173ffffffffffffffffffffffffffffffffffffffff1614156100af57600590505b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550506101c2565b82805482825590600052602060002090810192821561016e579160200282015b8281111561016d5782518260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555091602001919060010190610115565b5b50905061017b919061017f565b5090565b6101bf91905b808211156101bb57600081816101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905550600101610185565b5090565b90565b6103be806101d16000396000f300606060405260043610610078576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063752862111461007d578063a6b340b614610092578063b048e056146100e7578063b7ab4db51461014a578063c476dd40146101b4578063d69f13bb14610239575b600080fd5b341561008857600080fd5b61009061027b565b005b341561009d57600080fd5b6100a561027d565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156100f257600080fd5b61010860048080359060200190919050506102a2565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561015557600080fd5b61015d6102e1565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156101a0578082015181840152602081019050610185565b505050509050019250505060405180910390f35b34156101bf57600080fd5b610237600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610375565b005b341561024457600080fd5b610279600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190505061037a565b005b565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6001818154811015156102b157fe5b90600052602060002090016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6102e961037e565b600180548060200260200160405190810160405280929190818152602001828054801561036b57602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019060010190808311610321575b5050505050905090565b505050565b5050565b6020604051908101604052806000815250905600a165627a7a72305820d783eee1bea9514d0417a11b782f18d87c310685271df72afab09ecc04d5b2960029"
        }
    }
}

```


## Running Parity

```
validator_one_1  | Loading config file from /config/validators.toml
validator_one_1  | 2018-01-22 09:02:23 UTC Starting Parity/v1.10.0-nightly-9083bec-20180117/x86_64-linux-gnu/rustc1.23.0
validator_one_1  | 2018-01-22 09:02:23 UTC Keys path /parity/keys/DemoPoA
validator_one_1  | 2018-01-22 09:02:23 UTC DB path /parity/chains/DemoPoA/db/eb36b7cf93c8fcef
validator_one_1  | 2018-01-22 09:02:23 UTC Path to dapps /parity/dapps
validator_one_1  | 2018-01-22 09:02:23 UTC State DB configuration: fast
validator_one_1  | 2018-01-22 09:02:23 UTC Operating mode: active
validator_one_1  | 2018-01-22 09:02:23 UTC Configured for DemoPoA using AuthorityRound engine
validator_one_1  | 2018-01-22 09:02:23 UTC Error generating genesis epoch data: Error(Msg("Cannot decode address[]"), State { next_error: Some(Error(InvalidData, State { next_error: None, backtrace: None })), backtrace: None }). Snapshots generated may not be complete.
validator_one_1  | 2018-01-22 09:02:25 UTC Encountered error on making system call: Bad instruction 3d
```

## Running with Ganache-cli

```
truffle(development)> OuterSet.deployed().then(instance => instance.getValidators())
[ '0x00d6cc1ba9cf89bd2e58009741f4f7325badc0ed' ]
```
