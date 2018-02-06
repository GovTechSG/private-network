import * as React from "react";

export interface NodesProps {
  nodes: any[];
  onReportBenign: () => void;
  onReportMalicious: () => void;
  onGetValidators: () => void;
}

export default class Nodes extends React.Component<NodesProps, {}> {
  public render() {
    console.log(this.props);
    return (
      <div>
        <h2>Nodes</h2>
        <button className="increment" onClick={this.props.onGetValidators}>
          Get validators
        </button>

        {this.props.nodes.map((addr, i) => <div key={i}>{addr}</div>)}
      </div>
    );
  }
}
