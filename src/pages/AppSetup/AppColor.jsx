import { Button, Stack, TextField } from "@mui/material";
import React from "react";
import toaster from "../../instence/toaster";
import { useTheme } from "@emotion/react";

function AppColor() {
  const { ipcRenderer } = window.require("electron");
  const theme = useTheme();

  const storeColor = async (color) => {
    localStorage.setItem('appColor', color)
    const response = await ipcRenderer.invoke("save-configuration", {
      item: "app-color",
      value: color,
    });
    if (response.error) {
      toaster.error(response.message);
    }
  };

  const changeColor = async (event) => {
    storeColor(event.target.value);
  };
  const changeDefaultColor = async (event) => {
    storeColor("#9b27b0");
  };

  return (
    <Stack direction={"row"} spacing={1}>
      <TextField
        type="color"
        label="App Color Theme"
        size="small"
        defaultValue={theme.palette.primary.main}
        fullWidth
        onChange={changeColor}
      />
      <Button variant="contained" onClick={changeDefaultColor}>
        Default
      </Button>
    </Stack>
  );
}

export default AppColor;
