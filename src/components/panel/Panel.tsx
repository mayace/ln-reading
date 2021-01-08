import React, { ReactNode } from "react";

export class PanelComponent extends React.Component {
  render(): ReactNode {
    return (
      <div className="panel-component">
        <div className="field is-grouped">
          <div className="control">
            <button type="button" className="button is-dark ">
              <span className="icon">
                <i className="fas fa-grip-horizontal"></i>
              </span>
            </button>
          </div>
          <div className="control">
            <button type="button" className="button ">
              <span className="icon">
                <i className="fas fa-grip-lines"></i>
              </span>
            </button>
          </div>
          <div className="control">
            <button type="button" className="button is-static">
              <span>&nbsp;</span>
            </button>
          </div>
          <div className="control">
            <button type="button" className="button is-black">
              <span className="icon">
                <i className="fas fa-thumbtack"></i>
              </span>
            </button>
          </div>
          <div className="control">
            <button type="button" className="button calendar">
              <span className="icon">
                <i className="fas fa-calendar"></i>
              </span>
            </button>
          </div>
          <div className="control">
            <button type="button" className="button calendar">
              <span className="icon">
                <i className="fas fa-mouse"></i>
              </span>
            </button>
          </div>
          <div className="control">
            <div className="select">
              <select>
                <option>Day</option>
                <option>Week</option>
                <option>Moth</option>
                <option>Year</option>
                <option>All</option>
              </select>
            </div>
          </div>
          <div className="control">
            <input type="text" className="input" value="10" />
          </div>
        </div>
        <div className="columns is-multiline">
          {[1, 2, 3, 4, 5].map((item) => {
            return (
              <div key={item} className="column is-4">
                <div className="box">
                  <div className="title">title - {item}</div>
                  <div>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque natus
                    consequatur nulla, quas molestias libero sequi distinctio ex voluptatibus, dolor
                    minus porro temporibus ratione consequuntur animi quos quaerat qui facilis!
                  </div>
                </div>
              </div>
            );
          })}

          <div className="column is-4">
            <div className="box">
              <div className="title">New from:</div>
              <div className="content">
                <p>
                  <a href="#">Nhk easy news</a>
                </p>
                <p>File</p>
                <p>Url:</p>
                <p>text</p>
              </div>
            </div>
          </div>

          <div className="column is-4">
            <div className="box">
              <div className="has-text-centered">
                <span className="icon">
                  <i className="fas fa-plus"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
