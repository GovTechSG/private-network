import Web3 from "web3";
const outerSetJSON = require("@contracts/validator/build/contracts/OuterSet.json");

export enum ContractName {
  OuterSet = "OuterSet"
}

const url = new URL(window.location.href);
const endpoint = url.searchParams.get("a") || "http://127.0.0.1:8545";
export const w3 = new Web3(new Web3.providers.HttpProvider(endpoint));

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
    return new w3.eth.Contract(this.abi, this.address);
  }
}

export const Contracts: { [name in ContractName]: ContractInterface } = {
  OuterSet: new ContractInterface(
    outerSetJSON,
    "0x0000000000000000000000000000000000000005"
  )
};
