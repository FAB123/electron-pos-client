import React, {
  useState,
  useEffect,
  useCallback,
  memo,
  useContext,
} from "react";

import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
// import Moment from "react-moment";
import Toolbar from "@mui/material/Toolbar";

import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import MuiAppBar from "@mui/material/AppBar";

import {
  Box,
  IconButton,
  styled,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import { initializeStoreConfig, logout } from "../../helpers/Configuration";
import { useNavigate } from "react-router-dom";
import PinIcon from "@mui/icons-material/Pin";

import { PosTooltip } from "../util/Theming";
import LangMenu from "./LangMenu";
import { posContext } from "../../stores/AppContext";
import { useTranslation } from "react-i18next";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import AppTime from "./SideBar/AppTime";
import ConfirmBox from "../bundled/ConfirmBox";
import PosDrawer from "../controls/PosDrawer";
import UpdateToken from "./Token/UpdateToken";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

function AppHeader() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation();
  const [confirmation, setConfirmation] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [showTokenButton, setShowTokenButton] = useState(false);
  const { navigation } = useContext(posContext);

  const { ipcRenderer } = window.require("electron");

  useEffect(() => {
    // initializeStoreConfig();
    let tokenType = localStorage.getItem("tokenType");
    if (tokenType === "true") {
      setShowTokenButton(true);
    } else {
      setShowTokenButton(false);
    }
  }, []);

  const signOut = useCallback(() => {
    logout();
    navigate("/login");
  }, []);

  const changeToken = useCallback(() => {
    setShowToken(true);
  }, []);

  const showLangMenu = useCallback((e) => {
    setAnchorEl(e.currentTarget);
    setOpen(true);
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  return (
    <AppBar position="fixed">
      <Toolbar variant="dense">
        <Typography variant="h6" noWrap component="div">
          SalesTime
        </Typography>

        <Divider orientation="vertical" flexItem sx={{ p: 1 }} />

        <Stack
          justifyContent={"center"}
          alignItems={"center"}
          sx={{ flexGrow: 1 }}
          textAlign={"center"}
        >
          <AppTime />
          <Typography variant="h6" noWrap component="div">
            {navigation}
          </Typography>
        </Stack>
        <Box sx={{ display: "flex" }}>
          <Divider orientation="vertical" flexItem sx={{ p: 1 }} />

          {showTokenButton && (
            <>
              <PosTooltip title="ONLINE TOKEN">
                <IconButton
                  size="large"
                  edge="end"
                  aria-haspopup="true"
                  onClick={changeToken}
                  color="inherit"
                >
                  <PinIcon />
                </IconButton>
              </PosTooltip>
              <Divider orientation="vertical" flexItem sx={{ p: 1 }} />
            </>
          )}

          <PosTooltip title="Application Language">
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={showLangMenu}
              color="inherit"
            >
              <TranslateRoundedIcon />
            </IconButton>
          </PosTooltip>

          <Divider orientation="vertical" flexItem sx={{ p: 1 }} />

          <PosTooltip title="Sign Out">
            <IconButton
              size="large"
              aria-label="user sign out"
              color="inherit"
              onClick={() => signOut()}
            >
              <LockRoundedIcon />
            </IconButton>
          </PosTooltip>
          <Divider orientation="vertical" flexItem sx={{ p: 1 }} />

          <PosTooltip title="Quit Application">
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={() => setConfirmation(t("common.confirm"))}
              color="inherit"
            >
              <ExitToAppRoundedIcon />
            </IconButton>
          </PosTooltip>
        </Box>
      </Toolbar>
      <LangMenu anchorEl={anchorEl} open={open} handleClose={handleClose} />
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

      {showToken && (
        <PosDrawer open={showToken} setOpen={setShowToken}>
          <UpdateToken />
        </PosDrawer>
      )}
    </AppBar>
  );
}

export default memo(AppHeader);
