import {
  Button,
  Card,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getData, postData } from "../apis/apiCalls";
import {
  ACTIVATETOKEN,
  BASECOUNTERDATA,
  RESETTOKEN,
  SETTOKEN,
  TOKENINFORMATION,
} from "../constants/apiUrls";
import toaster from "../instence/toaster";
import { ToastContainer } from "react-toastify";
import ConfirmBox from "../components/bundled/ConfirmBox";
import axios from "axios";
import KitchenPrinter from "./AppSetup/KitchenPrinter";
import CustomerDisplay from "./AppSetup/CustomerDisplay";
import { posContext } from "../stores/AppContext";
import AppColor from "./AppSetup/AppColor";

function AppSetup() {
  const [savedToken, setSavedToken] = useState(1);
  const [enabled, setEnabled] = useState(false);
  const [selectedCounter, setSelectedCounter] = useState("");
  const [tokenType, setTokenType] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [counters, setCounters] = useState([]);

  // const [portList, setPortList] = useState([]);

  // const [alertMessage, setAlertMessage] = useState(null);

  // const [port, setPort] = useState(null);
  // const [printer, setPrinter] = useState(null);

  // const listPort = useCallback(() => {
  //   ipcRenderer.invoke("get-serial-ports").then((response) => {
  //     if (response.status) {
  //       setPortList(response.data);
  //       let list = response.data.map((item) => ({
  //         item: `${item.path}  ${item.manufacturer || ""}`,
  //         value: item.path,
  //       }));
  //       setPortList(list);
  //       setPort(list[0].value);
  //     } else {
  //       setAlertMessage({
  //         message: response.message,
  //         severity: "success",
  //         alert: true,
  //         onSubmit: () => {
  //           setAlertMessage(null);
  //         },
  //       });
  //     }
  //   });
  // }, []);

  const [loginButon, setLoginButton] = useState(true);
  const [token, setToken] = useState(1);
  const [confirmationReset, setConfirmationReset] = useState(null);
  const { t } = useTranslation();

  const updateStatus = (data) => {
    if (data.enabled) {
      setEnabled(true);
      setSavedToken(data.currentToken);
      setToken(data.currentToken);
    } else {
      setEnabled(false);
    }
  };

  const changeTokenType = () => {
    localStorage.setItem("tokenType", !tokenType);
    setTokenType(!tokenType);
  };

  const submitCounter = () => {
    if (!loginButon) {
      localStorage.removeItem("tokenApiToken");
      localStorage.setItem("tokenType", false);
      setLoginButton(true);
      setTokenType(false);
      toaster.success("Logout Successfully");
      return true;
    }
    if (email === "" && password === "") {
      toaster.error("login.setunam_pwd");
    } else {
      axios
        .post(BASECOUNTERDATA + "login", { email, password })
        .then((response) => {
          if (response.data.auth) {
            localStorage.setItem("tokenPassword", password);
            localStorage.setItem("tokenEmail", email);
            localStorage.setItem("tokenShopID", response.data.shop_id);
            localStorage.setItem("tokenApiToken", response.data.token);
            toaster.success("Token Credentials Updated.");
            setLoginButton(false);

            axios
              .get(BASECOUNTERDATA + "get-all-couter-data", {
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Max-Age": 7200,
                  Accept: "application/json",
                  Authorization: "Bearer " + response.data.token,
                },
              })
              .then((response) => {
                if (response.data.status) {
                  if (response.data.counter.length > 0) {
                    setCounters(response.data.counter);

                    localStorage.setItem(
                      "tokenEncryptedCounterID",
                      response.data.counter[0].encrypted_counter
                    );
                    localStorage.setItem(
                      "tokenCounterID",
                      btoa(response.data.counter[0].id)
                    );
                  }
                }
              });
          }
        });
    }

    // toaster.success("Token Credentials Updated.");
    // localStorage.setItem("tokenPassword", password);
    // localStorage.setItem("tokenEmail", email);
  };

  useEffect(() => {
    let tokenType = localStorage.getItem("tokenType");

    let tokenEmail = localStorage.getItem("tokenEmail");
    let tokenPassword = localStorage.getItem("tokenPassword");
    let tokenApi = localStorage.getItem("tokenApiToken") || null;

    setTokenType(tokenType === "true" ? true : false);

    if (tokenEmail) {
      setEmail(tokenEmail);
    }

    setLoginButton(tokenApi ? false : true);

    if (tokenPassword) {
      setPassword(tokenPassword);
    }

    getData(TOKENINFORMATION)
      .then((response) => {
        if (!response.error) {
          updateStatus(response.data);
        }
      })
      .catch((e) => toaster.error(t(e.message)));
  }, []);

  const selectCounter = (counter) => {
    if (!counter) {
      toaster.error("Counter not found.");
    } else {
      localStorage.setItem(
        "tokenEncryptedCounterID",
        counter.encrypted_counter
      );
      localStorage.setItem("tokenCounterID", btoa(counter.id));

      setSelectedCounter(counter.encrypted_counter);
    }
  };

  const activateToken = useCallback(() => {
    getData(ACTIVATETOKEN)
      .then((response) => {
        if (response.error) {
          toaster.error(t(response.message));
        } else {
          toaster.success(t(response.message));
          updateStatus(response.data);
        }
      })
      .catch((e) => toaster.error(t(e.message)));
  }, []);

  const updateToken = useCallback(() => {
    postData(SETTOKEN, { token: token })
      .then((response) => {
        if (response.error) {
          toaster.error(t(response.message));
        } else {
          toaster.success(t(response.message));
          updateStatus(response.data);
        }
      })
      .catch((e) => toaster.error(t(e.message)));
  }, [token]);

  const resetToken = useCallback(() => {
    getData(RESETTOKEN)
      .then((response) => {
        if (response.error) {
          toaster.error(t(response.message));
        } else {
          toaster.success(t(response.message));
          updateStatus(response.data);
        }
      })
      .catch((e) => toaster.error(t(e.message)));
  }, []);

  // const savePortConfiguaration = () => {
  //   localStorage.setItem("port", port);
  //   // localStorage.setItem("printer", printer);
  // };



  const { setNavigation } = useContext(posContext);

  setNavigation(t("modules.app_setup"));

  return (
    <Stack>
      {/* <Breadcrumb
        labelHead={t("modules.app_setup")}
        labelSub="Client App Setup"
      /> */}
      <ToastContainer />

      {confirmationReset && (
        <ConfirmBox
          confirmation={confirmationReset}
          setConfirmation={setConfirmationReset}
          response={(a) => {
            if (a) {
              resetToken();
            }
            setConfirmationReset(false);
          }}
        />
      )}

      <Grid
        container
        p={1}
        spacing={2}
        justifyContent={"center"}
        // alignItems={"center"}
        sx={{ height: "100%" }}
      >
        <Grid item md={5}>
          <Paper elevation={24} sx={{ p: 2 }}>
            <Typography variant="h5">Current Token {savedToken}</Typography>
            <Divider />
            <Card sx={{ padding: 2 }}>
              <Stack spacing={2} direction={"column"}>
                <TextField
                  label="Token"
                  value={token}
                  type="number"
                  disabled={!enabled}
                  size="small"
                  onChange={(e) => setToken(e.target.value)}
                />
                <Stack direction={"row"} spacing={1}>
                  <Button
                    variant="contained"
                    color="success"
                    disabled={!enabled}
                    onClick={updateToken}
                  >
                    SET NEXT TOKEN
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!enabled}
                    color="error"
                    onClick={() => setConfirmationReset("Are You Sure?")}
                  >
                    RESET TOKEN
                  </Button>
                </Stack>

                <Button
                  variant="contained"
                  color={enabled ? "error" : "primary"}
                  onClick={activateToken}
                >
                  {enabled ? "DISABLE TOKEN" : "ENABLE TOKEN"}
                </Button>

                <Divider />
                <KitchenPrinter />
                <Divider />
                <CustomerDisplay />
                <Divider />
                <AppColor />
   
              </Stack>
            </Card>
          </Paper>
        </Grid>
        <Grid item xs={5}>
          <Paper elevation={24} sx={{ p: 2 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Typography>USE LOCAL TOKEN</Typography>
              <Switch
                checked={tokenType}
                onChange={changeTokenType}
                inputProps={{ "aria-label": "controlled" }}
              />
              <Typography>USE ONLINE TOKEN</Typography>
            </Stack>

            {tokenType && (
              <Card>
                <Stack spacing={1} p={1}>
                  <Typography variant="body2">
                    Set Online Credentials
                  </Typography>
                  <Divider />
                  <TextField
                    label="EMAIL"
                    value={email}
                    disabled={!tokenType}
                    size="small"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <TextField
                    label="PASSWORD"
                    value={password}
                    disabled={!tokenType}
                    type="password"
                    size="small"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Stack direction={"row"} spacing={1}>
                    <Button
                      variant="contained"
                      disabled={!tokenType}
                      color="error"
                      onClick={submitCounter}
                    >
                      {loginButon ? "LOGIN" : "LOGOUT"}
                    </Button>
                  </Stack>
                </Stack>
                <Card title="SELECT DEFAULT COUNTER" sx={{ padding: 1 }}>
                  <FormGroup>
                    {counters.map((counter, i) => (
                      <FormControlLabel
                        key={i}
                        control={
                          <Checkbox
                            color="secondary"
                            checked={
                              counter.encrypted_counter === selectedCounter
                            }
                            onClick={() => selectCounter(counter)}
                          />
                        }
                        label={counter.title}
                      />
                    ))}
                  </FormGroup>
                </Card>
              </Card>
            )}
          </Paper>
        </Grid>
        {/* <Grid item xs={4}>
          <Paper elevation={24} sx={{ p: 2 }}>
              <Card>
                <Stack spacing={1} p={1}>
                  <Typography variant="body2">
                    Receipt Settings
                  </Typography>
                  <Divider />
                  <TextField
                    label="EMAIL"
                    value={email}
                    disabled={!tokenType}
                    size="small"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <TextField
                    label="PASSWORD"
                    value={password}
                    disabled={!tokenType}
                    type="password"
                    size="small"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Stack direction={"row"} spacing={1}>
                    <Button
                      variant="contained"
                      disabled={!tokenType}
                      color="error"
                      onClick={submitCounter}
                    >
                      {loginButon ? "LOGIN" : "LOGOUT"}
                    </Button>
                  </Stack>
                </Stack>
                <Card title="SELECT DEFAULT COUNTER" sx={{ padding: 1 }}>
                  <FormGroup>
                    {counters.map((counter, i) => (
                      <FormControlLabel
                        key={i}
                        control={
                          <Checkbox
                            color="secondary"
                            checked={
                              counter.encrypted_counter === selectedCounter
                            }
                            onClick={() => selectCounter(counter)}
                          />
                        }
                        label={counter.title}
                      />
                    ))}
                  </FormGroup>
                </Card>
              </Card>
          </Paper>
        </Grid> */}
        {/* <Grid item md={4}>
          <Paper elevation={24} sx={{ p: 2 }}>
            <Typography variant="body2">Current Token {savedToken}</Typography>
            <Divider />
            <Card>
              <Stack
                justifyContent={"center"}
                alignItems={"center"}
                spacing={2}
                padding={3}
              >
                <FormControl>
                  <InputLabel id="select-port">Select Port</InputLabel>
                  <Select
                    onChange={(e) => setPort(e.target.value)}
                    value={port}
                    labelId="select-port"
                    label="Select Port"
                    size="medium"
                    sx={{ width: "30vw" }}
                  >
                    {portList.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* <FormControl>
            <InputLabel id="select-port">Select Printer</InputLabel>
            <Select
              onChange={(e) => setPrinter(e.target.value)}
              value={printer}
              labelId="select-port"
              label="Select Port"
              size="medium"
              sx={{ width: "30vw" }}
            >
              {printerList.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.item}
                </MenuItem>
              ))}
            </Select>
          </FormControl> 
                <Stack direction={"row"} spacing={2}>
                  <Button variant="contained" onClick={listPrinters}>
              List Prinetrs
            </Button> 
                  <Button variant="contained" onClick={listPort}>
                    List Port
                  </Button>
                  <Button variant="contained" onClick={savePortConfiguaration}>
                    Save Configuration
                  </Button>
                </Stack>
              </Stack>
            </Card>
          </Paper>
        </Grid> */}
      </Grid>
    </Stack>
  );
}

export default AppSetup;
