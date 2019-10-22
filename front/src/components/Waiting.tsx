import * as React from "react";
import {
  CircularProgress,
  Typography,
  Container,
  Grid
} from "@material-ui/core";
import { useContainerAvailableNotification } from "../hooks/userContainerProxiable";

interface Props {
  fqdn: string;
  port: number;
}

export const Waiting: React.FC<Props> = ({ fqdn, port }) => {
  useContainerAvailableNotification(fqdn, port);

  return (
    <Container>
      <Typography component="h1" variant="h2" align="center">
        Waiting for {fqdn}:{port}
      </Typography>
      <Grid container justify="center" style={{ marginTop: "2rem" }}>
        <Grid item>
          <CircularProgress size="100" />
        </Grid>
      </Grid>
    </Container>
  );
};
