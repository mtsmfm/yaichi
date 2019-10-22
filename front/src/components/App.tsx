import * as React from "react";
import { Waiting } from "./Waiting";
import { Dashboard } from "./Dashboard";
import { CssBaseline } from "@material-ui/core";

export const App = () => {
  const Main = () => {
    switch (location.hostname) {
      case "localhost":
        return <Dashboard />;
      default:
        return <Waiting fqdn={location.hostname} />;
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Main />
    </React.Fragment>
  );
};
