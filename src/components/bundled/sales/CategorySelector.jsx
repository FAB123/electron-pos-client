import React, { useContext, useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import { Grid, Stack } from "@mui/material";
import { CategoryButton } from "../../util/Theming";
import {
  GETALLITEMBYCATEGORY,
  GETALLITEMCATEGORY,
} from "../../../constants/apiUrls";
import { getData } from "../../../apis/apiCalls";
import ItemButton from "./ItemButton";
import { calculateItemDetails } from "../../../helpers/TaxHelper";
import toaster from "../../../instence/toaster";
import { useTranslation } from "react-i18next";
import { posContext } from "../../../stores/AppContext";

function CategorySelector({ savedDatas, setSavedDatas }) {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCatogory, setSelectedCatogory] = useState("");
  const { t } = useTranslation();
  const [selected, setSelected] = useState(0);
  const { storeData } = useContext(posContext);

  const { ipcRenderer } = window.require("electron");

  useEffect(() => {
    getData(GETALLITEMCATEGORY).then((data) => {
      setCategories(data.data);
      if (data.data.length > 0) {
        getData(`${GETALLITEMBYCATEGORY}/${data.data[0].category}`).then(
          (data) => {
            setItems(data.data);
          }
        );
      }
    });
  }, []);

  const listItems = (category) => {
    setSelectedCatogory(category);
    setItems([]);
    getData(`${GETALLITEMBYCATEGORY}/${category}`).then((data) => {
      setItems(data.data);
    });
  };

  const addToCart = async (item) => {
    if (storeData.appdata["display-type"].toString() !== "0") {
      ipcRenderer.send("write-amount", ["price", item.unit_price]);
    }
    //confirm-dialog
    var forceUpdate = false;

    let foundinCart = savedDatas.cartItems.findIndex(
      (x) => x.item_id === item.item_id
    );

    if (foundinCart !== -1) {
      // let confirm = await ipcRenderer.invoke("confirm-dialog");
      forceUpdate = true; //confirm === 0 ? false :
    }

    forceUpdate = false;

    if (forceUpdate) {
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

      if (item.item_quantity < item.reorder_level) {
        toaster.warning(t("items.current_qty_less"));
      }

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
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
        height: "100%",
      }}
    >
      <Stack spacing={2} direction="column">
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={selected}
          scrollButtons={true}
          TabScrollButtonProps={{
            sx: {
              color: "white",
              height: "50px",
              backgroundColor: "primary", //purple[500],
              borderRadius: "8px",
            },
          }}
          sx={{
            borderRight: 1,
            borderColor: "divider",
            padding: 0.2,
            height: "100%",
          }}
        >
          {categories.map((category, index) => (
            <CategoryButton
              key={index}
              value={index}
              variant="contained"
              onClick={() => {
                listItems(category.category);
                setSelected(index);
              }}
            >
              {category.category}
            </CategoryButton>
          ))}
        </Tabs>
      </Stack>

      <Grid container sx={{ ml: 1 }}>
        <Grid item xs={12}>
          <ItemButton
            items={items}
            selectedCatogory={selectedCatogory}
            addToCart={addToCart}
            savedDatas={savedDatas}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default React.memo(CategorySelector);
