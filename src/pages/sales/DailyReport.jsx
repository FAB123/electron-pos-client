import React, { useState, useEffect, useContext } from "react";

import { IconButton, Stack, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { toCurrency } from "../../constants/constants";
import { GETDAILYSALES } from "../../constants/apiUrls";
import ReportViewer from "./ReportViewer";
import "flatpickr/dist/themes/material_orange.css";
import "./flatpickr.css";

import Flatpickr from "react-flatpickr";
import moment from "moment";

import Breadcrumb from "../../components/controls/Breadcrumb";
import PosDrawer from "../../components/controls/PosDrawer";
import ReportTables from "../../components/table/ReportTables";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DailyReconsilation from "./DailyReconsilation";
import { posContext } from "../../stores/AppContext";

//moment1.set('hour', 10);
// moment1.set('minute', 18);
// moment1.set('second', 30);
// moment1.set('millisecond', 150);

const startOfToday = moment().startOf("day").format("DD-MM-YYYY hh:mm A"); // Today at 00:00 UTC
const endOfTheDay = moment().endOf("day").format("DD-MM-YYYY hh:mm A"); // Today at 23:59 UTC

function DailyReport() {
  const { t } = useTranslation();
  const title = t("sales.daily_sales");
  const primaryKey = "sale_id";
  const header = [
    {
      name: "sale_id",
      label: t("common.sale_id"),
      options: {
        customBodyRender: (value, tableMeta) => (
          <Typography
            sx={{ color: "blue", cursor: "pointer" }}
            onClick={() => {
              switch (tableMeta.rowData[2]) {
                case "CAS":
                  setSaleType("CASHSALE");
                  break;
                case "CASR":
                  setSaleType("CASHSALERETURN");
                  break;
                case "CRS":
                  setSaleType("CREDITSALE");
                  break;
                case "CRSR":
                  setSaleType("CREDITSALERETURN");
                  break;
                default:
                  break;
              }
              setInvoiceNumber(value);
              setOpenReport(true);
            }}
          >
            {value}
          </Typography>
        ),
      },
    },
    {
      name: "transaction_time",
      label: t("common.date"),
    },
    {
      name: "sale_type",
      label: t("sales.sale_type"),
      options: {
        customBodyRender: (value) => {
          switch (value) {
            case "CAS":
              return t("common.cash_purchase");
            case "CASR":
              return t("common.cash_purchase_return");
            case "CRS":
              return t("common.credit_purchase");
            case "CRSR":
              return t("common.credit_purchase_return");
            default:
              break;
          }
        },
      },
    },
    {
      name: "bill_type",
      label: t("sales.bill_type"),
    },
    {
      name: "sub_total",
      label: t("common.subtotal"),
      options: {
        customBodyRender: (value) => toCurrency(value),
      },
    },
    {
      name: "tax",
      label: t("common.tax"),
      options: {
        customBodyRender: (value) => toCurrency(value),
      },
    },
    {
      name: "total",
      label: t("common.total"),
      options: {
        customBodyRender: (value) => toCurrency(value),
      },
    },
    {
      name: "payment",
      label: t("tables.payment_method"),
      options: {
        customBodyRender: (value) =>
          value.map((payment) => {
            return `${payment.payment_name_en} [ ${payment.payment_name_ar} ] : ${payment.amount} `;
          }),
      },
    },
  ];

  const [openReport, setOpenReport] = useState(false);

  const [printReport, setPrintReport] = useState(false);

  const [invoiceNumber, setInvoiceNumber] = useState(null);

  const [saleType, setSaleType] = useState(null);
  const [url, setURL] = useState(null);

  // const date = moment().format("DD-MM-YYYY");

  // const [generatedFromDate, setGeneratedFromDate] = useState(date);
  // const [generatedToDate, setGeneratedToDate] = useState(date);

  const [fromDate, setFromDate] = useState(startOfToday);
  const [toDate, setToDate] = useState(endOfTheDay);

  // const [date, setDate] = useState(null);

  // useEffect(() => {
  //   setURL(`${GETDAILYSALES}/${generatedFromDate}/${generatedToDate}`);
  // }, [generatedFromDate, generatedToDate]);

  useEffect(() => {
    if (fromDate && toDate) {
      // Convert dates to UTC ISO format and URL encode them
      // const fromEncoded = encodeURIComponent(fromDate.toISOString());
      // const toDateEncoded = encodeURIComponent(toDate.toISOString());
      // console.log(`${GETDAILYSALES}/${fromEncoded}/${toDateEncoded}`);
      let generatedFromDate = moment(
        fromDate,
        "DD-MM-YYYY hh:mm a"
      ).toISOString();

      let generatedToDate = moment(toDate, "DD-MM-YYYY hh:mm a").toISOString();

      setURL(`${GETDAILYSALES}/${generatedFromDate}/${generatedToDate}`);
    }
  }, [fromDate, toDate]);

  const { setNavigation } = useContext(posContext);

  setNavigation(t("modules.daily_sales"));

  return (
    <Stack>
      {/* <Breadcrumb
        labelSub={t("sales.daily_sales")}
        labelHead={t("sales.sales")}
      /> */}
      <PosDrawer open={openReport} setOpen={setOpenReport}>
        <ReportViewer
          saleType={saleType}
          setOpenReport={setOpenReport}
          invoiceNumber={invoiceNumber}
        />
      </PosDrawer>

      {printReport && (
        <PosDrawer open={printReport} setOpen={setPrintReport}>
          <DailyReconsilation
            setPrintReport={setPrintReport}
            fromDate={fromDate}
            toDate={toDate}
          />
        </PosDrawer>
      )}

      {url && (
        <ReportTables
          title={title}
          header={header}
          url={url}
          primaryKey={primaryKey}
          type="direct"
          customToolbar={
            <Stack direction={"row"} justifyContent={"flex-end"} spacing={0.5}>
              {/* <Flatpickr
              options={{
                mode: "range",
                enableTime: true,
                dateFormat: "d-m-Y HH:ss A",
                maxDate: date,
                defaultDate: [generatedFromDate, generatedToDate],
              }}
              render={({ defaultValue, value, ...props }, ref) => {
                return (
                  <TextField
                    size="small"
                    variant="standard"
                    defaultValue={defaultValue}
                    inputRef={ref}
                    sx={{ width: 400 }}
                    label={t("common.date")}
                  />
                );
              }}
              onChange={([fromDate, toDate]) => {
                if (fromDate && toDate) {
                  setGeneratedFromDate(moment(fromDate).format("DD-MM-YYYY"));
                  setGeneratedToDate(moment(toDate).format("DD-MM-YYYY"));
                }
              }}
            /> */}

              {/* <TextField
              label="From"
              type="datetime-local"
              size="small"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              inputProps={{ max: new Date().toISOString().slice(0, 16) }}
              fullWidth
              variant="outlined"
            />

            <TextField
              label="To"
              type="datetime-local"
              size="small"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              inputProps={{ max: new Date().toISOString().slice(0, 16) }}
              fullWidth
              variant="outlined"
            /> */}

              <Flatpickr
                value={fromDate}
                onChange={(selectedFromDates) =>
                  setFromDate(selectedFromDates[0])
                }
                options={{
                  mode: "single",
                  // maxDate: "today",
                  maxDate: new Date().setHours(23, 59, 59, 999),
                  enableTime: true,
                  dateFormat: "d-m-Y h:i K", // Display format in picker
                  time_24hr: false,
                  altInput: true,
                  altFormat: "d-m-Y h:i K", // Display format in TextField
                }}
                render={({ defaultValue, value, ...props }, ref) => (
                  <TextField
                    {...props}
                    size="small"
                    label="FROM"
                    inputRef={ref}
                    value={value || ""}
                    variant="outlined"
                    sx={{ width: "fit-content" }}
                  />
                )}
              />

              <Flatpickr
                value={toDate}
                onChange={(selectedFromDates) =>
                  setToDate(selectedFromDates[0])
                }
                options={{
                  mode: "single",
                  // minDate: fromDate,
                  maxDate: new Date().setHours(23, 59, 59, 999),
                  enableTime: true,
                  dateFormat: "d-m-Y h:i K", // Display format in picker
                  time_24hr: false,
                  altInput: true,
                  altFormat: "d-m-Y h:i K", // Display format in TextField
                }}
                render={({ defaultValue, value, ...props }, ref) => (
                  <TextField
                    {...props}
                    size="small"
                    label="TO"
                    inputRef={ref}
                    // defaultValue={defaultValue}
                    value={value || ""}
                    variant="outlined"
                    sx={{ width: "fit-content" }}
                  />
                )}
              />
              <IconButton
                color="success"
                size="small"
                onClick={() => setPrintReport(true)}
              >
                <ReceiptIcon fontSize="small" />
              </IconButton>
            </Stack>
          }
        />
      )}
    </Stack>
  );
}

export default DailyReport;
