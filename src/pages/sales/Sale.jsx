import React, { useState, useEffect, useRef, useContext } from "react";
import CartControll from "../../components/bundled/sales/CartControll";
import { useTranslation } from "react-i18next";
import { Button, Divider, Grid, Paper, Stack } from "@mui/material";
import { cartBalance, submitSales } from "../../helpers/SalesHelper";
import toaster from "../../instence/toaster";
import { ToastContainer } from "react-toastify";
import Splitpayment from "../../components/bundled/sales/Splitpayment";
import { B2CSALE } from "../../constants/constants";
import { getData, postData } from "../../apis/apiCalls";
import {
  CLOSEPOSCOUNTER,
  GETALLACTIVEPAYMENTS,
  SUSPENDSALE,
} from "../../constants/apiUrls";
import SelectCustomer from "../../components/bundled/sales/SelectCustomer";
import { useMemo } from "react";
import { colorList } from "../../helpers/GeneralHelper";

import ProgressLoader from "../../components/controls/ProgressLoader";
import CategorySelector from "../../components/bundled/sales/CategorySelector";
import { genrateInvoiceData } from "../../helpers/InvoicePrint";
import ConfirmBox from "../../components/bundled/ConfirmBox";
import { posContext } from "../../stores/AppContext";
import { generatePrintableData } from "../../helpers/CustomInvoice/PosPrint";
import SelectTable from "../../components/bundled/sales/SelectTable";
import SaleContext from "../../stores/SaleContext";

function Sale({ name, type, label }) {
  const saleType = name;
  const { ipcRenderer } = window.require("electron");
  const paymentRef = useRef([]);
  //interface setup
  const { t, i18n } = useTranslation();
  const { paymentList, setPaymentList, storeData } = useContext(posContext);

  const defaultValues = {
    inital: true,
    cartItems: [],
    paymentInfo: [],
    customerInfo: null,
    billType: B2CSALE,
    printAfterSale: true,
    table: 2,
    comments: "",
  };

  function sendPosPrint(printData) {
    ipcRenderer.send("print-invoice", printData);
  }

  const [confirmation, setConfirmation] = useState(false);

  const [savedDatas, setSavedDatas] = useState(defaultValues);
  const [splitPay, setSplitPay] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const cachedSavedDatas = useMemo(() => savedDatas, [savedDatas]);

  //update interface
  useEffect(() => {
    if (!savedDatas.inital) {
      localStorage.setItem(saleType, JSON.stringify({ ...savedDatas }));
    }
  }, [savedDatas]);

  // useKeyboardShortcut(
  //   ["F1"],
  //   () => submit(paymentList[0].account_id, paymentList[0].payment_id),
  //   shotcutSettings
  // );

  // useKeyboardShortcut(
  //   ["F2"],
  //   () => submit(paymentList[1].account_id, paymentList[1].payment_id),
  //   shotcutSettings
  // );

  // useKeyboardShortcut(
  //   ["F3"],
  //   () => submit(paymentList[2].account_id, paymentList[2].payment_id),
  //   shotcutSettings
  // );

  //initializing;
  useEffect(() => {
    // const updateStoreData = async () => {
    //   let storeData = await JSON.parse(localStorage.getItem("store_data"));
    //   setStoreData(storeData);
    // };
    // updateStoreData();

    //get payment method
    getData(GETALLACTIVEPAYMENTS).then((result) => {
      if (result.data.result !== null) {
        setPaymentList(result.data);
      }
    });

    if (localStorage.getItem(saleType)) {
      let savedSale = JSON.parse(localStorage.getItem(saleType));
      setSavedDatas({
        ...savedSale,
        inital: false,
      });
    } else {
      setSavedDatas({ ...savedDatas, inital: false });
    }
  }, []);

  const submit = async (paymentType, payment_id) => {
    if (!disableSubmit) {
      setDisableSubmit(true);
      let amounts = await cartBalance(saleType);
      let payment =
        typeof paymentType === "number"
          ? [
              {
                amount: amounts.total,
                type: paymentType,
                payment_id: payment_id,
              },
            ]
          : paymentType;

      let cartInfo = {
        ...savedDatas,
        store_id: storeData.storeId,
        sale_type: type,
        paymentInfo: {
          payment: payment,
          total: amounts.total,
          subtotal: amounts.subTotal,
          tax: amounts.tax,
          discount: discount,
          net_amount: amounts.total - discount,
        },
      };
      
      if (localStorage.getItem('displayType') === 'led8') {
        ipcRenderer.send("write-amount", ["total", amounts.total - discount]);
      }

      if (cartInfo.cartItems.length < 1) {
        toaster.error(t("sales.cartisempty"));
        setDisableSubmit(false);
        return;
      }
      
      submitSales(saleType, cartInfo)
        .then((response) => {
          if (response.status) {
            toaster.success(t(response.message));
            localStorage.removeItem(saleType);
            setSavedDatas({ ...defaultValues, inital: false });

            genrateInvoiceData(response, saleType, storeData).then((resp) => {
              let printableData = generatePrintableData(resp);
              sendPosPrint(printableData);
            });
          } else {
            toaster.error(t(response.message));
          }
        })
        .catch((e) => {
          toaster.error(e);
        });
      setTimeout(() => {
        setDisableSubmit(false);
      }, 100);
    }
  };

  const closeCounter = () => {
    getData(CLOSEPOSCOUNTER).then((response) => {
      console.log(response);
    });
  };

  const suspendSale = async () => {
    let amounts = await cartBalance(saleType);
    let cartInfo = {
      ...savedDatas,
      store_id: storeData.storeId,
      sale_type: type,
      paymentInfo: {
        total: amounts.total,
        subtotal: amounts.subTotal,
        tax: amounts.tax,
      },
    };
    if (cartInfo.cartItems.length < 1) {
      toaster.error(t("sales.cartisempty"));
      return;
    }

    postData(SUSPENDSALE, cartInfo)
      .then((response) => {
        if (response.status) {
          toaster.success(t(response.message));
          localStorage.removeItem(saleType);
          setDiscount(0);
          setSavedDatas({ ...defaultValues, inital: false });
        } else {
          toaster.error(t(response.message));
        }
      })
      .catch((e) => {
        toaster.error(e);
      });
  };

  const openDrawer = () => {
    let printInfo = {
      printableData: [
        {
          type: "text",
          value: " .",
          style: { fontWeight: "500", fontSize: "14px" },
        },
      ],
      kitchenPrint: false,
      kitchenPrintData: null,
    };
    sendPosPrint(printInfo);
  };

  return (
    <SaleContext>
      <Stack>
        {/* <Breadcrumb
          labelHead={t(`sales.sales`)}
          labelSub={t(`sales.label_${label}`)}
        /> */}
        <ToastContainer />
        {/* <Button onClick={closeCounter}>CLOSE</Button>  */}
        <ProgressLoader open={disableSubmit} />
        {savedDatas && (
          <Grid
            container
            spacing={0.5}
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            p={0.5}
          >
            <Grid item md={8}>
              <Paper sx={{ p: 0.5, height: "90vh" }}>
                <CategorySelector
                  savedDatas={cachedSavedDatas}
                  setSavedDatas={setSavedDatas}
                  saleType={saleType}
                />
              </Paper>
            </Grid>

            <Grid item md={4}>
              <Paper sx={{ p: 0.5, height: "90vh" }}>
                <SelectCustomer
                  savedDatas={cachedSavedDatas}
                  setSavedDatas={setSavedDatas}
                />
                <Divider orientation="horizontal" sx={{ mt: 1, mb: 1 }} />
                <CartControll
                  savedDatas={cachedSavedDatas}
                  setSavedDatas={setSavedDatas}
                  saleType={saleType}
                />

                <Paper variant="outlined">
                  <SelectTable
                    savedDatas={cachedSavedDatas}
                    setSavedDatas={setSavedDatas}
                  />
                  <Divider sx={{ marginY: 0.2 }} />
                  <Grid
                    container
                    spacing={0.3}
                    justifyContent="center"
                    alignItems="center"
                  >
                    {paymentList &&
                      paymentList.map((payment, index) => {
                        return (
                          <Grid item md={4} xs={12} key={index}>
                            <Button
                              key={index}
                              variant="contained"
                              color={colorList(index)}
                              fullWidth
                              sx={{ height: "50px", p: 1 }}
                              ref={(el) => (paymentRef.current[index] = el)}
                              size="small"
                              disabled={savedDatas.cartItems.length < 1}
                              onClick={() =>
                                submit(payment.account_id, payment.payment_id)
                              }
                            >
                              {i18n.language === "en"
                                ? payment.payment_name_en
                                : payment.payment_name_ar}
                            </Button>
                          </Grid>
                        );
                      })}

                    <Grid item md={4} xs={12}>
                      <Button
                        variant="contained"
                        fullWidth
                        disabled={savedDatas.cartItems.length < 1}
                        size="small"
                        onClick={suspendSale}
                        sx={{ height: "50px", p: 1 }}
                      >
                        {t("sales.suspend")}
                      </Button>
                    </Grid>

                    <Grid item md={4} xs={12}>
                      <Button
                        variant="contained"
                        fullWidth
                        color="secondary"
                        size="small"
                        sx={{ height: "50px", p: 1 }}
                        disabled={savedDatas.cartItems.length < 1}
                        onClick={() => setSplitPay(true)}
                      >
                        {t("sales.split_payment")}
                      </Button>
                    </Grid>

                    <Grid item md={4} xs={12}>
                      <Button
                        variant="contained"
                        color="warning"
                        fullWidth
                        sx={{ height: "50px", p: 1 }}
                        size="small"
                        onClick={openDrawer}
                      >
                        {t("common.open_drawer")}
                      </Button>
                    </Grid>
                    <Grid item md={8} xs={12}>
                      <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        sx={{ height: "50px", p: 1 }}
                        size="small"
                        onClick={() => {
                          setConfirmation(t("common.are_u_sure"));
                        }}
                      >
                        {t("common.cancel")}
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Paper>
            </Grid>
          </Grid>
        )}

        <Splitpayment
          show={splitPay}
          handleClose={() => setSplitPay(false)}
          saleType={saleType}
          discount={discount}
          submitSale={submit}
        />

        {confirmation && (
          <ConfirmBox
            confirmation={confirmation}
            setConfirmation={setConfirmation}
            response={(a) => {
              setConfirmation(false);
              if (a) {
                setDiscount(0);
                setSavedDatas({ ...defaultValues, inital: false });
              }
            }}
          />
        )}
      </Stack>
    </SaleContext>
  );
}

export default React.memo(Sale);
