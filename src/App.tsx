import React, { ReactElement } from "react";
import { ReadingComponent } from "./components/reading/ReadingComponent";
import "./App.scss";
import { Route, BrowserRouter, Switch, NavLink } from "react-router-dom";
import { PanelComponent } from "./components/panel/Panel";
import { ExplorerComponent } from "./components/explorer/Explorer";
import { ICrudLikeService, IService } from "./services/IService";
import { BookmarkSettings } from "./services/Bookmark";
import { BookmarkLocalStorageService } from "./services/BookmarkLocalStorageService";
import { KeywordSettings } from "./models/Settings";
import { FeedItemLocalStorageCrudService } from "./services/FeedItemLocalStorageCrudService";
import { KeywordLocalStorageCrudService } from "./services/KeywordLocalStorageCrudService";
import { FeedItem } from "./components/explorer/Feed";
import { ReadingSettingsLocalStorageCrudService } from "./services/ReadingSettingsLocalStorageCrudService";
import { ReadingSettings } from "./components/reading/ReadingSettings";
import { IReadingService } from "./components/reading/service/IReadingService";
import { LocalReadingService } from "./components/reading/service/LocalReadingService";

export default function App(): ReactElement {
  const bookmarkService: IService<BookmarkSettings> = new BookmarkLocalStorageService(
    "bookmarkServiceKey",
  );
  const keywordService: ICrudLikeService<KeywordSettings> = new KeywordLocalStorageCrudService(
    "keywordServiceKey",
  );
  const feedItemService: ICrudLikeService<FeedItem> = new FeedItemLocalStorageCrudService(
    "feedItemService",
  );

  const readingSettingsService: ICrudLikeService<ReadingSettings> = new ReadingSettingsLocalStorageCrudService(
    "readingSettingsKey",
  );

  const readingService: IReadingService = new LocalReadingService(
    keywordService,
    feedItemService,
    readingSettingsService,
    bookmarkService,
  );

  return (
    <BrowserRouter>
      <div className="app">
        <div className="navbar">
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
                  <span className="icon">
                    <i className="fas fa-newspaper"></i>
                  </span>
                  {/* Feed */}
                </NavLink>
                <NavLink exact activeClassName="is-active" className="navbar-item" to="/">
                  <span className="icon">
                    <i className="fas fa-bookmark"></i>
                  </span>
                </NavLink>
                <NavLink activeClassName="is-active" className="navbar-item" to="/reading">
                  <span className="icon">
                    <i className="fas fa-book-reader"></i>
                  </span>
                  {/* <span>Reading</span> */}
                </NavLink>
                <NavLink activeClassName="is-active" className="navbar-item" to="/highlights">
                  <span className="icon">
                    <i className="fas fa-highlighter"></i>
                  </span>
                  {/* Highlights */}
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="container">
            <Switch>
              <Route
                exact
                path="/"
                render={(props) => {
                  return <PanelComponent bookmarkServiceKey="bookmarkServiceKey" {...props} />;
                }}
              ></Route>
              <Route path="/feed">
                <ExplorerComponent feedItemService={feedItemService} />
              </Route>
              <Route path="/reading">
                <ReadingComponent readingService={readingService} />
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
