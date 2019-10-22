import * as React from "react";
import { useState } from "react";

import {
  List,
  ListItem,
  ListItemText,
  Collapse,
  ListItemIcon
} from "@material-ui/core";
import {
  ExpandLess,
  ExpandMore,
  OpenInNew,
  Computer
} from "@material-ui/icons";
import { Container } from "../hooks/userContainerProxiable";

export const ContainerItem: React.FC<{ container: Container }> = ({
  container
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ListItem
        button
        onClick={() => {
          setOpen(!open);
        }}
      >
        <ListItemIcon>
          <Computer />
        </ListItemIcon>
        <ListItemText primary={container.name} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} unmountOnExit>
        <List>
          {container.ports.map(({ local, remote }) => (
            <ListItem
              button
              key={`${local}-${remote}`}
              style={{ paddingLeft: "3rem" }}
              component="a"
              target="_blank"
              href={`http://${container.fqdn}:${remote}`}
            >
              <ListItemIcon>
                <OpenInNew />
              </ListItemIcon>
              <ListItemText primary={`${remote}:${local}`} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );
};
