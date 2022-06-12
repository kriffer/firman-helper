import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { Assessment, Receipt } from "@mui/icons-material";
import { Link } from "react-router-dom";

export const mainListItems = (
  <React.Fragment>
    <Link
      to="/nets"
      style={{
        textDecoration: "none",
        color: "black",
      }}
    >
      <ListItemButton>
        <ListItemIcon>
          <Assessment />
        </ListItemIcon>
        <ListItemText primary="NETS raportit" />
      </ListItemButton>
    </Link>
    <Link
      to="/laskut"
      style={{
        textDecoration: "none",
        color: "black",
      }}
    >
      <ListItemButton>
        <ListItemIcon>
          <Receipt />
        </ListItemIcon>
        <ListItemText primary="Laskut" />
      </ListItemButton>
    </Link>
  </React.Fragment>
);
