import { Action, ActionTypes, ChainState } from "@src/types";

export default (
  state: ChainState = {
    current: {
      hash: "unknown",
      number: -1,
      timestamp: 0
    }
  },
  action: Action
) => {
  switch (action.type) {
    case ActionTypes.GET_BLOCK:
      return {
        ...state,
        current: {
          hash: action.hash,
          number: action.number,
          timestamp: action.timestamp
        }
      };
    default:
      return state;
  }
};
