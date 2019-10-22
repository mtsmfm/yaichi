import * as React from "react";
import { Typography, Container, List, LinearProgress } from "@material-ui/core";
import { useFetchContainers } from "../hooks/userContainerProxiable";
import { ContainerItem } from "./ContainerItem";
import { ProxiableContainerItem } from "./ProxiableContainerItem";

export const Dashboard: React.FC = () => {
  const { loading, data } = useFetchContainers({
    interval: 5000,
    polling: true
  });

  const containers = data || [];

  return (
    <>
      {loading && (
        <LinearProgress
          style={{ position: "fixed", top: "0", width: "100%" }}
        />
      )}
      <Container>
        <Typography variant="h4" style={{ marginTop: "1rem" }}>
          Proxy-able Containers
        </Typography>
        <List>
          {containers
            .filter(c => c.ports.some(({ available }) => available))
            .map(c =>
              c.ports
                .filter(({ available }) => available)
                .map(({ local, remote }) => (
                  <ProxiableContainerItem
                    key={`${c.id}-${local}-${remote}`}
                    fqdn={c.fqdn}
                    local={local}
                    remote={remote}
                    name={c.name}
                  />
                ))
            )}
        </List>
        <Typography variant="h4">All Containers</Typography>
        <List>
          {containers.map(c => (
            <ContainerItem key={c.id} container={c} />
          ))}
        </List>
      </Container>
    </>
  );
};
