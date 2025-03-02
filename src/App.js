import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Partials from "./pages/Partials";
import Dashboard from "./pages/Dashboard";
import CashSale from "./pages/sales/CashSale";
import CashSaleReturn from "./pages/sales/CashSaleReturn";
import DailyReport from "./pages/sales/DailyReport";
import NoMatch from "./pages/NoMatch";
import Suspended from "./pages/sales/Suspended";

import Appcontext from "./stores/AppContext";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { history } from "./instence/axios";
import AppSetup from "./pages/AppSetup";
import { createTheme, ThemeProvider } from "@mui/material";

function App() {
  const colrScheme = localStorage.getItem("appColor") || "#9b27b0";
  const theme = createTheme({
    palette: {
      primary: {
        main: colrScheme,
      },
    },
    shape: {
      borderRadius: 4,
    },
    typography: {
      fontFamily: "Cairo, Roboto, Helvetica, Arial, sans-serif",
    },
  });


  return (
    <ThemeProvider theme={theme}>
      <Appcontext>
        <HistoryRouter history={history}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Partials />}>
              <Route index element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/sales/cash_sales" element={<CashSale />} />
              <Route
                path="/sales/cash_sales_return"
                element={<CashSaleReturn />}
              />

              <Route path="/sales/suspended" element={<Suspended />} />
              <Route path="/sales/daily_sales" element={<DailyReport />} />
              <Route path="/app_setup" element={<AppSetup />} />

              <Route path="*" element={<NoMatch />} />
            </Route>
          </Routes>
        </HistoryRouter>
      </Appcontext>
    </ThemeProvider>
  );
}

export default App;
