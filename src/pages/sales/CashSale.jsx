import React, { useContext } from "react";
import Sale from "./Sale";
import { posContext } from "../../stores/AppContext";
import { useTranslation } from "react-i18next";

function CashSale() {
  const { setNavigation } = useContext(posContext);
  const { t } = useTranslation();
  setNavigation(t("modules.cash_sales"));

  return <Sale name="CASHSALE" type="CAS" label="cashsale" />;
}

export default CashSale;
