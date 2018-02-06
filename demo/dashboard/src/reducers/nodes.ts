import { Action, ActionTypes, NodesState } from "@src/types";

export default (state: NodesState = { nodes: [] }, action: Action) => {
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
