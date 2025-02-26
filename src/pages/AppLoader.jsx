import {
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";

function AppLoader({ loading }) {
  return (
    <Stack
      justifyContent={"center"}
      alignItems={"center"}
      height={"100vh"}
      sx={{ backgroundColor: "#D05CE3" }}
    >
      <Card sx={{ p: 3, width: 300 }}>
        <CardContent>
          <Typography color={"success"}>Loading data...</Typography>
        </CardContent>
        {loading && <LinearProgress color="secondary" />}
      </Card>
    </Stack>
  );
}

export default AppLoader;
