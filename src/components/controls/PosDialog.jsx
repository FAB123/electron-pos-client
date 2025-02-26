import React, { forwardRef } from "react";
import { PurpleButton } from "../util/Theming";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Slide,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PosDialog({ title, children, open, setOpen }) {
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      fullWidth={true}
      onClose={() => setOpen(false)}
      maxWidth="xs"
    >
      <DialogTitle>{title}</DialogTitle>
      <Divider />
      <DialogContent>{children}</DialogContent>
      <Divider />

      <DialogActions>
        <PurpleButton
          sx={{ mx: "auto", mt: 2, width: "25%" }}
          onClick={() => setOpen(false)}
        >
          {t("common.cancel")}
        </PurpleButton>
      </DialogActions>
    </Dialog>
  );
}

export default PosDialog;
