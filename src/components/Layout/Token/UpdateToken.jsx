import React, { useEffect, useState } from "react";
import Counter from "./Counter";
import { Stack, Typography, Card } from "@mui/material";
import MessageBox from "./MessageBox";
import axios from "axios";
import { BASECOUNTERDATA, getApiConfig } from "../../../constants/apiUrls";
import toaster from "../../../instence/toaster";
const selectedCounter = atob(localStorage.getItem("tokenCounterID") || "");

function UpdateToken() {
  const [counters, setCounters] = useState([]);
  const [alert, setAlert] = useState(null);
  const [authenticated, setAuthnticated] = useState(false);

  const apiRequest = async (url, method, data = {}) => {
    try {
      const config = await getApiConfig();
      if (method === "get") {
        var response = await axios.get(url, config);
      } else {
        var response = await axios.post(url, data, config);
      }
      setAuthnticated(true);
      setCounters(response.data.data || response.data.counter);
    } catch (error) {
      setAuthnticated(false);
      toaster.error(error.message || error);
    }
  };

  const increment = (counter) => {
    apiRequest(`${BASECOUNTERDATA}update_token_display`, "post", { counter });
  };

  const decrement = (counter) => {
    apiRequest(`${BASECOUNTERDATA}decrement_token_display`, "post", {
      counter,
    });
  };

  const resetCounter = (counter) => {
    setAlert({
      text: "Are you sure you want to reset the token?",
      type: "confirm",
      confirmAction: () =>
        apiRequest(`${BASECOUNTERDATA}reset_token`, "post", { counter }).then(
          () => setAlert(null)
        ),
    });
  };

  const getLastData = async () => {
    apiRequest(`${BASECOUNTERDATA}get-all-couter-data`, "get");
  };

  useEffect(() => {
    getLastData();
  }, []);

  return (
    <Stack height={"80vh"} justifyContent={"center"}>
      {alert && <MessageBox alert={alert} setAlert={setAlert} />}

      {authenticated ? (
        counters.map(
          (counter) =>
            counter.id == selectedCounter && (
              <Counter
                key={counter.id} // Add key prop
                name={counter.title}
                increment={increment}
                decrement={decrement}
                resetCounter={resetCounter}
                getLastData={getLastData}
                count={counter.count}
                maxCount={counter.max_count}
                counter_id={counter.encrypted_counter}
              />
            )
        )
      ) : (
        <Card sx={{ padding: 1 }}>
          <Typography variant="h5" color={"error"}>
            AUTHENTICATION ERROR
          </Typography>
        </Card>
      )}
    </Stack>
  );
}

export default UpdateToken;
