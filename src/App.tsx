import React, { ReactElement } from "react";
import { HomeView } from "./components/Home";
import "./App.scss";
import { Route, BrowserRouter, Switch, NavLink } from "react-router-dom";
import { PanelComponent } from "./components/panel/Panel";
import { ExplorerComponent } from "./components/explorer/Explorer";

export default function App(): ReactElement {
  return (
    <BrowserRouter>
      <div className="app">
        <div className="navbar is-primary">
          <div className="container">
            <div className="navbar-brand">
              <div className="navbar-item">
                <strong>LnReading</strong>
              </div>
              <div className="navbar-burger">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div className="navbar-menu">
              <div className="navbar-start">
                <NavLink activeClassName="is-active" className="navbar-item" to="/feed">
                  Feed
                </NavLink>
                <NavLink exact activeClassName="is-active" className="navbar-item" to="/">
                  Home
                </NavLink>
                <NavLink activeClassName="is-active" className="navbar-item" to="/reading">
                  Reading
                </NavLink>
                <NavLink activeClassName="is-active" className="navbar-item" to="/highlights">
                  Highlights
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="container">
            <Switch>
              <Route exact path="/">
                <PanelComponent />
              </Route>
              <Route path="/feed">
                <ExplorerComponent />
              </Route>
              <Route path="/reading">
                <HomeView contentStorageKey={"textContentKey"} />
              </Route>
              <Route path="*">Not found!</Route>
            </Switch>
          </div>
        </div>

        <div className="footer">
          <div className="has-text-centered">hola mundoZ</div>
        </div>
      </div>
    </BrowserRouter>
  );
}
