import React from "react";
import { Slider, Box, Stack, Typography } from "@mui/material";
import toaster from "../../../instence/toaster";

function AdjustItemIcon({ iconSize, setIconSize, fontSize, setFontSize }) {
  const { ipcRenderer } = window.require("electron");

  const updateFontSize = async (_, updateValue) => {
    // const response = await ipcRenderer.invoke("save-configuration", {
    //   item: "fontSize",
    //   value: updateValue,
    // });
    // if (response.error) {
    //   toaster.error(response.message);
    // }
    localStorage.setItem("fontSize", updateValue);
    setFontSize(updateValue);
  };

  const updateIconSize = async (_, updateValue) => {
    // const response = await ipcRenderer.invoke("save-configuration", {
    //   item: "iconSize",
    //   value: updateValue,
    // });
    // if (response.error) {
    //   toaster.error(response.message);
    // }
    localStorage.setItem("iconSize", updateValue);
    setIconSize(updateValue);
  };

  return (
    <Stack>
      <Box>
        <Typography gutterBottom>Icon Size: {iconSize}</Typography>
        <Slider
          value={iconSize}
          onChange={updateIconSize}
          valueLabelDisplay="auto"
          min={100}
          max={200}
        />
      </Box>
      <Box>
        <Typography gutterBottom>Font Size: {fontSize}</Typography>
        <Slider
          value={fontSize}
          onChange={updateFontSize}
          valueLabelDisplay="auto"
          min={13}
          max={30}
        />
      </Box>
    </Stack>
  );
}

export default AdjustItemIcon;
