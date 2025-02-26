import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ReportTables from "../../table/ReportTables";
import { GETPOSCOUNTERCLOSINGS } from "../../../constants/apiUrls";
import { IconButton, Stack } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PosDrawer from "../../controls/PosDrawer";
import DailyReconsilation from "../../../pages/sales/DailyReconsilation";
import moment from "moment";

function ClosingView() {
  const { t } = useTranslation();
  const title = t("sales.list_of_closing");
  const [printReport, setPrintReport] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const primaryKey = "id";
  const header = [
    {
      name: "start_time",
      label: t("common.from"),
      options: {
        customBodyRender: (value) =>
          moment(value, "YYYY-MM-DD h:mm:ss").format("DD-MM-YYYY h:mm:ss"),
      },
    },

    {
      name: "created_at",
      label: t("common.to"),
      options: {
        customBodyRender: (value) =>
          moment(value).format("DD-MM-YYYY h:mm:ss"),
      },
    },
    {
      name: "employee.employee_name",
      label: t("modules.employee"),
    },
    {
      name: "",
      label: "",
      options: {
        print: false,
        customBodyRender: (_, tableMeta) => {
          return (
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <IconButton
                color="primary"
                component="span"
                style={{ padding: "0 5px 0 5px" }}
                onClick={() => {
                  setFromDate(
                    moment(tableMeta.rowData[0], "YYYY-MM-DD h:mm:ss")
                  );
                  setToDate(moment(tableMeta.rowData[1]));
                  setPrintReport(true);
                }}
              >
                <ReceiptLongIcon />
              </IconButton>
            </Stack>
          );
        },
      },
    },
  ];
  return (
    <>
      <ReportTables
        title={title}
        header={header}
        url={GETPOSCOUNTERCLOSINGS}
        primaryKey={primaryKey}
        type="direct"
      />
      {printReport && (
        <PosDrawer open={printReport} setOpen={setPrintReport}>
          <DailyReconsilation
            setPrintReport={setPrintReport}
            fromDate={fromDate}
            toDate={toDate}
          />
        </PosDrawer>
      )}
    </>
  );
}

export default ClosingView;
