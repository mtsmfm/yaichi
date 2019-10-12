import * as React from "react";
import { Waiting } from "./Waiting";
import { Dashboard } from "./Dashboard";
import CssBaseline from "@material-ui/core/CssBaseline";

export const App = () => {
  const Main = () => {
    switch (location.hostname) {
      case "localhost":
      case "lvh.me":
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
