import React, { useState } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Stack,
  Divider,
} from "@mui/material";
import { PurpleButton } from "../../util/Theming";
import { numberVarients } from "../../../constants/constants";
import Slide from "@mui/material/Slide";
import { pink } from "@mui/material/colors";
import { useTranslation } from "react-i18next";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function UpdatePrice(props) {
  const { data, handleClose, updateItemPrice } = props;

  const [amount, setamount] = useState(data.amount || 0);
  const { t } = useTranslation();

  return (
    <Dialog
      open={data ? true : false}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogContent>
        <Stack justifyContent={"center"} alignItems={"center"} mb={1}>
          <span
            style={{
              width: "80%",
              color: pink[600],
              fontSize: "2rem",
              fontWeight: 700,
              border: "2mm ridge rgba(255, 255, 255, .6)",
            }}
          >
            {amount}
          </span>
        </Stack>
        <Divider />
        <Stack
          direction="row"
          flexWrap="wrap"
          justifyContent={"center"}
          alignItems={"center"}
        >
          {numberVarients.map((type, index) => {
            return (
              <PurpleButton
                size="large"
                key={index}
                variant="outlined"
                style={{ fontSize: "30px", fontWeight: 800 }}
                // style={{
                //   flex: `0 0 calc(100% / 3 - ${2 * 8}px)`,
                //   boxSizing: "border-box",
                //   fontSize: "30px",
                //   fontWeight: 800,
                // }}
                onClick={() => {
                  if (type.value === "clr") {
                    setamount(0);
                  } else if (type.value === "bck") {
                    if (amount.length === 1) {
                      setamount(0);
                    } else {
                      setamount(amount.slice(0, -1));
                    }
                  } else {
                    setamount(amount !== 0 ? amount + type.value : type.value);
                  }
                }}
                sx={{ m: 1, width: 100, height: 75 }}
              >
                {type.label}
              </PurpleButton>
            );
          })}
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Stack
          justifyContent={"space-between"}
          direction={"row"}
          width={"100%"}
        >
          <Button variant="contained" color="error" onClick={handleClose}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={() => updateItemPrice(data.item, amount)}
          >
            {t("common.update")}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default UpdatePrice;
