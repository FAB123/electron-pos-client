import {
  Button,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { tableContext } from "../../../stores/SaleContext";
import PosDialog from "../../controls/PosDialog";

function SelectTable({ savedDatas, setSavedDatas }) {
  const { t } = useTranslation();
  const [selectTable, setSelectTable] = useState(false);
  const { tablesList } = useContext(tableContext);

  const handleChange = (_, value) => {
    if (value === "table") {
      setSelectTable(true);
    } else {
      setSavedDatas({ ...savedDatas, table: value });
      if (value > 2) {
        setSelectTable(false);
      }
    }
  };

  return (
    <>
      <ToggleButtonGroup
        color="primary"
        value={savedDatas.table}
        exclusive
        onChange={handleChange}
        sx={{ width: "100%" }}
      >
        <ToggleButton sx={{ flex: 1 }} value={2}>
          {t("sales.take_away")}
        </ToggleButton>
        <ToggleButton sx={{ flex: 1 }} value={1}>
          {t("sales.delivery")}
        </ToggleButton>
        <ToggleButton
          sx={{ flex: 1 }}
          value={"table"}
          selected={savedDatas.table > 2}
        >
          {savedDatas.table > 2
            ? tablesList[savedDatas.table - 3]?.table_name_en
            : t("sales.dine_in")}
        </ToggleButton>
      </ToggleButtonGroup>
      {selectTable && (
        <PosDialog
          title={t("sales.select_table")}
          open={selectTable}
          setOpen={setSelectTable}
        >
          <Grid container spacing={1} rowGap={0.5}>
            {tablesList.map((item, key) => (
              <Grid item xs={4}>
                <Button
                  fullWidth
                  variant={
                    savedDatas.table === item.table_id
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => {
                    setSavedDatas({ ...savedDatas, table: item.table_id });
                    setSelectTable(false);
                  }}
                  width
                  key={key}
                >
                  {`${item.table_name_en}\n${item.table_name_ar}`}
                </Button>
              </Grid>
            ))}
          </Grid>
        </PosDialog>
      )}
    </>
  );
}

export default SelectTable;
