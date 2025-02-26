import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Chip,
  createTheme,
  Divider,
  IconButton,
  Stack,
  styled,
  ThemeProvider,
  Typography,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import PdfIcon from "@mui/icons-material/PictureAsPdf";
import { getData } from "../../apis/apiCalls";
import { GETRECONSILATION } from "../../constants/apiUrls";
import { toCurrency } from "../../constants/constants";
import generatePDF from "react-to-pdf";
import { generateReportPrintableData } from "../../helpers/CustomInvoice/PosPrint";
import moment from "moment";

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 650,
}));

const formatDate = (date) =>
  moment(date, "DD-MM-YYYY hh:mm a").format("DD-MM-YYYY hh:mm A");

function DailyReconsilation({ fromDate, toDate }) {
  const { ipcRenderer } = window.require("electron");
  const contentRef = useRef(null);
  const [data, setData] = useState(null);
  const [type, setType] = useState("category");
  // const printFn = useReactToPrint({ contentRef });
  const [storeName, setStoreName] = useState("");

  useEffect(() => {
    if (fromDate && toDate) {
      let generatedFromDate = moment(
        fromDate,
        "DD-MM-YYYY hh:mm a"
      ).toISOString();

      let generatedToDate = moment(toDate, "DD-MM-YYYY hh:mm a").toISOString();

      getData(
        `${GETRECONSILATION}/${generatedFromDate}/${generatedToDate}/${type}`
      ).then((response) => {
        if (!response.error) {
          setData(response.data);
        }
      });
    }
    let storeData = JSON.parse(localStorage.getItem("store_data"));

    setStoreName(storeData?.store);
  }, [fromDate, toDate, type]);

  const changeCategory = () => {
    setType((prev) => (prev === "category" ? "item" : "category"));
  };

  const theme = createTheme({
    typography: {
      fontFamily: "Tahoma, Arial, sans-serif",
    },
  });

  const sendPrint = () => {
    let tofromDate = formatDate(fromDate);
    let toToDate = formatDate(toDate);

    let preData = { storeName, tofromDate, toToDate, data, type };
    let printableData = generateReportPrintableData(preData);
    ipcRenderer.send("print-invoice", printableData);
  };

  return (
    <ThemeProvider theme={theme}>
      {data ? (
        <>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <IconButton
              size="small"
              onClick={() =>
                generatePDF(contentRef, { filename: "report.pdf" })
              }
            >
              <PdfIcon color="error" />
            </IconButton>
            <Chip
              label={type === "category" ? "Category Based" : "Item Based"}
              variant="filled"
              onClick={changeCategory}
              color="success"
              size="small"
            />
            <IconButton size="small" onClick={sendPrint}>
              <PrintIcon color="info" />
            </IconButton>
          </Stack>
          <Divider sx={{ marginBottom: 2 }} />

          <Box ref={contentRef} sx={{ width: "70mm", padding: "5px" }}>
            {/* Header */}
            <Stack direction="column" alignItems="center">
              <Typography variant="h6" component="h1">
                {storeName.location_name_en}
              </Typography>
              <Typography variant="h6" component="h1">
                {storeName.location_name_ar}
              </Typography>
              <Typography variant="subtitle1">Reconsilation Report</Typography>
            </Stack>
            <Divider />

            <Box sx={{ alignItems: "left" }}>
              <Typography variant="body2">
                Print Date: {moment().format("DD-MM-YYYY hh:mm A")}
              </Typography>
              <Typography variant="body2">
                From:
                {formatDate(fromDate)}
              </Typography>
              <Typography variant="body2">To: {formatDate(toDate)}</Typography>
            </Box>

            {/* Cash Reconciliation */}
            {/* <Box sx={{ marginBottom: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Cash Reconciliation
              </Typography>
              <Box sx={{ marginLeft: 3 }}>
                <Typography variant="body2">
                  Opening Amount: <span>0</span>
                </Typography>
                <Typography variant="body2">
                  Cash from Sales: <span>2854.82</span>
                </Typography>
                <Typography variant="body2">
                  Delivery Charges: <span>0</span>
                </Typography>
                <Typography variant="body2">
                  Service Charges: <span>0</span>
                </Typography>
                <Typography variant="body2">
                  Theoretical: <span>2854.82</span>
                </Typography>
                <Typography variant="body2">
                  Physical Closing: <span>0</span>
                </Typography>
                <Typography variant="body2">
                  Cash Variance: <span>-2854.82</span>
                </Typography>
              </Box>
            </Box> */}

            <Divider />

            {/* Sale Reconciliation */}
            <Box sx={{ marginBottom: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Sale Reconciliation
              </Typography>
              <Box sx={{ marginLeft: 3, marginRight: 1 }}>
                <Stack justifyContent={"space-between"} direction={"row"}>
                  <StyledTypography variant="body2">Sales:</StyledTypography>
                  <StyledTypography variant="body2">
                    {toCurrency(data.sales_total.sales_sub_total)}
                  </StyledTypography>
                </Stack>

                <Stack justifyContent={"space-between"} direction={"row"}>
                  <StyledTypography variant="body2">
                    Value Added Tax 15%:
                  </StyledTypography>
                  <StyledTypography variant="body2">
                    {toCurrency(data.sales_total.sales_tax)}
                  </StyledTypography>
                </Stack>

                <Stack justifyContent={"space-between"} direction={"row"}>
                  <StyledTypography variant="body2">
                    Gross Total (Sales):
                  </StyledTypography>
                  <StyledTypography variant="body2">
                    {toCurrency(data.sales_total.sales_total)}
                  </StyledTypography>
                </Stack>
                <Divider sx={{ marginY: 1 }} />

                <Stack justifyContent={"space-between"} direction={"row"}>
                  <StyledTypography variant="body2">
                    Sales Return:
                  </StyledTypography>
                  <StyledTypography variant="body2">
                    {toCurrency(
                      Math.abs(data.sales_total.sales_return_sub_total)
                    )}
                  </StyledTypography>
                </Stack>

                <Stack justifyContent={"space-between"} direction={"row"}>
                  <StyledTypography variant="body2">Tax:</StyledTypography>
                  <StyledTypography variant="body2">
                    {toCurrency(Math.abs(data.sales_total.sales_return_tax))}
                  </StyledTypography>
                </Stack>

                <Stack justifyContent={"space-between"} direction={"row"}>
                  <StyledTypography variant="body2">
                    Gross Total (Sales Return):
                  </StyledTypography>
                  <StyledTypography variant="body2">
                    {toCurrency(Math.abs(data.sales_total.sales_return_total))}
                  </StyledTypography>
                </Stack>

                <Divider sx={{ marginY: 1 }} />

                <Stack justifyContent={"space-between"} direction={"row"}>
                  <StyledTypography variant="body2">
                    Net Sales:
                  </StyledTypography>
                  <StyledTypography variant="body2">
                    {toCurrency(
                      data.sales_total.sales_total +
                        data.sales_total.sales_return_total
                    )}
                  </StyledTypography>
                </Stack>
              </Box>
            </Box>

            <Divider sx={{ marginY: 2 }} />

            {/* Category Wise Sales */}
            <Box sx={{ marginBottom: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {type === "category" ? "Category" : "Item"} Wise Sales
              </Typography>
              <Box sx={{ marginLeft: 3 }}>
                {Object.entries(data.grouped).map(([key, value]) => (
                  <Stack
                    justifyContent={"space-between"}
                    direction={"row"}
                    key={key}
                  >
                    <StyledTypography variant="body2">{key}</StyledTypography>

                    <StyledTypography variant="body2">
                      {value["qty"]}/{toCurrency(value["total"])}
                    </StyledTypography>
                  </Stack>
                ))}
              </Box>
            </Box>

            <Divider sx={{ marginY: 2 }} />

            {/* Payment Modes */}
            <Box sx={{ marginBottom: 2 }}>
              <Typography variant="subtitle2" fontWeight={700}>
                Payment Modes
              </Typography>
              <Box sx={{ marginLeft: 3 }}>
                {data.payment_details.map((item, key) => (
                  <Stack
                    justifyContent={"space-between"}
                    direction={"row"}
                    key={key}
                  >
                    <StyledTypography variant="body2">
                      {item.payment_name}
                    </StyledTypography>

                    <StyledTypography variant="body2">
                      {toCurrency(item.amount)}
                    </StyledTypography>
                  </Stack>
                ))}
                <Divider sx={{ marginY: 1 }} />
                <Stack justifyContent={"space-between"} direction={"row"}>
                  <StyledTypography variant="body2">Total</StyledTypography>

                  <StyledTypography variant="body2">
                    {toCurrency(
                      data.sales_total.sales_total +
                        data.sales_total.sales_return_total
                    )}
                  </StyledTypography>
                </Stack>
              </Box>
            </Box>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            width: "70mm",
            padding: "10px",
            height: "70vh",
            justifyContent: "center",
          }}
        >
          <Typography>Loading...</Typography>
        </Box>
      )}
    </ThemeProvider>
  );
}

export default DailyReconsilation;
