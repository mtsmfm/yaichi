import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import LinearProgress from "@material-ui/core/LinearProgress";
import { useFetchContainers } from "../hooks/useContainerProxiable";
import { ContainerItem } from "./ContainerItem";
import { ProxiableContainerItem } from "./ProxiableContainerItem";
import { useNotificationSettings } from "../hooks/useNotificationSettings";
import { usePrevious } from "../hooks/usePrevious";
import icon from "../../data/favicon.png";

export const Dashboard: React.FC = () => {
  const { data, successCount } = useFetchContainers({
    interval: 5000,
    polling: true
  });
  const containers = data || [];
  const proxiableContainers = containers
    .filter(c => c.ports.some(({ available }) => available))
    .map(({ ports, ...c }) =>
      ports.filter(({ available }) => available).map(p => ({ ...c, ...p }))
    )
    .reduce((ary, xs) => ary.concat(xs), []);

  const {
    loading: settingLoading,
    add,
    remove,
    notificationSettings
  } = useNotificationSettings();

  const previousProxiableContainers = usePrevious(proxiableContainers);

  if (successCount === 0 || settingLoading) {
    return (
      <LinearProgress style={{ position: "fixed", top: "0", width: "100%" }} />
    );
  }

  if (previousProxiableContainers) {
    proxiableContainers
      .filter(
        c =>
          !previousProxiableContainers.some(
            pc => pc.id === c.id && pc.remote === c.remote
          ) && notificationSettings.some(n => n.name === c.name)
      )
      .forEach(c => {
        const notification = new Notification(
          `${c.fqdn}:${c.remote} is ready!`,
          {
            icon,
            requireInteraction: true
          }
        );
        notification.onclick = e => {
          e.preventDefault();
          window.open(`http://${c.fqdn}:${c.remote}`, "_blank");
          notification.close();
        };
      });
  }

  return (
    <>
      <Container maxWidth="md">
        <Typography variant="h4" style={{ marginTop: "1rem" }}>
          Proxy-able Containers
        </Typography>
        <List>
          {proxiableContainers.map(({ id, local, remote, fqdn, name }) => (
            <ProxiableContainerItem
              key={`${id}-${local}-${remote}`}
              fqdn={fqdn}
              local={local}
              remote={remote}
              name={name}
            />
          ))}
        </List>
        <Typography variant="h4">All Containers</Typography>
        <List>
          {containers.map(c => (
            <ContainerItem
              key={c.id}
              container={c}
              enableNotification={() => {
                Notification.requestPermission().then(permission => {
                  if (permission === "granted") {
                    add(c.name);
                  }
                });
              }}
              disableNotification={() => {
                remove(c.name);
              }}
              notificationEnabled={notificationSettings.some(
                ({ name }) => name === c.name
              )}
            />
          ))}
        </List>
      </Container>
    </>
  );
};
