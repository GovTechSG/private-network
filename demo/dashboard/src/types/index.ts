export interface CountersState {
  value: number;
}

export interface NodesState {
  nodes: any[];
  innerSetAddress: string;
}

export interface Contract {
  abi: any;
  address: string; // TODO: use an Address object
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
}

export enum ActionTypes {
  INCREMENT = "INCREMENT",
  DECREMENT = "DECREMENT",
  REPORT_BENIGN = "REPORT_BENIGN",
  REPORT_MALICIOUS = "REPORT_MALICIOUS",
  GET_VALIDATORS = "GET_VALIDATORS",
  GET_SUPPORT = "GET_SUPPORT",
  GET_INNER_SET_ADDRESS = "GET_INNER_SET_ADDRESS"
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
  address: string;
  type: ActionTypes.REPORT_BENIGN;
}

export interface ReportMaliciousAction {
  address: string;
  type: ActionTypes.REPORT_MALICIOUS;
}

export interface GetValidatorsAction {
  addresses: string[];
  type: ActionTypes.GET_VALIDATORS;
}

export interface GetSupportAction {
  address: string;
  type: ActionTypes.GET_SUPPORT;
  value: number;
}

export interface GetInnerSetAddress {
  address: string;
  type: ActionTypes.GET_INNER_SET_ADDRESS;
}

export type Action =
  | IncrementAction
  | DecrementAction
  | ReportBenignAction
  | ReportMaliciousAction
  | GetValidatorsAction
  | GetSupportAction
  | GetInnerSetAddress;
