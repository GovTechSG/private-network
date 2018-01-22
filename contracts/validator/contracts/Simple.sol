pragma solidity ^0.4.11;

contract Simple {
    	address public owner;

	address[] public validatorList = [0x00D6Cc1BA9cf89BD2e58009741f4F7325BAdc0ED];
	address[] public pendingList = [0x00D6Cc1BA9cf89BD2e58009741f4F7325BAdc0ED];

	mapping(address => bool) public isAdmin;

	modifier onlyAdmin() {
		require(isAdmin[msg.sender] == true);
		_;
	}

	event validatorAdded(address newvalidator);
	event validatorRemoved(address oldvalidator);
	event adminAdded(address newadmin);
	event adminRemoved(address oldadmin);
	event InitiateChange(bytes32 indexed _parent_hash, address[] _new_set);

	function AdminValidatorList() public {
		isAdmin[validatorList[0]] = true;
	}

	// Called on every block to update node validator list.
	function getValidators() public constant returns (address[] _validators) {
		return validatorList;
	}

	function getPendingValidators() public constant returns (address[] _p) {
		return pendingList;
	}

	// Add a validator to the list.
	function addValidator(address validator) public onlyAdmin {
		for (uint i = 0; i < pendingList.length; i++) {
			require(pendingList[i] != validator);
		}

		pendingList.push(validator);
		validatorAdded(validator);
		InitiateChange(block.blockhash(block.number - 1),pendingList);
	}

	// Remove a validator from the list.
	function removeValidator(address validator) public onlyAdmin returns (bool success) {

		uint i=0;
		uint count = pendingList.length;
		success = false;

		// you don't want to leave no validators - can't delete any until you have a minimum of 3.
		// This is in case your 1 remaining node goes down. Leave a safety margin of 2
		if (count > 2) {
			for (i=0; i<count;i++) {
				if (pendingList[i] == validator) {
					if (i < pendingList.length-1) {
						pendingList[i] = pendingList[pendingList.length-1];
					}
					pendingList.length--;
					success = true;
					validatorRemoved(validator);
					InitiateChange(block.blockhash(block.number - 1),pendingList);
					break;
				}
			}
		}
		return success;
	}

	// Add an admin.
	function addAdmin(address admin) public onlyAdmin {
		isAdmin[admin] = true;
		adminAdded(admin);
	}

	// Remove an admin.
	function removeAdmin(address admin) public onlyAdmin {
		isAdmin[admin] = false;
		adminRemoved(admin);
	}

	function finalizeChange() public {
		validatorList = pendingList;
	}
}
