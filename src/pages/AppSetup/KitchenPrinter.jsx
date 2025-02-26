import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";

function KitchenPrinter() {
  const [printer, setPrinter] = useState("0");

  const [printerList, setPrinterList] = useState([
    { name: "Disabled", value: "0" },
  ]);
  const { ipcRenderer } = window.require("electron");

  useEffect(() => {
    const fetchPrinters = async () => {
      try {
        const response = await ipcRenderer.invoke("list-printers");
        const printers = response.map((item) => ({
          name: item.displayName,
          value: item.name,
        }));
        setPrinterList([{ name: "Disabled", value: "0" }, ...printers]); // Directly set the new printer list
      } catch (error) {
        console.error("Failed to fetch printers:", error);
      }
    };

    fetchPrinters();
    let savedPrinter = localStorage.getItem("kitchenPrint");
    if (savedPrinter) {
      setPrinter(savedPrinter);
    }
  }, []);

  const handleChange = (event) => {
    setPrinter(event.target.value);
    localStorage.setItem("kitchenPrint", event.target.value);
  };
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="kitchen-print-label">KITCHEN PRINTER</InputLabel>
      <Select
        labelId="kitchen-print-label"
        id="kitchen-print"
        value={printer}
        size="small"
        label="KITCHEN PRINTER"
        onChange={handleChange}
      >
        {printerList.map((item) => (
          <MenuItem value={item.value}>{item.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default KitchenPrinter;
