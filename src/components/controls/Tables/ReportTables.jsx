import React, { useEffect, useRef } from "react";
import { getData } from "../../../apis/apiCalls";
import {
  Stack,
  createTheme,
  ThemeProvider,
  Typography,
  Box,
  TablePagination,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/PrintRounded";
import { exportToEXCEL } from "../../../helpers/GeneralHelper";
import ToasterContainer from "../ToasterContainer";
import MaterialTable, { MTableToolbar } from "material-table";
import { muiTableIcons, localization } from "../../../constants/tableConstants";
import ReactToPrint from "react-to-print";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import { useState } from "react";

import { useTranslation } from "react-i18next";
import { toCurrency } from "../../../constants/constants";

function ReportTables({ title, data }) {
  const theme = createTheme({
    typography: {
      fontFamily: "Cairo, Roboto, Helvetica, Arial, sans-serif",
    },
  });
  const tableRef = useRef();
  const { t } = useTranslation();

  const [totalData, setTotalData] = useState(null);

  const options = {
    search: false,
    //filtering: true,
    exportButton: true,
    // tableLayout: "fixed",
    initialPage: 0,
    pageSize: 15,
    pageSizeOptions: [15, 25, 50, 100, 500, 750, 1000],
    padding: "dense",
    selection: false,
    paginationType: "stepped",
  };

  useEffect(() => {
    tableRef.current && tableRef.current.onQueryChange();
  }, [data]);

  const generateExcel = (query) => {
    let sortField = query.orderBy ? query.orderBy : "null";
    let sortDir = query.orderDirection !== "" ? query.orderDirection : "null";
    let url = `${data.url}/0/3000/${sortField}/${sortDir}`;
    exportToEXCEL(url, "Download");
  };

  return (
    <Stack sx={{ m: 1 }}>
      <ToasterContainer />
      <ThemeProvider theme={theme}>
        <>
          <MaterialTable
            tableRef={tableRef}
            icons={muiTableIcons}
            localization={localization()}
            title={title}
            data={(query) => {
              return new Promise((resolve, reject) => {
                let sortField = query.orderBy ? query.orderBy.field : "null";
                let sortDir =
                  query.orderDirection !== "" ? query.orderDirection : "null";
                let dataUrl = `${data.url}/${query.page + 1}/${
                  query.pageSize
                }/${sortField}/${sortDir}`;
                getData(dataUrl).then((result) => {
                  // if (data.type === "direct") {

                  if (result.summary_data) {
                    setTotalData(result.summary_data);
                  }
                  // } else {
                  //   result.summary_data &&
                  //     result.summary_data.length > 0 &&
                  //     setTotalData(result.summary_data[0]);
                  // }
                  resolve({
                    data: result.data.data,
                    page: result.data.current_page - 1,
                    totalCount: result.data.total,
                  });
                });
              });
            }}
            columns={data.header}
            options={options}
            // parentChildData={(row, rows) =>
            //   rows.find((a) => a.Reference === row.Reference)
            // }
            actions={[
              {
                tooltip: "Print",
                isFreeAction: true,
                icon: () => (
                  <ReactToPrint
                    trigger={() => <PrintIcon />}
                    content={() => tableRef.current}
                  />
                ),
                onClick: () => {
                  return true;
                },
              },
              {
                tooltip: "Export all items to Excel",
                isFreeAction: true,
                icon: () => <TextSnippetIcon />,
                onClick: () => generateExcel(tableRef.current.state.query),
              },
            ]}
            components={{
              Toolbar: (props) => (
                <Stack sx={{ m: 0, p: 0 }}>
                  <MTableToolbar {...props} />
                  <Typography style={{ padding: "0px 10px" }}>
                    {data.selectDate}
                  </Typography>
                </Stack>
              ),

              Pagination: (props) => {
                return (
                  <Stack direction="column">
                    <Stack
                      direction="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      {totalData &&
                        data.type === "direct" &&
                        totalData.map((item, i) => (
                          <Typography key={i}>
                            {item.item} : {item.amount}
                          </Typography>
                        ))}
                      {totalData &&
                        data.type !== "direct" &&
                        Object.entries(totalData).map((key, i) => (
                          <Typography key={i}>
                            {t(`common.${key[0]}`)} : {toCurrency(key[1])}
                          </Typography>
                        ))}
                    </Stack>
                    <Box display="flex" justifyContent="flex-end">
                      <Box justifyContent="flex-end">
                        <TablePagination {...props} />
                      </Box>
                    </Box>
                  </Stack>
                );
              },
            }}
          ></MaterialTable>
        </>
      </ThemeProvider>
    </Stack>
  );
}

export default ReportTables;
