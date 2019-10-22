import * as React from "react";

import { ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import { OpenInNew } from "@material-ui/icons";

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
