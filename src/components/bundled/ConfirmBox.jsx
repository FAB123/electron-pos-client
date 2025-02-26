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
import React, { memo, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

function ConfirmBox({ setConfirmation, confirmation, response }) {
  const submitRef = useRef();
  const { t } = useTranslation();
  const handleClose = () => {
    setConfirmation(null);
  };
  useEffect(() => {
    setTimeout(() => submitRef.current.focus(), 100);
  }, []);

  return (
    <Dialog
      onClose={handleClose}
      fullWidth={true}
      open={confirmation ? true : false}
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
        <Button
          variant="contained"
          color="error"
          onClick={() => response(false)}
        >
          {t("common.cancel")}
        </Button>
        <Button
          variant="contained"
          ref={submitRef}
          onClick={() => {
            response(true);
          }}
          autoFocus={true}
        >
          {t("common.yes")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default memo(ConfirmBox);
