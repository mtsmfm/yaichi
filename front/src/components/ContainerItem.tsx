import * as React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Switch from "@material-ui/core/Switch";
import Notifications from "@material-ui/icons/Notifications";
import { Container } from "../hooks/useContainerProxiable";

export const ContainerItem: React.FC<{
  container: Container;
  enableNotification: () => void;
  disableNotification: () => void;
  notificationEnabled: boolean;
}> = ({
  container,
  notificationEnabled,
  enableNotification,
  disableNotification
}) => {
  return (
    <>
      <ListItem>
        <ListItemText primary={container.name} />
        <ListItemIcon>
          <Notifications />
        </ListItemIcon>
        <Switch
          checked={notificationEnabled}
          onChange={e => {
            if (e.target.checked) {
              enableNotification();
            } else {
              disableNotification();
            }
          }}
        />
      </ListItem>
    </>
  );
};
