export type Address = string;

export interface CountersState {
  value: number;
}

export interface NodesState {
  nodes: any[];
  innerSetAddress: string;
  account: Address;
}

export interface ChainState {
  current: {
    hash: string;
    number: number;
    timestamp: number;
  };
}

export interface Contract {
  abi: any;
  address: Address; // TODO: use an Address object
  json: any;
}

export interface ProviderState {
  contracts: { [_: string]: Contract };
  endpoint: { url: string }; // TODO: use a URL object
}

export interface State {
  counters: CountersState;
  nodes: NodesState;
  provider: ProviderState;
  chain: ChainState;
}

export enum ActionTypes {
  INCREMENT = "INCREMENT",
  DECREMENT = "DECREMENT",
  REPORT_BENIGN = "REPORT_BENIGN",
  REPORT_MALICIOUS = "REPORT_MALICIOUS",
  GET_VALIDATORS = "GET_VALIDATORS",
  GET_SUPPORT = "GET_SUPPORT",
  GET_INNER_SET_ADDRESS = "GET_INNER_SET_ADDRESS",
  GET_ACCOUNT = "GET_ACCOUNT",
  GET_BLOCK = "GET_BLOCK"
}

export interface IncrementAction {
  type: ActionTypes.INCREMENT;
  value: number;
}

export interface DecrementAction {
  type: ActionTypes.DECREMENT;
  value: number;
}

export interface ReportBenignAction {
  address: Address;
  type: ActionTypes.REPORT_BENIGN;
}

export interface ReportMaliciousAction {
  address: Address;
  type: ActionTypes.REPORT_MALICIOUS;
}

export interface GetValidatorsAction {
  addresses: Address[];
  type: ActionTypes.GET_VALIDATORS;
}

export interface GetSupportAction {
  address: Address;
  type: ActionTypes.GET_SUPPORT;
  support: number;
}

export interface GetInnerSetAddressAction {
  address: Address;
  type: ActionTypes.GET_INNER_SET_ADDRESS;
}

export interface GetAccountAction {
  account: Address;
  type: ActionTypes.GET_ACCOUNT;
}

export interface GetBlockAction {
  hash: string;
  number: number;
  timestamp: number;
  type: ActionTypes.GET_BLOCK;
}

export type Action =
  | IncrementAction
  | DecrementAction
  | ReportBenignAction
  | ReportMaliciousAction
  | GetValidatorsAction
  | GetSupportAction
  | GetInnerSetAddressAction
  | GetAccountAction
  | GetBlockAction;
