import * as React from "react";

export interface NodesProps {
  nodes: any[];
  loading?: boolean;
  innerSetAddress: string;
  onReportBenign: () => void;
  onReportMalicious: () => void;
  onGetValidators: () => void;
  onGetInnerSetAddress: () => void;
}

export default class Nodes extends React.Component<NodesProps, {}> {
  public static defaultProps = {
    loading: false
  };

  public render() {
    return (
      <div>
        <h2>Nodes</h2>

        <button className="increment" onClick={this.props.onGetInnerSetAddress}>
          Get inner set address
        </button>

        <div>{this.props.innerSetAddress || "Unknown"}</div>

        <button className="increment" onClick={this.props.onGetValidators}>
          Get validators
        </button>

        {this.props.loading ? (
          <div>loading&hellip;</div>
        ) : (
          this.props.nodes.map((n, i) => <div key={i}>{n.address}</div>)
        )}
      </div>
    );
  }
}
