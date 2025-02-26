import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { saveStoreConfig } from "../helpers/Configuration";
import PowerIcon from "@mui/icons-material/PowerSettingsNewRounded";
import { ToastContainer } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormLoginDropdown, FormInputText } from "../components/controls/mui";
import ProgressLoader from "../components/controls/ProgressLoader";
import { checkDatabase, doLogin } from "../apis/apiCalls";
import { loginHelper } from "../helpers/FormHelper";
import { loginTransilationHelper } from "../helpers/FormTrasilationHelper";
import {
  Avatar,
  Button,
  createTheme,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ConfirmBox from "../components/bundled/ConfirmBox";

function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [warning, setWarning] = useState("");
  const [stores, setstores] = useState([]);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();

  // const primaryColor = theme.palette.primary.main;



  const [confirmation, setConfirmation] = useState(false);

  const { ipcRenderer } = window.require("electron");

  const { handleSubmit, reset, control } = useForm({
    defaultValues: loginHelper.initialValues,
    resolver: yupResolver(loginTransilationHelper),
    mode: "onBlur",
  });

  useEffect(() => {
    checkDatabase().then((result) => {
      if (result.status === 200) {
        if (result.data.stores.length > 0) {
          setstores(result.data.stores);
          const data = {
            store: result.data.stores[0].location_id,
          };
          reset(data);
        }
      }
    });
  }, []);

  const onSubmit = (values) => {
    setLoading(true);
    try {
      doLogin(values)
        .then(async (response) => {
          if (response.data.auth) {
            setWarning("");
            await saveStoreConfig(response);
            setLoading(false);
            setTimeout(() => {
              // initializeStoreConfig();
              navigate("/dashboard");
            }, 100);
          } else {
            setWarning(t("login.invalid_login"));
          }
        })
        .catch(() => setWarning(t("login.invalid_login")))
        .finally(() => setLoading(false));
    } catch (error) {
      console.log(error);
    }
  };

  const paperStyle = {
    padding: 40,
    minHeight: "40vh",
    width: "20vw",
    minWidth: "250px",
    top: "50vh",
    left: "50vw",
    transform: "translate(-50%, -50%)",
  };

  // const btnstyle = { marginTop: 8 };

  return (
    <Grid sx={{ height: "100vh", position: "relative" }}>
      <Paper
        sx={{
          height: "50vh",
          width: "100vw",
          backgroundColor: theme.palette.primary.main,//"#9b27b0",
          position: "absolute",
        }}
      >
        <Paper
          elevation={10}
          style={paperStyle}
          position="absolute"
          sx={{ position: "absolute" }}
        >
          <Grid align="center">
            <Avatar sx={{ backgroundColor: "#1bbd7e" }}>
              <LockOutlinedIcon />
            </Avatar>

            <h2>Sign In</h2>
            <Typography variant="body1">Hasib POS</Typography>
          </Grid>
          <ToastContainer />
          <ProgressLoader open={loading} />

          <Grid align="center">
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <FormInputText
                label={t("login.username")}
                name="username"
                size="small"
                control={control}
              />
              <FormInputText
                label={t("login.password")}
                name="password"
                type="password"
                size="small"
                control={control}
              />

              {stores.length > 0 && (
                <FormLoginDropdown
                  label={t("common.stores")}
                  name="store"
                  size="small"
                  control={control}
                  options={stores}
                />
              )}

              <Typography color="error" sx={{ m: 3 }}>
                {warning}
              </Typography>

              <Button
                type="submit"
                color="primary"
                variant="contained"
                // style={btnstyle}
                fullWidth
              >
                {t("login.signin")}
              </Button>

              <Stack
                justifyContent={"center"}
                alignItems={"center"}
                sx={{ marginTop: 2 }}
              >
                <IconButton
                  onClick={() =>
                    setConfirmation(
                      "Are you sure you want to close the application?"
                    )
                  }
                >
                  <PowerIcon color="error" />
                </IconButton>
              </Stack>
            </form>
          </Grid>
        </Paper>
        {confirmation && (
          <ConfirmBox
            confirmation={confirmation}
            setConfirmation={setConfirmation}
            response={(a) => {
              setConfirmation(false);
              if (a) {
                ipcRenderer.send("close-app");
              }
            }}
          />
        )}
      </Paper>
    </Grid>
  );
}

export default LoginPage;
