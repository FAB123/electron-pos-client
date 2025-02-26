import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";

function AlertBox({ setConfirmation, confirmation }) {
  const { t } = useTranslation();
  const handleClose = () => {
    setConfirmation(null);
  };

  return (
    <Dialog
      onClose={handleClose}
      open={confirmation ? true : false}
      components={"paper"}
      fullWidth={true}
    >
      <DialogTitle color="error">Message</DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={2} direction={"column"}>
          <Typography variant="button">{confirmation}</Typography>
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button variant="contained" onClick={handleClose}>
          {t("common.okay")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default memo(AlertBox);
