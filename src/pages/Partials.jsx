import React, { useContext, useState } from "react";
import Header from "../components/Layout/Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { posContext } from "../stores/AppContext";
import { getData } from "../apis/apiCalls";
import AppLoader from "./AppLoader";
import toaster from "../instence/toaster";

function Partials() {
  const [loading, setLoading] = useState(true);
  const { ipcRenderer } = window.require("electron");

  const { setStoreData } = useContext(posContext);
  const navigate = useNavigate();

  useEffect(() => {
    let storeData = localStorage.getItem("store_data");
    if (storeData) {
      getData("/get_required_info/1").then(async (requiredInfo) => {
        try {
          let parsedStoreData = JSON.parse(storeData);

          const response = await ipcRenderer.invoke("get-app-configuration");

          const configurationData = {
            configuration_data: requiredInfo.configuration_data,
            tax_scheme: requiredInfo.tax_scheme,
            invoice_templates: requiredInfo.invoice_templates,
            company_logo: requiredInfo.company_logo,
            appdata: response,
            ...parsedStoreData,
          };

          if (!localStorage.getItem("appColor")) {
            localStorage.setItem(
              "appColor",
              response?.["app-color"] ?? "#9b27b0"
            );
          }

          setStoreData(configurationData);
          setLoading(false);
        } catch (error) {
          toaster.error(error);
        }
      });
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <>
      {loading ? (
        <AppLoader loading={loading} />
      ) : (
        <Header>
          <Outlet />
        </Header>
      )}
    </>
  );
  // if (validateLogin()) {
  //   return (
  //     <Header>
  //       <Outlet />
  //     </Header>
  //   );
  // } else {
  //   return <Navigate to="/login" />;
  // }
}

export default Partials;
