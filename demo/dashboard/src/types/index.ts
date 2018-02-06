export interface CountersState {
  value: number;
}

export interface NodesState {
  nodes: any[];
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
  GET_VALIDATORS = "GET_VALIDATORS"
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

export type Action =
  | IncrementAction
  | DecrementAction
  | ReportBenignAction
  | ReportMaliciousAction
  | GetValidatorsAction;
