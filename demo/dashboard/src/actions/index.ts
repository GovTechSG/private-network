import { Contracts } from "@src/contracts";
import { Action, ActionTypes } from "@src/types";
import { Dispatch } from "redux";

export const increment = (value: number = 1) => ({
  type: ActionTypes.INCREMENT,
  value
});

export const decrement = (value: number = 1) => ({
  type: ActionTypes.DECREMENT,
  value
});

export const incrementAsync = (value: number = 1, delay: number = 1000) => (
  dispatch: Dispatch<Action>
) => setTimeout(() => dispatch(increment(value)), delay);

export const reportBenign = (address: string = "0") => (
  dispatch: Dispatch<Action>
) => dispatch({ type: ActionTypes.REPORT_BENIGN, address });

export const reportMalicious = (address: string = "0") => (
  dispatch: Dispatch<Action>
) => dispatch({ type: ActionTypes.REPORT_MALICIOUS, address });

export const getValidators = (address: string = "0") => (
  dispatch: Dispatch<Action>
) => {
  Contracts.OuterSet.get()
    .methods.getValidators()
    .call()
    .then((result: any) => {
      dispatch({
        addresses: result,
        type: ActionTypes.GET_VALIDATORS
      });
    })
    .catch(err => console.error(err)); // tslint:disable-line
};
