const outerSetDef = require("@contracts/validator/build/contracts/OuterSet.json");
const innerMajoritySetDef = require("@contracts/validator/build/contracts/InnerMajoritySet.json");

export enum ContractName {
  InnerMajoritySet = "InnerMajoritySet",
  OuterSet = "OuterSet"
}

class ContractInterface {
  public abi;
  public json;
  public address;

  constructor(json, address) {
    this.abi = json.abi;
    this.address = address;
    this.json = json;
  }

  public get() {
    return new window.w3.eth.Contract(this.abi, this.address);
  }
}

export const Contracts: { [name in ContractName]: ContractInterface } = {
  InnerMajoritySet: new ContractInterface(
    innerMajoritySetDef,
    "0x0000000000000000000000000000000000000006"
  ),
  OuterSet: new ContractInterface(
    outerSetDef,
    "0x0000000000000000000000000000000000000005"
  )
};
