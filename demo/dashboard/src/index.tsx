// @flow
/* eslint-disable no-underscore-dangle */

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunkMiddleware from "redux-thunk";

import createHistory from "history/createBrowserHistory";
import { Route, RouteProps } from "react-router-dom";
import {
  ConnectedRouter,
  routerMiddleware,
  routerReducer
} from "react-router-redux";
import Web3 from "web3";

import App from "@src/components/App";
import Dashboard from "@src/components/Dashboard";
import reducers from "@src/reducers";
import { subscribeAll } from "@src/subscriptions/eth";

// CSS escape hatch: name files with myfile.legacy.css
const legacyCss = require("./styles/style.legacy.css");

// https://github.com/emotion-js/emotion/pull/419
// import { ThemeProvider } from "emotion-theming";
import styled from "react-emotion";

// Extend window for TypeScript
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    w3: Web3;
    store: any;
  }
}

// TODO: Figure out how to move this into state
const url = new URL(window.location.href);
const endpointWs = url.searchParams.get("w") || "ws://127.0.0.1:9545";
window.w3 = new Web3(new Web3.providers.WebsocketProvider(endpointWs));
subscribeAll();

// Redux devtools are still enabled in production!
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      actionsBlacklist: []
    })
  : compose;

const appReducer = combineReducers({
  ...reducers,
  router: routerReducer
});

const history = createHistory();
const middleware = [thunkMiddleware, routerMiddleware(history)];

const store = createStore(
  appReducer,
  composeEnhancers(applyMiddleware(...middleware))
);
// HACK for subscribers to dispatch actions on events
window.store = store;

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <Route exact path="/" component={App} />
        <Route path="/dashboard" component={Dashboard} />
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);
