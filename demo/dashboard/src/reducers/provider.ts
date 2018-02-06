import Web3 from "web3";

import { Action, ActionTypes, ProviderState } from "@src/types";

export default (
  state: ProviderState = {
    contracts: {},
    endpoint: {
      url: "http://127.0.0.1:8545"
    }
  },
  action: Action
) => {
  switch (action.type) {
    case ActionTypes.REPORT_BENIGN:
      return state;
    case ActionTypes.REPORT_MALICIOUS:
      return state;
    case ActionTypes.GET_VALIDATORS:
      return {
        ...state,
        nodes: action.addresses
      };
    default:
      return state;
  }
};
