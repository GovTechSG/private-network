import { connect } from "react-redux";

import { getValidators, reportBenign, reportMalicious } from "@src/actions";
import Nodes from "@src/components/Nodes";
import { State } from "@src/types";

const mapStateToProps = (state: State) => ({ nodes: state.nodes.nodes });

const mapDispatchToProps = (dispatch: any) => ({
  onGetValidators: () => dispatch(getValidators()),
  onReportBenign: () => dispatch(reportBenign()),
  onReportMalicious: () => dispatch(reportMalicious())
});

const ContainedNodes = connect(mapStateToProps, mapDispatchToProps)(Nodes);

export default ContainedNodes;
