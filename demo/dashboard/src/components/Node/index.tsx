import * as React from "react";

export interface NodeProps {
  value: number;
  onReportBenign: () => void;
  onReportMalicious: () => void;
  address: string;
}

export default class Node extends React.Component<NodeProps, {}> {
  public render() {
    return (
      <div>
        <div className="value">{this.props.value}</div>
        <button className="increment" onClick={this.props.onReportBenign}>
          Benign
        </button>
        <button className="decrement" onClick={this.props.onReportMalicious}>
          Malicious
        </button>
        <div>Address: {this.props.address}</div>
      </div>
    );
  }
}
