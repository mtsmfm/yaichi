import * as React from "react";
import {
  Typography,
  CircularProgress,
  Grid,
  Container,
  List,
  ListItem
} from "@material-ui/core";
import { useFetchContainers } from "../hooks/userContainerProxiable";

export const Dashboard: React.FC = () => {
  const { successCount, data: containers } = useFetchContainers({
    interval: 10000,
    polling: true
  });

  if (successCount === 0 || !containers) {
    return (
      <Grid container justify="center" style={{ marginTop: "2rem" }}>
        <Grid item>
          <CircularProgress size="100" />
        </Grid>
      </Grid>
    );
  }

  return (
    <Container>
      <Typography variant="h3">Proxy-able Containers</Typography>
      <List>
        {containers
          .filter(c => c.available_ports.length > 0)
          .map(c =>
            c.available_ports.map(({ local, remote }) => (
              <ListItem
                key={`${c.id}-${local}-${remote}`}
                button
                component="a"
                target="_blank"
                href={`http://${c.fqdn}:${remote}`}
              >
                {c.name} ({remote}:{local})
              </ListItem>
            ))
          )}
      </List>
      <Typography variant="h3">All Containers</Typography>
      <List>
        {containers.map(c => (
          <ListItem key={c.id}>{c.name}</ListItem>
        ))}
      </List>
    </Container>
  );
};
