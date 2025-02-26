import printJS from "print-js";

import PrintEngine from "./CustomInvoice/PrintEngine";
import ThermalPrint from "./CustomInvoice/Thermalprint";

const callPrint = (response, saleType) => {
  //create new object of print engine

  let responseData = { ...response.invoice_data };

  responseData = {
    ...responseData,
    showQR: true,
    transaction_id: response.invoice_data.sale_id,
  };

  let printEngine = new PrintEngine(responseData, saleType);

  //generate formated invoice data
  let invoiceData = printEngine.generateInvoiceData();

  let thermalPrint = new ThermalPrint(invoiceData);
  thermalPrint.loadTemplate = "THERMAL";
  printJS({
    type: "raw-html",
    printable: thermalPrint.generateprinter,
  });
};

const genrateInvoiceData = (response, saleType, storeData) => {
  //create new object of print engine

  return new Promise((resolve, reject) => {
    let responseData = { ...response.invoice_data };
    let { company_logo } = storeData;

    responseData = {
      ...responseData,
      showQR: true,
      transaction_id: response.invoice_data.sale_id,
    };

    let printEngine = new PrintEngine(responseData, saleType, storeData);

    //generate formated invoice data
    let invoiceData = printEngine.generateInvoiceData();
    invoiceData.company_logo = company_logo;
    resolve(invoiceData);
  });
};

export { callPrint, genrateInvoiceData };
