import { connect } from "react-redux";

import {
  getInnerSetAddress,
  getValidatorsWithSupport,
  reportBenign,
  reportMalicious
} from "@src/actions";
import Nodes from "@src/components/Nodes";
import { State } from "@src/types";

const mapStateToProps = (state: State) => ({
  innerSetAddress: state.nodes.innerSetAddress,
  nodes: state.nodes.nodes
});

const mapDispatchToProps = (dispatch: any) => ({
  onGetInnerSetAddress: () => dispatch(getInnerSetAddress()),
  onGetValidators: () => dispatch(getValidatorsWithSupport()),
  onReportBenign: () => dispatch(reportBenign()),
  onReportMalicious: () => dispatch(reportMalicious())
});

const ContainedNodes = connect(mapStateToProps, mapDispatchToProps)(Nodes);

export default ContainedNodes;
