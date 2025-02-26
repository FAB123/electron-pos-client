import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import React from "react";
import { useTranslation } from "react-i18next";

function Widget({ title, icon, theme, themeForgound, content }) {
  const { t } = useTranslation();
  return (
    <Card sx={{ display: "flex" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          bgcolor: theme,
        }}
      >
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Avatar
            aria-label="recipe"
            sx={{ bgcolor: themeForgound, width: 36, height: 36 }}
          >
            {icon}
          </Avatar>
        </CardContent>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
        {/* <CardHeader
          title={title}
          subheader={
            <>
              {content === "Loading" && (
                <CircularProgress color="secondary" size={25} />
              )}
              <Typography variant="button" color={"error"}>
                <b>
                  {content === "Loading"
                    ? content
                    : `${t("common.total")}: ${content} `}
                </b>
              </Typography>
            </>
          }
        /> */}
        <Stack>
          <Typography variant="button" fontWeight={800} color="success">
            {title}
          </Typography>
          <Typography variant="button" fontWeight={600} color="error">
            {content === "Loading"
              ? content
              : `${t("common.total")} : ${content} `}
          </Typography>
        </Stack>
      </Box>
    </Card>
  );
}

export default Widget;
