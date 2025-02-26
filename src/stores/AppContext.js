import React from "react";
import { createContext, useState } from "react";
import { useTranslation } from "react-i18next";

export const posContext = createContext(null);

function Appcontext({ children }) {
  const { t } = useTranslation();
  const [storeData, setStoreData] = useState(true);
  const [paymentList, setPaymentList] = useState([]);
  const [navigation, setNavigation] = useState(t("navigator.home"));

  return (
    <posContext.Provider
      value={{
        storeData,
        setStoreData,
        paymentList,
        setPaymentList,
        navigation,
        setNavigation,
      }}
    >
      {children}
    </posContext.Provider>
  );
}

export default Appcontext;
