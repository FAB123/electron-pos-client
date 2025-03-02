import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import toaster from "../../instence/toaster";

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

    const getSavedPrinter = async () => {
      try {
        const response = await ipcRenderer.invoke(
          "get-configuration",
          "kitchen-printer"
        );
        if (response) {
          setPrinter(response);
        }
      } catch (error) {
        toaster.error(error)
      }
    };

    fetchPrinters();
    getSavedPrinter();
    // let savedPrinter = localStorage.getItem("kitchenPrint");
    // if (savedPrinter) {
    //   setPrinter(savedPrinter);
    // }
  }, []);

  const handleChange = async (event) => {
    setPrinter(event.target.value);
    // localStorage.setItem("kitchenPrint", event.target.value);
    const response = await ipcRenderer.invoke("save-configuration", {
      item: "kitchen-printer",
      value: event.target.value,
    });
    if (response.error) {
      toaster.error(response.message)
    }
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
