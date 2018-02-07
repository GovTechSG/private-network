import { connect } from "react-redux";

import {
  addSupport,
  getAccount,
  getInnerSetAddress,
  getValidatorsWithSupport,
  reportBenign,
  reportMalicious
} from "@src/actions";
import Nodes from "@src/components/Nodes";
import { State } from "@src/types";

const mapStateToProps = (state: State) => ({
  account: state.nodes.account,
  innerSetAddress: state.nodes.innerSetAddress,
  nodes: state.nodes.nodes
});

const mapDispatchToProps = (dispatch: any) => ({
  onAddSupport: va => dispatch(addSupport(va)),
  onGetAccount: () => dispatch(getAccount()), // todo: move into app init
  onGetInnerSetAddress: () => dispatch(getInnerSetAddress()),
  onGetValidators: () => dispatch(getValidatorsWithSupport()),
  onReportBenign: () => dispatch(reportBenign()),
  onReportMalicious: va => dispatch(reportMalicious(va))
});

const ContainedNodes = connect(mapStateToProps, mapDispatchToProps)(Nodes);

export default ContainedNodes;
