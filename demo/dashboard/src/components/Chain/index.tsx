import * as React from "react";
import styled from "react-emotion";

import { address } from "@src/styles/theme";

import Address from "@src/components/Address";
import { Contracts } from "@src/contracts";

export interface ChainProps {
  hash: string;
  number: number;
  timestamp: number;
}

// TODO: validation, use direct address hash instead of toHashCode
export default class Chain extends React.Component<ChainProps, {}> {
  public render() {
    const locale = navigator.language;
    const date =
      this.props.timestamp == null
        ? false
        : new Date(this.props.timestamp * 1000);
    const dateString = date
      ? date.toLocaleDateString(locale, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short"
        })
      : "unknown";

    return (
      <div>
        <div>{dateString}</div>
        <div>{this.props.number}</div>
        <Address copy={false} address={this.props.hash} />
      </div>
    );
  }
}
