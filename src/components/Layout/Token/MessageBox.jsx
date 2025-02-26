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
import React from "react";

function MessageBox({ alert, setAlert }) {
  const handleClose = () => {
    setAlert(null);
  };

  return (
    <Dialog open={!!alert} maxWidth={"md"} onClose={handleClose}>
      <DialogTitle>
        {alert.type === "confirm" ? "CONFIRM" : "ALERT"}
      </DialogTitle>
      <Divider />

      <DialogContent>
        <Stack alignItems={"center"} spacing={2}>
          <Typography variant="caption" sx={{ fontSize: 20 }}>
            {alert.text}
          </Typography>
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions>
        {alert.type === "confirm" && (
          <Button
            color="error"
            sx={{ fontWeight: 800 }}
            variant="contained"
            onClick={alert.confirmAction}
          >
            YES
          </Button>
        )}
        <Button
          color="warning"
          sx={{ fontWeight: 800 }}
          variant="contained"
          onClick={handleClose}
        >
          {alert.type === "confirm" ? "NO" : "OK"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MessageBox;
