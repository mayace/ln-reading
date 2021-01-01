import React, { ReactElement } from "react";
import { HomeView } from "./components/Home";

export default function App(): ReactElement {
  return (
    <div className="app">
      <HomeView contentStorageKey={"textContentKey"} />
    </div>
  );
}
