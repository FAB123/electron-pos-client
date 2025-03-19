import React, { useState } from "react";
import { Slider, Box, Stack, Typography } from "@mui/material";

function AdjustItemIcon({ iconSize, setIconSize, fontSize, setFontSize }) {
  const updateFontSize = (_, updateValue) => {
    localStorage.setItem("fontSize", updateValue);
    setFontSize(updateValue);
  };

  const updateIconSize = (_, updateValue) => {
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
