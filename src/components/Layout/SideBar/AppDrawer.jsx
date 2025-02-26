import React from "react";

import MenuButton from "./MenuButton";
import { menuData } from "../../../constants/constants";
import { List } from "@mui/material";

function AppDrawer() {
  return (
    <List>
      {menuData.map((menu, index) => {
        return <MenuButton menu={menu} key={index} />;
      })}
    </List>
  );
}

export default AppDrawer;
