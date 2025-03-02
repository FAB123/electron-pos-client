import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import toaster from "../../instence/toaster";

function CustomerDisplay() {
  const [displayType, setDisplayType] = useState("0");
  const {ipcRenderer} =  window.require("electron");



  useEffect(() => {
    // let savedDisplayType = localStorage.getItem("displayType");
    // if (savedDisplayType) {
    //     setDisplayType(savedDisplayType);
    // }

    
    const getSavedDisplayType = async () => {
      try {
        const response = await ipcRenderer.invoke(
          "get-configuration",
          "display-type"
        );
        if (response) {
          setDisplayType(response);
        }
      } catch (error) {
        toaster.error(error)
      }
    };

    getSavedDisplayType();
  }, []);

  const handleChange = async (event) => {
    setDisplayType(event.target.value);
    // localStorage.setItem("displayType", event.target.value);
    const response = await ipcRenderer.invoke("save-configuration", {
      item: "display-type",
      value: event.target.value,
    });
    if (response.error) {
      toaster.error(response.message)
    }
  };
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="customer-display-label">CUSTOMER DISPLAY</InputLabel>
      <Select
        labelId="customer-display-label"
        id="customer-display"
        value={displayType}
        size="small"
        label="CUSTOMER DISPLAY"
        onChange={handleChange}
      >
          <MenuItem value="led8">LED 8</MenuItem>
          <MenuItem value="0">Disabled</MenuItem>
      </Select>
    </FormControl>
  );
}

export default CustomerDisplay;
