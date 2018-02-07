import * as React from "react";
import styled from "react-emotion";

import { address, copy } from "@src/styles/theme";

// TODO: validation, use direct address hash instead of toHashCode
export default class Address extends React.Component<
  { address: string; copy?: boolean },
  {}
> {
  public static defaultProps = {
    copy: true
  };

  public render() {
    if (!this.props.address) {
      return <div>Unknown {this.props.address}</div>;
    }

    return (
      <div
        className={[address, this.props.copy ? copy : ""].join(" ")}
        style={{ color: this.color(this.props.address) }}
        onClick={
          this.props.copy
            ? () => this.copyToClipboard(this.props.address)
            : null
        }
      >
        {this.props.address}
      </div>
    );
  }

  private copyToClipboard(content) {
    const textField = document.createElement("textarea");
    textField.innerText = content;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
  }

  private color(addr: string) {
    return `hsl(${Math.abs(this.toHashCode(addr) % 360)}, 90%, 75%)`;
  }

  private toHashCode(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash += Math.pow(str.charCodeAt(i) * 31, str.length - i);
      // tslint:disable-next-line:no-bitwise
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }
}
