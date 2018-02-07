import * as React from "react";
import styled from "react-emotion";

import Address from "@src/components/Address";

import { Contracts } from "@src/contracts";

/* tslint:disable */
export const _deployInnerMajoritySet = () => {
  console.log(window.w3);
  // console.log(Contracts.InnerMajoritySet.get().address);
};
/* tslint:enable */

export interface NodesProps {
  account: string;
  nodes: any[];
  loading?: boolean;
  innerSetAddress: string;
  onReportBenign: () => void;
  onReportMalicious: (validatorAddress: string) => void;
  onGetAccount: () => void;
  onGetValidators: () => void;
  onGetInnerSetAddress: () => void;
  onAddSupport: (validatorAddress: string) => void;
}

const NodeTable = styled("table")`
  display: table;
`;

const NodeRow = styled("tr")`
  & td {
    padding: 0 10px;
  }
`;

// tslint:disable-next-line:max-classes-per-file
export default class Nodes extends React.Component<NodesProps, {}> {
  public static defaultProps = {
    loading: false
  };

  public componentDidMount() {
    this.props.onGetAccount();
    this.props.onGetInnerSetAddress();
    this.props.onGetValidators();
  }

  public render() {
    return (
      <div>
        <h3>Account</h3>
        <Address address={this.props.account} />

        <h4>InnerMajoritySet</h4>
        <button className="increment" onClick={this.props.onGetInnerSetAddress}>
          Update inner set address
        </button>

        <div>
          {this.props.innerSetAddress ? (
            <Address address={this.props.innerSetAddress} />
          ) : (
            "Unknown"
          )}
        </div>

        <h3>Nodes</h3>
        <h4>Validators</h4>
        <button className="increment" onClick={this.props.onGetValidators}>
          Update validators
        </button>

        {/* TODO: move into Node.tsx */}
        <NodeTable>
          <tbody>
            {this.props.loading ? (
              <div>loading&hellip;</div>
            ) : (
              this.props.nodes.map((n, i) => (
                <NodeRow key={i}>
                  <td>
                    <Address address={n.address} />
                  </td>
                  <td>👍 {n.support || "?"}</td>
                  <td>
                    <button onClick={() => this.props.onAddSupport(n.address)}>
                      Add support
                    </button>

                    <button
                      onClick={() => this.props.onReportMalicious(n.address)}
                    >
                      Report malicious
                    </button>
                  </td>
                </NodeRow>
              ))
            )}
          </tbody>
        </NodeTable>

        <hr />

        <button
          onClick={() => {
            _deployInnerMajoritySet();
          }}
        >
          Debug InnerMajoritySet
        </button>
      </div>
    );
  }
}
