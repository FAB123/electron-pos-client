import React, { useEffect, useCallback, useState } from "react";
// import "@fontsource/orbitron/800.css";
import {
  IconButton,
  Stack,
  Typography,
  Card,
  CardHeader,
  Divider,
  CardContent,
  Fab,
  styled,
} from "@mui/material";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import CampaignIcon from "@mui/icons-material/Campaign";
import ManualToken from "./ManualToken";
import MessageBox from "./MessageBox";
import axios from "axios";
import { BASECOUNTERDATA, getApiConfig } from "../../../constants/apiUrls";
import toaster from "../../../instence/toaster";

const GreenButton = styled(Fab)({
  width: 80,
  height: 80,
});

function Counter({
  name,
  count,
  increment,
  decrement,
  counter_id,
  resetCounter,
  getLastData,
  maxCount,
}) {
  const keydownListener = useCallback((keydownEvent) => {
    const { key, target, repeat } = keydownEvent;
    if (repeat) return;
    if (key === "Enter") {
      increment(counter_id);
    } else if (key === "Escape") {
      decrement(counter_id);
    }
  }, []);

  const [alert, setAlert] = useState(null);

  useEffect(() => {
    window.addEventListener("keydown", keydownListener, true);
    return () => window.removeEventListener("keydown", keydownListener, true);
  }, [keydownListener]);

  const [doUpdateToken, setDoUpdateToken] = useState(false);

  useEffect(() => {
    if (maxCount === count) {
      setAlert({
        text: "Maximum token reached, it will reset on next update.",
        type: "alert",
      });
    }
  }, [count]);

  const handleClose = () => {
    getLastData();
    setDoUpdateToken(false);
  };

  const recallCounter = async () => {
    try {
      const config = await getApiConfig();
      axios
        .post(
          BASECOUNTERDATA + "recall_token_display",
          {
            counter_id: counter_id,
          },
          config
        )
        .then((response) => console.log(response));
    } catch (error) {
      toaster.error(error.message || error);
    }
  };
  return (
    <Card>
      {alert && <MessageBox alert={alert} setAlert={setAlert} />}

      <CardHeader
        title={name}
        titleTypographyProps={{
          fontWeight: 600,
          color: "red",
        }}
        action={
          <>
            <IconButton onClick={recallCounter}>
              <CampaignIcon color="warning" />
            </IconButton>
            <IconButton onClick={() => setDoUpdateToken(counter_id)}>
              <EditCalendarIcon color="success" />
            </IconButton>
            <IconButton onClick={() => resetCounter(counter_id)}>
              <RotateLeftIcon color="error" />
            </IconButton>
          </>
        }
      />
      <Divider />

      <ManualToken
        open={doUpdateToken}
        handleClose={handleClose}
        url={BASECOUNTERDATA + "update_token_by_count"}
      />

      <CardContent>
        <Stack direction={"column"} alignItems={"center"} spacing={1}>
          <GreenButton color="warning" onClick={() => increment(counter_id)}>
            <ArrowBackIosIcon
              style={{
                transform: "rotate(90deg)",
                fontWeight: 800,
                fontSize: 40,
              }}
            />
          </GreenButton>

          <Typography
            fontWeight={800}
            fontSize={50}
            sx={{ fontFamily: "Orbitron", color: "#0f0" }}
          >
            {count ?? 0}
          </Typography>
          <GreenButton
            color="warning"
            onClick={() => decrement(counter_id)}
            disabled={count === 0}
          >
            <ArrowBackIosIcon
              style={{
                transform: "rotate(270deg)",
                fontWeight: 800,
                fontSize: 40,
              }}
            />
          </GreenButton>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default Counter;
