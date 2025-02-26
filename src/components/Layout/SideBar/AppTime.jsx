import { Stack, Typography } from "@mui/material";
import React, { memo } from "react";
import Moment from "react-moment";

function AppTime() {
  return (
    <Stack
      // sx={{  flexGrow: 1 }}
      alignContent={"center"}
      justifyContent={"center"}
      textAlign={"center"}
    >
      <Typography variant="body1" sx={{ fontFamily: "Orbitron, sans-serif" }}>
        <Moment
          locale="en"
          interval={15000}
          format="DD-MM-YYYY hh:mm A"
        ></Moment>
      </Typography>
    </Stack>
  );
}

export default memo(AppTime);
