// This theme is passed down via React's context through emotion-theming's
// <ThemeProvider in the <App> component.

import { css } from "emotion";

export default {
  someCssStyle: css`
    color: #dd4444;
  `,
  someThemeStyle: {
    borderRadius: "50%",
    unused: "red"
  }
};

export const address = css`
  font-family: monospace;
  transition: color 0.1s ease-in;
`;

export const copy = css`
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  &:active {
    filter: brightness(150%);
  }
`;
