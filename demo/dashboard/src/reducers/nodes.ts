import { Action, ActionTypes, NodesState } from "@src/types";

export default (
  state: NodesState = { nodes: [], account: null, innerSetAddress: null },
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
        nodes: action.addresses.map(address => ({ address }))
      };
    case ActionTypes.GET_INNER_SET_ADDRESS:
      return {
        ...state,
        innerSetAddress: action.address
      };
    case ActionTypes.GET_ACCOUNT:
      return {
        ...state,
        account: action.account
      };
    case ActionTypes.GET_SUPPORT:
      const newNodes = [...[], ...state.nodes];

      const existing = newNodes.find(n => n.address === action.address);
      if (existing) {
        existing.support = action.support;
      }

      return {
        ...state,
        nodes: newNodes
      };
    default:
      return state;
  }
};
