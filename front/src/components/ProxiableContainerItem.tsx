import * as React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import OpenInNew from "@material-ui/icons/OpenInNew";

export const ProxiableContainerItem: React.FC<{
  name: string;
  fqdn: string;
  local: number;
  remote: number;
}> = ({ fqdn, local, remote, name }) => {
  return (
    <>
      <ListItem
        button
        component="a"
        target="_blank"
        href={`http://${fqdn}:${remote}`}
      >
        <ListItemIcon>
          <OpenInNew />
        </ListItemIcon>
        <ListItemText primary={`${name} (${remote}:${local})`} />
      </ListItem>
    </>
  );
};
