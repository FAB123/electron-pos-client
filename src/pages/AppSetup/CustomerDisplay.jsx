import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";

function CustomerDisplay() {
  const [displayType, setDisplayType] = useState("0");



  useEffect(() => {
    let savedDisplayType = localStorage.getItem("displayType");
    if (savedDisplayType) {
        setDisplayType(savedDisplayType);
    }
  }, []);

  const handleChange = (event) => {
    setDisplayType(event.target.value);
    localStorage.setItem("displayType", event.target.value);
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
