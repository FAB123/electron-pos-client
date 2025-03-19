import React, { useEffect, useRef } from "react";

import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import {
  Button,
  Divider,
  Stack,
  Typography,
  Grid,
  Paper,
  useTheme,
} from "@mui/material";
import ImageButton from "./ImageButton";
import basket from "../../../image/no-camera.png";
import { useTranslation } from "react-i18next";
import { IconButton } from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { useState } from "react";
import PosDialog from "../../controls/PosDialog";
import AdjustItemIcon from "./AdjustItemIcon";

function ItemButton({ items, selectedCatogory, addToCart, savedDatas }) {
  const itemList = useRef(null);
  const cart_total = useRef(0);
  const cart_qty = useRef(0);
  const { t } = useTranslation();
  const theme = useTheme();
  const handleScrollUp = () => {
    if (itemList.current) {
      itemList.current.scrollTop -= 100;
    }
  };

  //update interface
  useEffect(() => {
    if (savedDatas.cartItems) {
      let totalData = savedDatas.cartItems.reduce(
        function (accumulator, item) {
          var result = item.vatList.reduce((accu, e) => [...accu, e], []);
          var holder = accumulator.vatList;
          result.forEach(function (d) {
            if (holder.hasOwnProperty(d.percent)) {
              holder[d.percent] = holder[d.percent] + parseFloat(d.amount);
            } else {
              holder[d.percent] = parseFloat(d.amount);
            }
          });

          let discount;
          if (item.discount_type === "P") {
            let totalPrice =
              parseFloat(item.unit_price) * parseFloat(item.quantity);
            discount = (totalPrice / 100) * item.discount;
          } else {
            discount = item.discount;
          }

          return {
            quantity: accumulator.quantity + parseFloat(item.quantity),
            discount: accumulator.discount + parseFloat(discount),
            subTotal: accumulator.subTotal + parseFloat(item.subTotal),
            vat: accumulator.vat + parseFloat(item.vat),
            vatList: holder,
            total: accumulator.total + parseFloat(item.total),
          };
        },
        { quantity: 0, discount: 0, subTotal: 0, vat: 0, vatList: [], total: 0 }
      );

      cart_qty.current.innerText = totalData.quantity;

      // cart_subtotal.current.innerText = parseFloat(totalData.subTotal).toFixed(
      //   2
      // );
      // cart_vat.current.innerText = `${text}  ${t("common.total")}  : ${
      //   totalData.vat
      // } SR`;
      cart_total.current.innerText = parseFloat(totalData.total).toFixed(2);
    }
  }, [savedDatas]);

  const handleScrollDown = () => {
    if (itemList.current) {
      itemList.current.scrollTop += 100; // Adjust the scroll amount as desired
    }
  };

  const [iconSize, setIconSize] = useState(100);
  const [fontSize, setFontSize] = useState(13);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let savedIconSize = localStorage.getItem("iconSize");
    let savedFontSize = localStorage.getItem("fontSize");
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize));
    }
    if (savedIconSize) {
      setIconSize(parseInt(savedIconSize));
    }
  }, []);

  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      sx={{ width: "100%", height: "100%" }}
    >
      <PosDialog
        title={"Adjust Item Icon"}
        open={showSettings}
        setOpen={setShowSettings}
      >
        <AdjustItemIcon
          iconSize={iconSize}
          setIconSize={setIconSize}
          fontSize={fontSize}
          setFontSize={setFontSize}
        />
      </PosDialog>
      <Stack>
        <Paper>
          <Grid
            container
            spacing={2}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Grid item md={4}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={handleScrollUp}
              >
                <ArrowCircleUpIcon fontSize="large" />
              </Button>
            </Grid>
            <Grid item md={4}>
              <Stack
                // justifyContent={"center"}
                alignItems={"center"}
                width={"100%"}
                height={"100%"}
              >
                <Typography
                  variant="button"
                  sx={{ color: "red", fontSize: 20 }}
                  fontWeight={800}
                >
                  {selectedCatogory}
                </Typography>
              </Stack>
            </Grid>
            <Grid item md={4}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleScrollDown}
              >
                <ArrowCircleDownIcon fontSize="large" />
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Stack>
      <Stack
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        spacing={0.5}
        sx={{ flexGrow: 1 }}
      >
        <IconButton
          color="primary"
          size="small"
          onClick={() => setShowSettings(true)}
        >
          <AutoFixHighIcon fontSize="small" />
        </IconButton>
        <Divider />
        <Paper
          sx={{
            width: "100%",
            height: "100%",
            flexGrow: 1,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {items.length > 0 ? (
            <Stack
              direction="row"
              flexWrap="wrap"
              justifyContent={"left"}
              alignContent={"flex-start"}
              columnGap={1}
              ref={itemList}
              rowGap={1}
              sx={{
                height: "65vh",
                overflowY: "scroll",
              }}
            >
              {items.map((item, index) => {
                const pic = item.pic_filename
                  ? `${process.env.REACT_APP_API_URL}/storage/item_img/${item.pic_filename}`
                  : basket;
                return (
                  <ImageButton
                    item={item}
                    pic={pic}
                    key={index}
                    iconSize={iconSize}
                    fontSize={fontSize}
                    addToCart={addToCart}
                  />
                );
              })}
            </Stack>
          ) : (
            <Stack
              sx={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* <CircularProgress
                color="secondary"
                disableShrink={true}
                size={50}
              /> */}
              No Item Found.
            </Stack>
          )}
        </Paper>
        <Divider />
      </Stack>

      {/* <ImageList
        ref={itemList}
        sx={{
          width: "100%",
          height: "100%",
          alignContent: "flex-start",

          overflowY: "scroll",
        }}
        cols={7}
        rowHeight={168}
        variant="quilted"
      ></ImageList> */}

      <Stack sx={{ bottom: 0 }}>
        <Grid item md={12}>
          <Paper
            sx={{ paddingX: 1, backgroundColor: theme.palette.primary.main }}
          >
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Stack direction={"row"} alignItems="center" spacing={2}>
                <Typography
                  variant="button"
                  fontWeight={800}
                  sx={{ color: "#fff", fontFamily: "Seven Segment" }}
                  fontSize={20}
                  align="right"
                >
                  {t("sales.quantity")} :
                </Typography>
                <Typography
                  fontSize={30}
                  variant="button"
                  sx={{ color: "#fff", fontFamily: "Seven Segment" }}
                  fontWeight={800}
                  align="right"
                  ref={cart_qty}
                >
                  0
                </Typography>
              </Stack>
              <Stack direction={"row"} alignItems="center" spacing={2}>
                <Typography
                  fontSize={20}
                  variant="button"
                  fontWeight={800}
                  sx={{ color: "#fff", fontFamily: "Seven Segment" }}
                  align="right"
                >
                  {t("common.total")} :
                </Typography>
                <Typography
                  fontSize={30}
                  variant="button"
                  fontWeight={800}
                  align="right"
                  sx={{ color: "#fff", fontFamily: "Seven Segment" }}
                  ref={cart_total}
                  color="error"
                >
                  0
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Stack>
    </Stack>
  );
}

export default ItemButton;
