import * as React from "react";
import { Waiting } from "./Waiting";
import { Dashboard } from "./Dashboard";
import { CssBaseline, AppBar, Typography, Toolbar } from "@material-ui/core";

export const App = () => {
  const Main = () => {
    switch (location.hostname) {
      case "localhost":
        return <Dashboard />;
      default:
        return (
          <Waiting
            fqdn={location.hostname}
            port={Number(location.port.length === 0 ? 80 : location.port)}
          />
        );
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Main />
    </React.Fragment>
  );
};
