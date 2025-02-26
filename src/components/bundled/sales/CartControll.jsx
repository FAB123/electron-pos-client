import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Autocomplete,
  Stack,
  TextField,
  TableHead,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  Paper,
  TableBody,
  Typography,
  Fab,
  Button,
} from "@mui/material";

import FunctionsRoundedIcon from "@mui/icons-material/FunctionsRounded";

import { useTranslation } from "react-i18next";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import { getData } from "../../../apis/apiCalls";
import { calculateItemDetails } from "../../../helpers/TaxHelper";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import BarcodeIcon from "./BarcodeIcon";

import ReportViewer from "../../../pages/sales/ReportViewer";
import {
  GETITEMBYBARCODEORID,
  SEARCHSALEITEMLIST,
} from "../../../constants/apiUrls";

import { useRef } from "react";

import { PosTooltip } from "../../util/Theming";
import SearchIcon from "@mui/icons-material/Search";
import FindSales from "./FindSales";
import PosDrawer from "../../controls/PosDrawer";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import UpdatePrice from "./UpdatePrice";
import ClosingView from "./ClosingView";
import { posContext } from "../../../stores/AppContext";

function CartControll({ savedDatas, setSavedDatas, saleType }) {
  const { t } = useTranslation();

  const { ipcRenderer } = window.require("electron");
  const { storeData } = useContext(posContext);

  const [updatePrice, setUpdatePrice] = useState(false);
  const [closingView, setClosingView] = useState(false);

  const [scanType, setScanType] = useState(true);
  const [itemList, setItemList] = useState([]);
  const [query, setQuery] = useState("");
  const [openReport, setOpenReport] = useState(false);

  const [findSales, setFindSales] = useState(false);

  const itemRef = useRef();

  const addToCart = async (item) => {
   
    if (localStorage.getItem('displayType') === 'led8') {
      ipcRenderer.send("write-amount", ["price", item.unit_price]);
    }

    let foundinCart = savedDatas.cartItems.findIndex(
      (x) => x.item_id === item.item_id
    );

    if (foundinCart !== -1) {
      let olditems = savedDatas.cartItems[foundinCart];

      let new_quantity = parseFloat(olditems["quantity"]) + 1;
      let new_unit_price = olditems.unit_price;
      let new_discount = olditems.discount;
      let new_discount_type = olditems.discount_type;

      let calculatedData = await calculateItemDetails(
        new_unit_price,
        new_quantity,
        new_discount,
        new_discount_type,
        olditems.vatList,
        storeData.configuration_data.include_tax
      );

      olditems["quantity"] = new_quantity;
      olditems["vatList"] = calculatedData.vatDetails.taxDetails;
      olditems[
        "vat"
      ] = `${calculatedData.vatDetails.totalVatAmount} [${calculatedData.vatDetails.totalVatPercent}%]`;
      olditems["subTotal"] = calculatedData.total.calculatedSubTotal;
      olditems["total"] = calculatedData.total.calculatedTotal;

      setSavedDatas({
        ...savedDatas,
        cartItems: [
          ...savedDatas.cartItems.slice(0, foundinCart),
          olditems,
          ...savedDatas.cartItems.slice(foundinCart + 1),
        ],
      });
    } else {
      var unit_price;
      if (savedDatas.customerInfo) {
        let customer = savedDatas.customerInfo;
        unit_price =
          customer.customer_type === 1 ? item.wholesale_price : item.unit_price;
      } else {
        unit_price = item.unit_price;
      }

      let calculatedData = await calculateItemDetails(
        unit_price,
        1,
        0,
        "C",
        item.vat_list,
        storeData.configuration_data.include_tax
      );

      var obj = {
        item_name: item.item_name,
        item_name_ar: item.item_name_ar,
        item_id: item.item_id,
        unit_price: unit_price,
        quantity: 1,
        discount: 0,
        discount_type: "C",
        unit: item.item_unit.label,
        subTotal: calculatedData.total.calculatedSubTotal,
        vatList: calculatedData.vatDetails.taxDetails,
        vat: `${calculatedData.vatDetails.totalVatAmount} [${calculatedData.vatDetails.totalVatPercent}%]`,
        total: calculatedData.total.calculatedTotal,
        vatPercentage: calculatedData.vatDetails.totalVatPercent,
        allowdesc: item.allowdesc,
        is_serialized: item.is_serialized,
        minimum_price: item.minimum_price,
        cost_price: item.cost_price,
        originalprice: item.price,
        stock: item.item_quantity,
        stock_type: item.stock_type,
        is_boxed: item.is_boxed,
      };

      setSavedDatas({
        ...savedDatas,
        cartItems: [...savedDatas.cartItems, obj],
      });

      itemRef.current.focus();
    }
  };

  const deleteCart = (item_id) => {
    let foundinCart = savedDatas.cartItems.findIndex(
      (x) => x.item_id === item_id
    );
    setSavedDatas({
      ...savedDatas,
      cartItems: [
        ...savedDatas.cartItems.slice(0, foundinCart),
        ...savedDatas.cartItems.slice(foundinCart + 1),
      ],
    });
  };

  const updateCartItem = async (index, updatedFields = {}) => {
    let oldItem = { ...savedDatas.cartItems[index] }; // Avoid direct mutation
    const { discount, vatList, discount_type } = oldItem;

    // Merge updated fields (e.g., unit_price or quantity) into oldItem
    oldItem = { ...oldItem, ...updatedFields };

    let calculatedData = await calculateItemDetails(
      oldItem.unit_price,
      oldItem.quantity,
      discount,
      discount_type,
      vatList,
      storeData.configuration_data.include_tax
    );

    oldItem.vatList = calculatedData.vatDetails.taxDetails;
    oldItem.vat = `${calculatedData.vatDetails.totalVatAmount} [${calculatedData.vatDetails.totalVatPercent}%]`;
    oldItem.subTotal = calculatedData.total.calculatedSubTotal;
    oldItem.total = calculatedData.total.calculatedTotal;

    setSavedDatas((prev) => ({
      ...prev,
      cartItems: [
        ...prev.cartItems.slice(0, index),
        oldItem,
        ...prev.cartItems.slice(index + 1),
      ],
    }));
  };

  const editCart = async (index, type) => {
    const oldItem = savedDatas.cartItems[index];
    const quantity = type === "P" ? oldItem.quantity + 1 : oldItem.quantity - 1;
    await updateCartItem(index, { quantity });
  };

  const updateItemPrice = useCallback(
    async (index, price) => {
      const unit_price = parseFloat(price);
      await updateCartItem(index, { unit_price });
      setUpdatePrice(false);
    },
    [savedDatas.cartItems, setUpdatePrice]
  );

  useEffect(() => {
    setTimeout(() => {
      if (scanType) {
        itemRef.current.focus();
      }
    }, 10);
  }, []);

  return (
    <>
      <PosDrawer open={openReport} setOpen={setOpenReport}>
        <ReportViewer saleType={saleType} setOpenReport={setOpenReport} />
      </PosDrawer>

      {updatePrice && (
        <UpdatePrice
          data={updatePrice}
          handleClose={() => setUpdatePrice(false)}
          updateItemPrice={updateItemPrice}
        />
      )}
      {closingView && (
        <PosDrawer open={closingView} setOpen={setClosingView}>
          <ClosingView />
        </PosDrawer>
      )}

      <Stack
        direction="row"
        sx={{ mt: 1 }}
        spacing={1}
        justifyContent="space-between"
        alignItems="center"
      >
        <Button
          size="small"
          color="secondary"
          onClick={() => setScanType(!scanType)}
        >
          {scanType ? <BarcodeIcon /> : <BorderColorIcon />}
        </Button>
        <Autocomplete
          freeSolo
          fullWidth
          inputValue={query}
          clearOnEscape={true}
          options={itemList}
          getOptionLabel={(option) => {
            let stock =
              option.stock_type === 1
                ? ` / ${t("sales.available_stock")}: ${option.quantity}`
                : "";
            return `${option.category} / ${option.item_name} [${option.item_name_ar}] ${stock}`;
          }}
          onChange={(event, value) => {
            setQuery("");
            setItemList([]);
            if (value.item_id) {
              addToCart(value);
            }
          }}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                size="small"
                label={t("sales.start_scaning")}
                inputRef={itemRef}
                onChange={(e) => {
                  let searchItem = e.target.value;
                  if (searchItem !== "" || searchItem !== null) {
                    setQuery(searchItem);
                  }
                  if (!scanType) {
                    if (searchItem.length > 2) {
                      getData(`${SEARCHSALEITEMLIST}${searchItem}/1`).then(
                        (data) => {
                          setItemList(data.data);
                        }
                      );
                    } else {
                      setItemList([]);
                    }
                  }
                }}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    if (scanType) {
                      getData(`${GETITEMBYBARCODEORID}/${query}/1`).then(
                        (result) => {
                          if (result.data) {
                            addToCart(result.data);
                            setQuery("");
                          }
                        }
                      );
                    }
                  }
                }}
              />
            );
          }}
        />

        <PosTooltip title={t("tooltip.view_invoice")}>
          <IconButton
            color="warning"
            size="small"
            onClick={() => {
              setOpenReport(true);
            }}
          >
            <ReceiptLongRoundedIcon />
          </IconButton>
        </PosTooltip>

        <PosTooltip title={t("tooltip.view_closing")}>
          <IconButton
            color="secondary"
            size="small"
            onClick={() => {
              setClosingView(true);
            }}
          >
            <FunctionsRoundedIcon />
          </IconButton>
        </PosTooltip>

        {saleType === "CASHSALERETURN" && (
          <PosTooltip title={t("tooltip.restore_previus_sale")}>
            <IconButton
              color="warning"
              size="small"
              aria-label="add"
              onClick={() => {
                setFindSales(!findSales);
              }}
            >
              <SearchIcon />
            </IconButton>
          </PosTooltip>
        )}
      </Stack>
      {findSales && (
        <FindSales
          saleType={saleType}
          setSavedDatas={setSavedDatas}
          setFindSales={setFindSales}
        />
      )}
      <Stack direction="row" spacing={2}>
        <TableContainer
          component={Paper}
          sx={{
            mt: 1,
            maxHeight: "48.5vh",
            minHeight: "48.5vh",
            maxWidth: "100%",
            overflowX: "",
          }}
        >
          <Table
            sx={{
              Width: "100%",
              backgroundColor:
                saleType === "CASHSALERETURN" ? "#fcd7c7" : "#fff",
            }}
            stickyHeader
            size="small"
          >
            <TableHead>
              <TableRow>
                <TableCell align="right"></TableCell>
                <TableCell align="left">{t("common.item")}</TableCell>
                <TableCell align="center">{t("common.price")}</TableCell>
                <TableCell align="center">{t("common.quantity")}</TableCell>
                <TableCell align="center">{t("common.total")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {savedDatas &&
                savedDatas.cartItems
                  .slice(0)
                  .reverse()
                  .map((item, index) => {
                    return (
                      <React.Fragment key={index}>
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                            // height: 50,
                          }}
                        >
                          <TableCell component="th" scope="row" align="left">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => {
                                deleteCart(item.item_id);
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            align="left"
                            sx={{ p: 0, m: 0, width: "50%" }}
                          >
                            <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                              {item.item_name}
                              {item.item_name_ar && ` - ${item.item_name_ar}`}
                            </Typography>
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ p: 0, m: 0, width: "20%" }}
                          >
                            {/* <Typography
                                variant="button"
                                sx={{ fontSize: 12, fontWeight: 700 }}
                              >
                                {item.unit_price}
                              </Typography> */}

                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() =>
                                setUpdatePrice({
                                  item: savedDatas.cartItems.length - 1 - index,
                                  amount: item.unit_price,
                                })
                              }
                            >
                              {item.unit_price.toFixed(2)}
                            </Button>
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ p: 0, m: 0, width: "50%" }}
                          >
                            <Stack
                              direction={"row"}
                              justifyContent={"center"}
                              alignItems={"center"}
                              spacing={0.5}
                            >
                              <IconButton
                                size="small"
                                disabled={item.quantity === 1 ? true : false}
                                onClick={(e) => {
                                  editCart(
                                    savedDatas.cartItems.length - 1 - index,
                                    "M"
                                  );
                                }}
                              >
                                <RemoveCircleOutlineIcon color="primary" />
                              </IconButton>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {item.quantity}
                              </Typography>

                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  editCart(
                                    savedDatas.cartItems.length - 1 - index,
                                    "P"
                                  );
                                }}
                              >
                                <AddCircleOutlineIcon color="success" />
                              </IconButton>
                            </Stack>
                          </TableCell>

                          <TableCell align="center">
                            <Typography
                              variant="button"
                              sx={{ fontSize: 12, fontWeight: 700 }}
                            >
                              {item.total}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </>
  );
}

export default React.memo(CartControll);
