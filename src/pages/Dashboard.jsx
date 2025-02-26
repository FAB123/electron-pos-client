import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { getData } from "../apis/apiCalls";
import {
  GETBASICCONFIG,
  GETPURCHASEGRPAH,
  GETSALESGRPAH,
} from "../constants/apiUrls";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";

import { Chip, Divider, Grid, Stack } from "@mui/material";
import Breadcrumb from "../components/controls/Breadcrumb";
import Widget from "../components/bundled/dashboard/Widget";

import LineGraph from "../components/bundled/dashboard/LineGraph";
import { colorPairs } from "../constants/constants";
import { posContext } from "../stores/AppContext";

function Dashboard() {
  const [totalItem, setTotalItem] = useState("Loading");
  const [totalSupplier, setTotalSupplier] = useState("Loading");
  const [totalCustomer, setTotalCustomer] = useState("Loading");
  const [totalEmployee, setTotalEmployee] = useState("Loading");

  const [todaySales, setTodaySales] = useState([]);
  const [todayPayments, setTodayPayments] = useState([]);

  const { t } = useTranslation();
  // const { storeData } = useContext(posContext);
  useEffect(() => {
    getData(GETBASICCONFIG).then((response) => {
      setTotalItem(response.data.total_items);
      setTotalSupplier(response.data.total_supplier);
      setTotalCustomer(response.data.total_customer);
      setTotalEmployee(response.data.total_employee);

      setTodaySales(response.data.today_sales_total);
      setTodayPayments(response.data.today_payment_details);
    });
  }, []);

  const { setNavigation } = useContext(posContext);

  setNavigation(t("modules.dashboard"));


  return (
    <Stack>
      {/* <Breadcrumb labelHead={t("modules.dashboard")} labelSub="" /> */}
      <Grid container spacing={2} p={1}>
        <Grid item md={12}>
          <Grid container spacing={2}>
            <Grid item md={3} xs={12}>
              <Widget
                icon={<AccountCircleOutlinedIcon />}
                title={t("modules.customers")}
                content={totalCustomer}
                theme="#9c27b0"
                themeForgound="#7b1fa2"
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Widget
                icon={<SecurityOutlinedIcon />}
                title={t("modules.suppliers")}
                content={totalSupplier}
                theme="#673ab7"
                themeForgound="#512da8"
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Widget
                icon={<DnsOutlinedIcon />}
                title={t("modules.items")}
                content={totalItem}
                theme="#607d8b"
                themeForgound="#455a64"
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Widget
                icon={<SecurityOutlinedIcon />}
                title={t("modules.employee")}
                content={totalEmployee}
                theme="#ffa726"
                themeForgound="#f57c00"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={12}>
          <Divider>
            <Chip
              label={t("home.total_today_sales_data")}
              size="small"
              sx={{ backgroundColor: colorPairs[0].color, color: "#fff" }}
            />
          </Divider>
        </Grid>

        <Grid item md={12}>
          <Grid container spacing={2}>
            {Object.entries(todaySales).map(([key, value], index) => {
              const color = colorPairs[index % colorPairs.length];
              return (
                <Grid item md={3} xs={12} key={key}>
                  <Widget
                    icon={<AccountCircleOutlinedIcon />}
                    title={t(`home.today_${key}`)}
                    content={value}
                    theme={color.color}
                    themeForgound={color.lightColor}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        <Grid item md={12}>
          <Divider>
            <Chip
              label={t("home.total_today_payment_data")}
              size="small"
              sx={{ backgroundColor: colorPairs[2].color, color: "#fff" }}
            />
          </Divider>
        </Grid>

        <Grid item md={12}>
          <Grid container spacing={2}>
            {todayPayments.map((item, key) => {
              const color = colorPairs[key % colorPairs.length];

              return (
                <Grid item md={3} xs={12}>
                  <Widget
                    icon={<AccountCircleOutlinedIcon />}
                    title={item.payment_name}
                    content={item.amount}
                    theme={color.color}
                    themeForgound={color.lightColor}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Grid>

        <Grid item md={6} xs={12}>
          <LineGraph
            title={t("reports.monthly_sale")}
            url={GETSALESGRPAH}
            type={"S"}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <LineGraph
            title={t("reports.monthly_purchase")}
            url={GETPURCHASEGRPAH}
            type={"P"}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}

export default Dashboard;
