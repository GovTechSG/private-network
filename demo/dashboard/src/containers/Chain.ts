import { connect } from "react-redux";

import { updateBlock } from "@src/actions";
import Chain from "@src/components/Chain";
import { State } from "@src/types";

const mapStateToProps = (state: State) => ({
  hash: state.chain.current.hash,
  number: state.chain.current.number,
  timestamp: state.chain.current.timestamp
});

const mapDispatchToProps = (dispatch: any) => ({});

const ContainedChain = connect(mapStateToProps, mapDispatchToProps)(Chain);

export default ContainedChain;
