import { toCurrency } from "../../constants/constants";

const generatePrintableData = (printData, storeData) => {
  let itemArray = [];
  printData?.invoice_data?.body.forEach((item) => {    
    // console.log(item);
    
    itemArray.push([
      {
        type: "text",
        value: item.item, //item_name_ar,item_name
        style: {
          textAlign: "left",
          width: "35%",
        },
      },
      item.price.toFixed(2),
      item.qty,
      // item.subtotal,
      // item.vat,
      {
        type: "text",
        value: item.total.toFixed(2),
        style: {
          textAlign: "right",
          width: "25%",
        },
      },
    ]);
    // itemArray.push([
    //   {
    //     type: "text",
    //     value: item.item_name_ar, //item_name_ar,item_name
    //     style: {
    //       textAlign: "left",
    //       width: "100%",
    //       fontSize: "10px",
    //     },
    //   },
    //   "",
    //   "",
    //   "",
    // ]);
  });
  let paymentArray = [];
  printData?.payment.forEach((item) => {
    paymentArray.push([
      item.payment_name_en,
      item.payment_name_ar,
      item.amount.toFixed(2),
    ]);
  });
  const printableData = [
    {
      type: "text",
      value: "SIMPLIFIED TAX INVOICE",
      style: {
        textAlign: "center",
        fontWeight: "900",
        fontSize: "15px",
        fontFamily: "Cairo, sans-serif",
        // "text-decoration": "underline",
        lineHeight: "19px",
      },
    },
    {
      type: "text",
      value: "فاتورة ضریبیة مبسطة",
      style: {
        textAlign: "center",
        fontWeight: "700",
        fontSize: "15px",
        fontFamily: "Cairo, sans-serif",
        // "text-decoration": "underline",
        lineHeight: "19px",
      },
    },

    // {
    //   type: "text",
    //   value: printData.company_data?.company_name_ar,
    //   style: {
    //     textAlign: "center",
    //     fontWeight: "700",
    //     fontSize: "15px",
    //     fontFamily: "Cairo, sans-serif",
    //     lineHeight: "18px",
    //   },
    // },
  ];

  if (printData.company_logo) {
    printableData.push({
      type: "image",
      url: `data:image/png;base64,${printData.company_logo}`, // file path
      position: "center", // position of image: 'left' | 'center' | 'right'
      width: "100px", // width of image in px; default: auto
      height: "100px", // width of image in px; default: 50 or '50px'
      style: { marginBottom: "15px" },
    });
  }

  printableData.push(
    {
      type: "text",
      value: printData.company_data?.location_store_name_ar,
      style: {
        textAlign: "center",
        fontWeight: "700",
        fontSize: "22px",
        fontFamily: "Cairo, sans-serif",
        lineHeight: "24px",
      },
    },
    // {
    //   type: "text",
    //   value: printData.company_data?.location_store_name_ar,
    //   style: {
    //     textAlign: "center",
    //     fontWeight: "700",
    //     fontSize: "12px",
    //     fontFamily: "Cairo, sans-serif",
    //     lineHeight: "15px",
    //   },
    // },
    // {
    //   type: "text",
    //   // value: `${printData.company_data?.location_street_name_en} - ${printData.company_data?.location_district_en} - ${printData.company_data?.location_city_en}`,
    //   value: `${printData.company_data?.location_city_en} - ${printData.company_data?.location_district_en} - ${printData.company_data?.location_street_name_en}`,
    //   style: {
    //     textAlign: "center",
    //     fontWeight: "700",
    //     fontSize: "13px",
    //     fontFamily: "Cairo, sans-serif",
    //     lineHeight: "15px",
    //   },
    // },
    // {
    //   type: "text",
    //   value: `${printData.company_data?.location_street_name_ar} - ${printData.company_data?.location_district_ar} - ${printData.company_data?.location_city_ar}`,
    //   style: {
    //     textAlign: "center",
    //     fontWeight: "700",
    //     fontSize: "10px",
    //     fontFamily: "Cairo, sans-serif",
    //     lineHeight: "15px",
    //   },
    // },
    {
      type: "text",
      value: printData.company_data?.company_address,
      style: {
        textAlign: "center",
        fontWeight: "700",
        fontSize: "13px",
        fontFamily: "Cairo, sans-serif",
        lineHeight: "15px",
      },
    },
    {
      type: "text",
      value: `${printData.company_data?.location_phone_number} : للتواصل`,
      // value: printData.company_data?.location_building_no,
      style: {
        textAlign: "center",
        fontWeight: "700",
        fontSize: "13px",
        fontFamily: "Cairo, sans-serif",
        lineHeight: "15px",
      },
    },

    {
      type: "text",
      value: `رقم الضريبة: ${printData.company_data?.company_vat_number}`,
      style: {
        textAlign: "center",
        fontWeight: "700",
        fontSize: "13px",
        fontFamily: "Cairo, sans-serif",
        lineHeight: "15px",
      },
    },
    {
      type: "text",
      value: printData.company_data?.company_name,
      style: {
        textAlign: "center",
        fontWeight: "600",
        fontSize: "12px",
        marginTop: "10px",
        marginBottom: "10px",
        fontFamily: "Cairo, sans-serif",
        lineHeight: "18px",
      },
    },
    {
      type: "text",
      value: printData.token ? `TOKEN: ${printData.token}` : "",
      style: {
        textAlign: "center",
        fontWeight: "700",
        fontSize: "25px",
        fontFamily: "Cairo, sans-serif",
        marginTop: "5px",
      },
    },
    {
      type: "text",
      value: printData.table ?? "",
      style: {
        textAlign: "center",
        fontWeight: "700",
        fontSize: "12px",
        marginBottom: "5px",
        lineHeight: "13px",
      },
    },
    // {
    //   type: "text",
    //   value: "---------------------------------------------------",
    //   style: {
    //     textAlign: "center",
    //     fontWeight: "800",
    //     fontSize: "15px",
    //     fontFamily: "Cairo, sans-serif",
    //   },
    // },
    //table footer
    {
      type: "table",
      style: {
        fontWeight: "700",
        fontSize: "12x",
        fontFamily: "Cairo, sans-serif",
        lineHeight: "10px",
      },
      tableBody: [
        [
          "INVOICE",
          `${printData?.invoice_data?.invoicePatern}-${printData?.invoice_data?.invoice_number}`,
          "رقم الفاتورة",
        ],
        ["DATE", printData?.invoice_data?.invoice_date, "تاريخ الفاتورة"],
      ],
      tableFooter: [],
      tableHeaderStyle: {},
      tableBodyStyle: {
        border: "1px solid #000",
        fontWeight: "600",
        lineHeight: "10px",
        fontFamily: "Cairo, sans-serif",
      },
      tableFooterStyle: {},
    },
    {
      type: "table",
      // style the table
      style: {
        // border: "2px solid #000",
        fontWeight: "600",
        fontSize: "11px",
        fontFamily: "Cairo, sans-serif",
        lineHeight: "10px",
      },

      tableHeader: [
        {
          type: "text",
          value: "Description <br/> وصف",
          style: {
            textAlign: "left",
            width: "30%",
          },
        },

        {
          type: "text",
          value: "Rate <br/> سعر",
          style: {
            textAlign: "center",
            width: "20%",
          },
        },
        {
          type: "text",
          value: "Qty \n الكمية",
          style: {
            textAlign: "center",
            width: "20%",
          },
        },
        {
          type: "text",
          value: "Total <br/> مجموع",
          style: {
            textAlign: "right",
            width: "30%",
          },
        },
        // "Description \n وصف",
        // "Rate \n سعر",
        // "Qty \n الكمية",
        // // "Sub Total \n المجموع الفرعي	",
        // // "VAT \n ضريبة",
        // "Total \n مجموع",
      ],

      tableBody: itemArray,
      tableFooter: [],
      tableHeaderStyle: {
        color: "#000",
        fontWeight: "800",
        lineHeight: "10px",
        fontSize: "10px",
        fontFamily: "Cairo, sans-serif",
      },
      tableBodyStyle: {
        // border: "1px solid #000",
        fontWeight: "700",
        fontSize: "12px",
        lineHeight: "17px",
        fontFamily: "Cairo, sans-serif",
      },
      tableFooterStyle: {},
    },
    //table footer
    {
      type: "table",
      style: {
        fontWeight: "700",
        fontSize: "10px",
        fontFamily: "Cairo, sans-serif",
        lineHeight: "10px",
      },
      tableBody: [
        [
          "SubTotal",
          "المجموع الفرعي",
          printData?.invoice_data?.subTotal.toFixed(2),
        ],
        ["VAT 15%", "ضريبة  ٪١٥", printData?.invoice_data?.totalVat.toFixed(2)],
        ["Total", "المجموع", printData?.invoice_data?.total.toFixed(2)],
        // [
        //   "Additional Discount",
        //   "خصم إضافي",
        //   printData?.invoice_data?.discount.toFixed(2),
        // ],
      ],
      tableFooter: [],
      tableHeaderStyle: {},
      tableBodyStyle: {
        border: "1px solid #000",
        fontWeight: "600",
        lineHeight: "12px",
        fontSize: "11px",
        fontFamily: "Cairo, sans-serif",
      },
      tableFooterStyle: {},
    },
    {
      type: "table",
      style: {
        fontFamily: "Cairo, sans-serif",
        textAlign: "center",
        fontWeight: "700",
        fontSize: "13px",
        border: "1px solid #000",
      },
      tableBody: [
        [
          "Net Total",
          "صافي المجموع",
          printData?.invoice_data?.net_amount.toFixed(2),
        ],
      ],
      tableFooter: [],
      tableHeaderStyle: {},
      tableBodyStyle: {},
      tableFooterStyle: {},
    },

    //payment array
    {
      type: "table",
      style: {
        fontWeight: "700",
        fontSize: "10px",
        fontFamily: "Cairo, sans-serif",
        marginTop: "5px",
        marginBottom: "10px",
        lineHeight: "10px",
      },
      tableBody: paymentArray,
      tableFooter: [],
      tableHeaderStyle: {},
      tableBodyStyle: {
        border: "1px solid #000",
        fontWeight: "600",
        lineHeight: "10px",
        fontFamily: "Cairo, sans-serif",
      },
      tableFooterStyle: {},
    },
    {
      type: "qrCode", //tokenType
      value: printData?.invoice_data?.qrDataString,
      height: 120, //150
      width: 120,
      position: "center",
    },
    // {
    //   type: "text",
    //   value: printData.company_data?.return_policy,
    //   style: {
    //     textAlign: "center",
    //     fontWeight: "500",
    //     fontSize: "10px",
    //     lineHeight: "10px",
    //     fontFamily: "Cairo, sans-serif",
    //   },
    // },
    {
      type: "text",
      value: printData.company_data?.return_policy_ar,
      style: {
        textAlign: "center",
        fontWeight: "700",
        fontSize: "10px",
        fontFamily: "Cairo, sans-serif",
        lineHeight: "11px",
      },
    },
    {
      type: "barCode",
      value: `${printData?.invoice_data?.invoicePatern}-${printData?.invoice_data?.invoice_number}`,
      height: 35,
      width: 1,
      displayValue: true,
      fontsize: 8,
      position: "center",
    }
  );

  const tokenData = [
    {
      type: "text",
      value: "---------------------------------------------------",
      style: {
        textAlign: "center",
        fontWeight: "800",
        fontSize: "15px",
        fontFamily: "Cairo, sans-serif",
      },
    },
    {
      type: "text",
      value:
        "Please scan this QR code to receive updates directly on your mobile phone.",
      style: {
        textAlign: "left",
        fontWeight: "600",
        fontSize: "13px",
        fontFamily: "sans-serif",
        lineHeight: "17px",
        margin: "4px",
      },
    },
    {
      type: "text",
      value:
        "يرجى مسح رمز الاستجابة السريعة هذا لتلقي التحديثات مباشرة على هاتفك المحمول.",
      style: {
        textAlign: "right",
        fontWeight: "600",
        fontSize: "13px",
        fontFamily: "Cairo, sans-serif",
        direction: "rtl",
        marginRight: "10px",
        lineHeight: "17px",
      },
    },
    {
      type: "qrCode",
      value: printData?.tokenData,
      height: 100,
      width: 100,
      position: "center",
    },
  ];

  if (printData?.tokenData) {
    printableData.push(...tokenData);
  }

  // let kitchenPrint;

  // const savedPrinter = localStorage.getItem("kitchenPrint");

  // if (savedPrinter) {
  //   kitchenPrint = savedPrinter === "0" ? false : savedPrinter;
  // } else {
  //   kitchenPrint = false;
  // }

  let kitchenPrint = storeData?.appdata['kitchen-printer'].toString() === '0' ? null : storeData?.appdata['kitchen-printer']

  
  if (kitchenPrint) {
    let kitchenItemArray = [];
    printData?.invoice_data?.body.forEach((item) => {
      kitchenItemArray.push([item.item, item.qty]);
    });

    var kitchenPrintData = [
      {
        type: "text",
        value: printData.token ? `TOKEN: ${printData.token}` : "",
        style: {
          textAlign: "center",
          fontWeight: "700",
          fontSize: "15px",
          fontFamily: "Cairo, sans-serif",
          marginTop: "5px",
          marginBottom: "5px",
        },
      },
      {
        type: "table",
        style: {
          fontWeight: "700",
          fontSize: "10px",
          fontFamily: "Cairo, sans-serif",
          lineHeight: "10px",
        },
        tableBody: [
          [
            "INVOICE",
            `${printData?.invoice_data?.invoicePatern}-${printData?.invoice_data?.invoice_number}`,
            "رقم الفاتورة",
          ],
          ["DATE", printData?.invoice_data?.invoice_date, "تاريخ الفاتورة"],
        ],
        tableFooter: [],
        tableHeaderStyle: {},
        tableBodyStyle: {
          fontWeight: "600",
          lineHeight: "10px",
          fontFamily: "Cairo, sans-serif",
        },
        tableFooterStyle: {},
      },
      {
        type: "table",
        style: {
          fontWeight: "600",
          fontSize: "9px",
          fontFamily: "Cairo, sans-serif",
          lineHeight: "10px",
        },

        tableHeader: ["Description", "Qty"],
        tableBody: kitchenItemArray,
        tableFooter: [],
        tableHeaderStyle: {
          border: "1px solid #000",
          fontWeight: "800",
          lineHeight: "10px",
          fontSize: "10px",
          fontFamily: "Cairo, sans-serif",
        },
        tableBodyStyle: {
          border: "1px solid #000",
          fontWeight: "600",
          lineHeight: "10px",
          fontFamily: "Cairo, sans-serif",
        },
        tableFooterStyle: {},
      },
    ];
  }

  return { printableData, kitchenPrint, kitchenPrintData };
};

const generateReportPrintableData = (printData) => {
  let temp_sale_data = [
    {
      key: "Sales:",
      value: toCurrency(printData.data.sales_total.sales_sub_total),
    },
    {
      key: "Value Added Tax 15%:",
      value: toCurrency(printData.data.sales_total.sales_tax),
    },
    {
      key: "Gross Total (Sales):",
      value: toCurrency(printData.data.sales_total.sales_total),
    },
    {
      key: "Sales Return:",
      value: toCurrency(
        Math.abs(printData.data.sales_total.sales_return_sub_total)
      ),
    },
    {
      key: "Value Added Tax 15%:",
      value: toCurrency(Math.abs(printData.data.sales_total.sales_return_tax)),
    },
    {
      key: "Gross Total (Sales Return):",
      value: toCurrency(
        Math.abs(printData.data.sales_total.sales_return_total)
      ),
    },
  ];
  let sales = temp_sale_data.map((item) => [
    {
      type: "text",
      value: item.key,
      style: {
        textAlign: "left",
      },
    },
    {
      type: "text",
      value: item.value,
      style: {
        textAlign: "right",
      },
    },
  ]);
  let details = Object.entries(printData?.data?.grouped).map(([key, value]) => [
    {
      type: "text",
      value: key,
      style: {
        textAlign: "left",
      },
    },
    {
      type: "text",
      value: `${value["qty"]}/${toCurrency(value["total"])}`,
      style: {
        textAlign: "right",
      },
    },
  ]);

  let payment = printData.data.payment_details.map((item, key) => [
    {
      type: "text",
      value: item.payment_name,
      style: {
        textAlign: "left",
      },
    },
    {
      type: "text",
      value: toCurrency(item.amount),
      style: {
        textAlign: "right",
      },
    },
  ]);

  const printableData = [
    {
      type: "text",
      value: printData.storeName.location_name_ar,
      style: {
        textAlign: "center",
        fontWeight: "900",
        fontSize: "20px",
        fontFamily: "Tahoma, Arial, sans-serif",
        lineHeight: "21px",
      },
    },
    {
      type: "text",
      value: "Reconsilation Report",
      style: {
        textAlign: "center",
        fontWeight: "600",
        "marginTop": "8px",
        fontSize: "16px",
        fontFamily: "Tahoma, Arial, sans-serif",
        lineHeight: "17px",
      },
    },
    {
      type: "text",
      value: `Print Date: ${new Date().toLocaleString("en-GB")}`,
      style: {
        textAlign: "left",
        "marginTop": "13px",
        fontWeight: 600,
        fontSize: "12px",
        fontFamily: "Tahoma, Arial, sans-serif",
        lineHeight: "14px",
      },
    },
    {
      type: "text",
      value: `From: ${printData.tofromDate} - To: ${printData.toToDate} `,
      style: {
        textAlign: "left",
        fontWeight: 600,
        fontSize: "12px",
        fontFamily: "Tahoma, Arial, sans-serif",
        lineHeight: "14px",
      },
    },
    {
      type: "text",
      value: "Sale Reconciliation",
      style: {
        textAlign: "left",
        fontWeight: 800,
        fontSize: "14px",
        "marginTop": "8px",
        "margin-bottom": "5px",
        fontFamily: "Tahoma, Arial, sans-serif",
        lineHeight: "16px",
      },
    },
    {
      type: "table",
      style: {
        // border: "0px solid #fff",
        fontWeight: 600,
        fontFamily: "Tahoma, Arial, sans-serif",
        "margin-left": "25px",
      },
      tableBody: sales,
      tableFooter: [
        {
          type: "text",
          value: "Net Sales:",
          style: {
            textAlign: "left",
          },
        },
        toCurrency(
          printData.data.sales_total.sales_total +
            printData.data.sales_total.sales_return_total
        ),
      ],
      tableHeaderStyle: { border: "0px solid #fff" },
      tableBodyStyle: {
        fontFamily: "Tahoma, Arial, sans-serif",
        border: "0px solid #fff",
        "border-bottom": "0px solid #fff",
      },
      tableFooterStyle: { fontWeight: 700 },
    },
    {
      type: "text",
      value:
        printData.type === "category"
          ? "Category Wise Sales"
          : "Item Wise Sales",
      style: {
        textAlign: "left",
        fontWeight: 800,
        fontSize: "14px",
        "marginTop": "8px",
        "margin-bottom": "5px",
        fontFamily: "Tahoma, Arial, sans-serif",
        lineHeight: "16px",
      },
    },
    {
      type: "table",
      style: {
        // border: "0px solid #fff",
        fontWeight: 600,
        fontFamily: "Tahoma, Arial, sans-serif",
        "margin-left": "25px",
      },
      tableBody: details,
      tableFooter: [],
      tableHeaderStyle: { border: "0px solid #fff" },
      tableBodyStyle: {
        fontFamily: "Tahoma, Arial, sans-serif",
        border: "0px solid #fff",
        "border-bottom": "0px solid #fff",
      },
      tableFooterStyle: {},
    },
    {
      type: "text",
      value: "Payment Modes",
      style: {
        textAlign: "left",
        fontWeight: 800,
        fontSize: "14px",
        "marginTop": "8px",
        "margin-bottom": "5px",
        fontFamily: "Tahoma, Arial, sans-serif",
        lineHeight: "16px",
      },
    },
    {
      type: "table",
      style: {
        fontWeight: 600,
        fontFamily: "Tahoma, Arial, sans-serif",
        "margin-left": "25px",
      },
      tableBody: payment,
      tableFooter: [
        {
          type: "text",
          value: "Total",
          style: {
            textAlign: "left",
          },
        },
        {
          type: "text",
          value: toCurrency(
            printData.data.sales_total.sales_total +
              printData.data.sales_total.sales_return_total
          ),
          style: {
            textAlign: "right",
          },
        },
      ],
      tableHeaderStyle: { border: "0px solid #fff" },
      tableBodyStyle: {
        border: "0px solid #fff",
        "border-bottom": "0px solid #fff",
      },
      tableFooterStyle: {},
    },
    {
      type: "text",
      value: "------ Thank You ------",
      style: {
        textAlign: "center",
        fontWeight: "900",
        fontSize: "15px",
        fontFamily: "Tahoma, Arial, sans-serif",
        "marginTop": "20px",
      },
    },
  ];
  return { printableData, kitchenPrint: false, kitchenPrintData: null };
};
export { generatePrintableData, generateReportPrintableData };
