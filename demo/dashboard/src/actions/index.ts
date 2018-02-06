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

const logError = err => {
  console.error(err); // tslint:disable-line
};

export const incrementAsync = (value: number = 1, delay: number = 1000) => (
  dispatch: Dispatch<Action>
) => setTimeout(() => dispatch(increment(value)), delay);

export const reportBenign = () => (dispatch: Dispatch<Action>) =>
  dispatch({ type: ActionTypes.REPORT_BENIGN, address: "what" });

export const reportMalicious = () => (dispatch: Dispatch<Action>) =>
  dispatch({ type: ActionTypes.REPORT_MALICIOUS, address: "what" });

export const getInnerSetAddress = () => (dispatch: Dispatch<Action>) =>
  Contracts.OuterSet.get()
    .methods.innerSet()
    .call()
    .then((result: any) => {
      Contracts.InnerMajoritySet.get()
        .methods.addSupport("0xfC4C1475C4DaBfcBB49dc2138337F9db8eedfF58")
        .call()
        .then(() => {
          Contracts.InnerMajoritySet.get()
            .methods.getSupport("0xfC4C1475C4DaBfcBB49dc2138337F9db8eedfF58")
            .call()
            .then(r => console.log(r));
        });

      dispatch({
        address: result,
        type: ActionTypes.GET_INNER_SET_ADDRESS
      });
    });

export const getValidators = () => (dispatch: Dispatch<Action>) =>
  Contracts.OuterSet.get()
    .methods.getValidators()
    .call()
    .then((result: any) => {
      dispatch({
        addresses: result,
        type: ActionTypes.GET_VALIDATORS
      });
      return result;
    })
    .catch(logError);

export const getSupport = (validatorAddress: string) => (
  dispatch: Dispatch<Action>
) =>
  Contracts.InnerMajoritySet.get()
    .methods.getSupport(validatorAddress)
    .call()
    .then((result: any) => {
      console.log("support", result);
      dispatch({
        address: validatorAddress,
        support: result,
        type: ActionTypes.GET_SUPPORT
      });
      return result;
    })
    .catch(logError);

export const getValidatorsWithSupport = () => (dispatch: Dispatch<Action>) =>
  getValidators()(dispatch).then(validatorAddresses =>
    Promise.all(validatorAddresses.map(va => getSupport(va)(dispatch)))
  );
