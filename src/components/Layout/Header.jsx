import React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, styled, useTheme } from "@mui/material";
import "./Style.css";
import { ThemeProvider } from "@emotion/react";
import MuiDrawer from "@mui/material/Drawer";

import AppHeader from "./AppHeader";
import AppDrawer from "./SideBar/AppDrawer";

// import { useHotkeys } from "react-hotkeys-hook";

// const drawerWidth = 240;

// const openedMixin = (theme) => ({
//   width: 0,
//   transition: theme.transitions.create("width", {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.enteringScreen,
//   }),
//   overflowX: "hidden",
// });

// const closedMixin = (theme) => ({
//   transition: theme.transitions.create("width", {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   overflowX: "hidden",
//   width: `calc(${theme.spacing(10)} + 1px)`,
//   [theme.breakpoints.up("sm")]: {
//     width: `calc(${theme.spacing(11)} + 1px)`,
//   },
// });

// const DrawerHeader = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "flex-end",
//   padding: theme.spacing(0, 1),
//   ...theme.mixins.toolbar,
// }));

const mixin = (theme) => ({
  width: `calc(${theme.spacing(10)} + 1px)`,
  // [theme.breakpoints.up("sm")]: {
  //   width: `calc(${theme.spacing(11)} + 1px)`,
  // },
  overflowX: "hidden",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer)(({ theme }) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...mixin(theme),
  "& .MuiDrawer-paper": mixin(theme),
}));

function Header({ children }) {
  const myTheme = useTheme();
  // const theme = createTheme({
  //   palette: {
  //     primary: {
  //       main: myTheme.palette.secondary.main,
  //     },
  //   },
  //   shape: {
  //     borderRadius: 3,
  //   },
  //   typography: {
  //     fontFamily: "Cairo, Roboto, Helvetica, Arial, sans-serif",
  //   },
  // });

  // const onKeyDown = (keyName, e, handle) => {
  //   console.log("test:onKeyDown", keyName, e, handle);
  //   if (keyName === "shift+s") {
  //     navigate("/sales/cash_sales");
  //   } else if (keyName === "shift+r") {
  //     navigate("/sales/cash_sales_return");
  //   } else if (keyName === "alt+s") {
  //     navigate("/sales/credit_sales");
  //   } else if (keyName === "alt+r") {
  //     navigate("/sales/credit_sales_return");
  //   }
  // };

  // const AvailableTags = "INPUT" | "TEXTAREA" | "SELECT";

  // useHotkeys("alt+s", () => navigate("/sales/cash_sales"), {
  //   enabledOnTags: AvailableTags,
  // });
  // useHotkeys("alt+c", () => navigate("/sales/credit_sales"), {
  //   enabledOnTags: AvailableTags,
  // });

  return (
    // <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppHeader />
        <Drawer
          variant="permanent"
          open={true}
          PaperProps={{
            sx: {
              backgroundColor: myTheme.palette.primary.main,
              color: "#fff",
            },
          }}
        >
          <DrawerHeader />
          <AppDrawer />
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            backgroundColor: "#f8f0fc",
          }}
        >
          <CssBaseline />
          <DrawerHeader />
          {children}
        </Box>
      </Box>
    // </ThemeProvider>
  );
}

export default React.memo(Header);
