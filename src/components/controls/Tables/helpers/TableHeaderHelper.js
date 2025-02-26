import React from "react";
import i18n from "../../../../i18n";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Stack } from "@mui/material";
import DeleteButton from "@mui/icons-material/DeleteRounded";
import { postData } from "../../../../apis/apiCalls";
import {
  DELETECUSTOMERS,
  DELETESUPPLIERS,
} from "../../../../constants/apiUrls";
import toaster from "../../../../instence/toaster";

const deleteItem = (url, id) => {
  if (window.confirm("Are You Sure?")) {
    let data = [id];
    postData(url, data).then((response) => {
      response.status
        ? toaster.success(response.message)
        : toaster.error(response.message);
    });
  }
};

const customerHeader = (action) => {
  return [
    // {
    //   field: "details.customer_id",
    //   title: "Common ID",
    //   options: {
    //     display: false,
    //   },
    // },
    {
      field: "name",
      title: i18n.t("tables.full_name"),
      options: {},
    },
    {
      field: "mobile",
      title: i18n.t("common.mobile"),
      options: {},
    },
    {
      field: "customer_type",
      title: i18n.t("common.type"),
      lookup: { 1: i18n.t("sales.wholesale"), 0: i18n.t("sales.retail") },
      options: {},
    },
    {
      field: "billing_type",
      title: i18n.t("customers.billing_type"),
      lookup: { 0: "B2C", 1: "B2B" },
      sorting: false,
    },
    {
      field: "party_id",
      title: i18n.t("common.party_id"),
      options: {},
      render: (row) => `${row.party_id}[${row.identity_type}]`,
    },
    {
      field: "location_name_en",
      title: i18n.t("common.location"),
      options: {},
      render: (row) => `${row.location_name_en} [${row.location_name_ar}]`,
    },
    {
      field: "comments",
      title: i18n.t("common.comments"),
      options: {
        sort: false,
      },
    },
    {
      field: "encrypted_customer",
      title: " ",
      print: false,
      export: false,

      render: (row) => {
        return (
          <Stack direction={"row"} justifyContent="flex-end" spacing={1}>
            <IconButton
              color="primary"
              component="span"
              style={{ padding: "0 5px 0 5px" }}
              onClick={() => {
                action(`/customers/edit_customer/${row.encrypted_customer}`);
              }}
            >
              <EditRoundedIcon />
            </IconButton>

            <IconButton
              style={{ padding: "0 5px 0 5px" }}
              component="span"
              onClick={() => {
                deleteItem(DELETECUSTOMERS, row.encrypted_customer);
              }}
            >
              <DeleteIcon variant="outlined" color="secondary" />
            </IconButton>
          </Stack>
        );
      },
    },
  ];
};



export { customerHeader};
