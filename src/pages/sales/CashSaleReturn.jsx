import React, { useContext } from "react";
import Sale from "./Sale";
import { posContext } from "../../stores/AppContext";
import { useTranslation } from "react-i18next";

function CashSaleReturn() {
  const { setNavigation } = useContext(posContext);
  const { t } = useTranslation();
  setNavigation(t("modules.cash_sales_return"));
  return <Sale name="CASHSALERETURN" type="CASR" label="cashsalereturn" />;
}

export default CashSaleReturn;
