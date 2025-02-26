import React, { useRef } from "react";
import Breadcrumb from "../../components/controls/Breadcrumb";
import MeterialTables from "../../components/controls/Tables/MeterialTables";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { customerHeader } from "../../components/controls/Tables/helpers/TableHeaderHelper";
import { DELETECUSTOMERS, GETALLCUSTOMERS } from "../../constants/apiUrls";
import { Drawer, Stack } from "@mui/material";
import PosDrawer from "../../components/controls/PosDrawer";

function ViewCustomers() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const tableRef = useRef();
  const title = "Customers List";
  return (
    <Stack>
      <Breadcrumb labelHead={t("modules.customers")} labelSub="Add/Edit Item" />
      <MeterialTables
        ref={tableRef}
        title={title}
        header={customerHeader(navigate)}
        url={GETALLCUSTOMERS}
        deleteURL={DELETECUSTOMERS}
        type="CUSTOMER"
        newLink="/customers/add_customers"
      />
    </Stack>
  );
}

export default ViewCustomers;
