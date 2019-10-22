import * as React from "react";
import {
  CircularProgress,
  Typography,
  Container,
  Grid
} from "@material-ui/core";

interface Props {
  fqdn: string;
}

export const Waiting: React.FC<Props> = ({ fqdn }) => {
  return (
    <Container>
      <Typography component="h1" variant="h2" align="center">
        Waiting for {fqdn}
      </Typography>
      <Grid container justify="center" style={{ marginTop: "2rem" }}>
        <Grid item>
          <CircularProgress size="150" />
        </Grid>
      </Grid>
    </Container>
  );
};
