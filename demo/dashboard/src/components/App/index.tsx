import { ThemeProvider } from "emotion-theming";
import * as React from "react";
import styled, { keyframes } from "react-emotion";
import { Link, Route } from "react-router-dom";

import Echo from "@src/components/Echo";
import Chain from "@src/containers/Chain";
import Counter from "@src/containers/Counter";
import Nodes from "@src/containers/Nodes";

// emotion-theming theme to be passed to <ThemeProvider>
import theme from "@src/styles/theme";

// Let webpack instead of ts handle these imports
const hello = require("./hello.jpg");

// Legacy CSS are supported
const legacyCss = require("./styles.legacy.css");

const spin = keyframes`
  100% {
    transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
  }
`;

const ImgRobot = styled("img")`
  align-self: center;
  animation: ${spin} 60s linear infinite;
  border-radius: 50%;
  height: auto;
  width: 200px;
`;

// Can compose, or access theme using props
const ThemedDiv = styled("div")`
  ${theme.someCssStyle};
  border-radius: ${p => p.theme.someThemeStyle.borderRadius};
`;

export interface AppProps {
  match: { url: string };
}

export default class App extends React.Component<AppProps, {}> {
  public static defaultProps: {
    match: { url: string };
  };

  public render() {
    return (
      <ThemeProvider theme={theme}>
        <div className="app">
          <Chain />
          <Nodes />

          {/* React style prop is still available */}
          {/* <div style={{ border: "solid 1px grey" }}>
            <Route
              exact
              path={this.props.match.url}
              render={() => (
                <Link to="/counter">
                  Link to /counter. Click to show counter. Back/Forward buttons
                  work.
                </Link>
              )}
            />
            <Route path="/counter" component={Counter} />
          </div>

          <ThemedDiv style={{ border: "solid 1px grey" }}>
            This div is themed using emotion and emotion-theming
          </ThemedDiv> */}
        </div>
      </ThemeProvider>
    );
  }
}

App.defaultProps = {
  match: { url: "unknown" }
};
