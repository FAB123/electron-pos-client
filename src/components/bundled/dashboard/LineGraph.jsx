import {
  CircularProgress,
  Paper,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import BarChartIcon from "@mui/icons-material/BarChart";
import { IconChartLine } from "@tabler/icons-react";
import { getData } from "../../../apis/apiCalls";
import MonthNames from "./MonthNames";
import { useTranslation } from "react-i18next";

function LineGraph({ title, url, type }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState("line");
  const { t } = useTranslation();
  var today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    `${today.getMonth() + 1}/${today.getFullYear()}`
  );

  useEffect(() => {
    setLoading(true);
    getData(`${url}/${selectedMonth}`).then((response) => {
      setData(response.data);
      setLoading(false);
    });
  }, [selectedMonth]);

  const option =
    type === "P"
      ? {
          legend: {
            data: [
              t("common.cash_purchase"),
              t("common.cash_purchase_return"),
              t("common.credit_purchase"),
              t("common.credit_purchase_return"),
            ],
          },
          tooltip: {
            trigger: "axis", // 'axis' for multiple series, 'item' for single series
          },
          xAxis: {
            type: "category",
            data: data.dates,
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              name: t("common.cash_purchase"),
              data: data.cash_purchase,
              type: style,
              smooth: true,
            },
            {
              name: t("common.cash_purchase_return"),
              data: data.cash_purchase_return,
              type: style,
              smooth: true,
            },
            {
              name: t("common.credit_purchase"),
              data: data.credit_purchase,
              type: style,
              smooth: true,
            },
            {
              name: t("common.credit_purchase_return"),
              data: data.credit_purchase_return,
              type: style,
              smooth: true,
            },
          ],
        }
      : {
          legend: {
            data: [
              t("sales.label_cashsale"),
              t("sales.label_cashsalereturn"),
              t("sales.label_creditsale"),
              t("sales.label_creditsalereturn"),
            ],
          },
          tooltip: {
            trigger: "axis", // 'axis' for multiple series, 'item' for single series
          },
          xAxis: {
            type: "category",
            data: data.dates,
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              name: t("sales.label_cashsale"),
              data: data.cash_sale,
              type: style,
              smooth: true,
            },
            {
              name: t("sales.label_cashsalereturn"),
              data: data.cash_sale_return,
              type: style,
              smooth: true,
            },
            {
              name: t("sales.label_creditsale"),
              data: data.credit_sale,
              type: style,
              smooth: true,
            },
            {
              name: t("sales.label_creditsalereturn"),
              data: data.credit_sale_return,
              type: style,
              smooth: true,
            },
          ],
        };

  return (
    <Paper elevation={20} sx={{ p: 1 }}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6">{title}</Typography>
        <Stack direction={"row"} spacing={1}>
          <MonthNames
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />

          <IconButton
            color="secondary"
            onClick={() => setStyle(style === "line" ? "bar" : "line")}
          >
            {style === "line" ? <BarChartIcon /> : <IconChartLine />}
          </IconButton>
        </Stack>
      </Stack>
      {loading ? (
        <CircularProgress color="secondary" />
      ) : (
        <ReactECharts option={option} style={{ height: 360 }} />
      )}
    </Paper>
  );
}

export default LineGraph;
