import React, { useState, useEffect, memo, useContext } from "react";
import { Box, IconButton, Stack, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import Fab from "@mui/material/Fab";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import PrintIcon from "@mui/icons-material/Print";

import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from "@mui/material/InputAdornment";
import { getData } from "../../apis/apiCalls";
import { getInvLink } from "../../helpers/SalesHelper";
import toaster from "../../instence/toaster";
import PrintEngine from "../../helpers/CustomInvoice/PrintEngine";
import ThermalPrint from "../../helpers/CustomInvoice/Thermalprint";
// import printJS from "print-js";
import { generatePrintableData } from "../../helpers/CustomInvoice/PosPrint";
import { posContext } from "../../stores/AppContext";

function ReportViewer({ saleType, setOpenReport, invoiceNumber }) {
  const { t } = useTranslation();
  const [currentInv, setCurrentInv] = useState(null);
  const [lastInv, setLastInv] = useState(null);
  const [invNumber, setInvNumber] = useState(null);
  const [invPatern, setInvPatern] = useState(null);
  const [printableInvoiceData, setPrintableInvoiceData] = useState(null);
  // const [zoom, setZoom] = useState(1.0);

  const { storeData } = useContext(posContext);

  const { ipcRenderer } = window.require("electron");

  const [pdfData, setPdfData] = useState({ view: "pdf", data: null });

  const goToPrevInvoice = () => {
    createReport(currentInv - 1);
  };

  const goToNextInvoice = () => {
    createReport(currentInv + 1);
  };
  const goToLastInvoice = () => {
    createReport(lastInv);
  };

  const goToFirstInvoice = () => {
    createReport(1);
  };

  let rePrintInvoice = () => {
    if (printableInvoiceData) {
      let printableData = generatePrintableData(printableInvoiceData);
      ipcRenderer.send("print-invoice", printableData);
    }
  };

  const createReport = (id, initial = false) => {
    getData(`${getInvLink(saleType)}/${id}`).then((response) => {
      if (response.error) {
        toaster.error(t(response.message));
      } else {
        let responseData = { ...response.invoice_data };

        switch (saleType) {
          case "WORKORDER":
            responseData = {
              ...responseData,
              showQR: false,
              bill_type: "WORKORDER",
              transaction_id: response.invoice_data.workorder_id,
            };
            break;
          case "QUATATION":
            responseData = {
              ...responseData,
              showQR: false,
              bill_type: "QUOTATION",
              transaction_id: response.invoice_data.quotation_id,
            };
            break;
          default:
            responseData = {
              ...responseData,
              showQR: true,
              transaction_id: response.invoice_data.sale_id,
            };
            break;
        }

        setCurrentInv(responseData.transaction_id);
        setInvNumber(responseData.transaction_id);
        initial && setLastInv(responseData.transaction_id);

        let printEngine = new PrintEngine(responseData, saleType, storeData);
        setInvPatern(printEngine.invoicePatern);

        //generate formated invoice data
        let invoiceData = printEngine.generateInvoiceData();

        setPrintableInvoiceData(invoiceData);

        let thermalPrint = new ThermalPrint(invoiceData, storeData);
        thermalPrint.loadTemplate = "THERMAL";
        setPdfData({ view: "thermal", data: thermalPrint.generateprinter });
      }
    });
  };

  useEffect(() => {
    createReport(invoiceNumber ? invoiceNumber : null, true);
  }, []);

  return (
    <Box>
      <Stack alignItems="center" sx={{ p: 1 }}>
        <Stack direction="row" spacing={1}>
          <IconButton
            color="primary"
            aria-label="first"
            disabled={currentInv <= 1}
            onClick={goToFirstInvoice}
          >
            <KeyboardDoubleArrowLeftIcon />
          </IconButton>
          <IconButton
            color="primary"
            aria-label="previous"
            disabled={currentInv <= 1}
            onClick={goToPrevInvoice}
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
          <TextField
            style={{
              width: 150,
            }}
            value={invNumber}
            variant={"standard"}
            size={"small"}
            type={"number"}
            onChange={(e) => setInvNumber(e.target.value)}
            onBlur={() => createReport(invNumber)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">{invPatern}-</InputAdornment>
              ),
            }}
          />
          <IconButton
            color="primary"
            aria-label="next"
            disabled={currentInv >= lastInv}
            onClick={goToNextInvoice}
          >
            <NavigateNextRoundedIcon />
          </IconButton>
          <IconButton
            color="primary"
            aria-label="next"
            onClick={goToLastInvoice}
          >
            <KeyboardDoubleArrowRightIcon />
          </IconButton>
        </Stack>
      </Stack>
      <Stack alignItems="center" sx={{ m: 0.2 }}>
        <>
          <div dangerouslySetInnerHTML={{ __html: pdfData.data }}></div>
          <Box
            sx={{ "& > :not(style)": { m: 1 } }}
            style={{ position: "absolute", bottom: 12 }}
          >
            <Fab
              color="secondary"
              size="small"
              aria-label="print"
              disabled={!rePrintInvoice}
              onClick={rePrintInvoice}
              //   // printJS({
              //   //   printable: pdfData.data,
              //   //   type: "raw-html",
              //   //   showModal: true,
              //   //   modalMessage: "Retrieving Document...",
              //   // })
              //   rePrintInvoice
              // }
            >
              <PrintIcon />
            </Fab>
            <Fab
              color="error"
              onClick={() => setOpenReport(false)}
              size="small"
              aria-label="download"
            >
              <CloseIcon />
            </Fab>
          </Box>
        </>
      </Stack>
    </Box>
  );
}

export default memo(ReportViewer);
