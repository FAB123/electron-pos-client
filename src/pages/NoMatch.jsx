import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import React from "react";

import { useNavigate } from "react-router";
import Breadcrumb from "../components/controls/Breadcrumb";


function NoMatch() {
  const navigate = useNavigate();

  return (
    <Stack>
      <Breadcrumb
        labelHead="Access Denied."
        labelSub="Unautharized Access or Invaild Web Address."
      />
      <Box sx={{ m: 2 }}>
        <Paper elevation={20} sx={{ p: 2 }}>
          <Stack direction={"row"}>
            <Box>
              {/* <img
                src={image}
                alt=""
                srcSet=""
                style={{ height: 350, width: 350 }}
              /> */}
            </Box>
            <Box>
              <h1>404 Error</h1>
              <Typography variant="h4">
                Unautharized Access or Invaild Web Address.
              </Typography>
              <Button
                onClick={() => navigate(-1)}
                variant="contained"
                color="error"
                size="large"
                sx={{ width: "100%" }}
              >
                Back
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}

export default NoMatch;
