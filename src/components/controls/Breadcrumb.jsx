import { Breadcrumbs, Paper, Typography, Stack } from "@mui/material";
import React from "react";
import Link from "@mui/material/Link";

function Breadcrumb(props) {
  const { labelHead, labelSub } = props;

  return (
    <Paper elevation={5} sx={{ marginX: 0.5, p: 0.5 }}>
      <Stack
        direction={"row"}
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h6" gutterBottom={true}>
          {labelHead}
        </Typography>

        <Breadcrumbs maxItems={3} aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="#">
            Home
          </Link>
          <Link underline="hover" color="inherit" href="#">
            {labelHead}
          </Link>
          <Typography color="text.primary">{labelSub}</Typography>
        </Breadcrumbs>
      </Stack>
    </Paper>
  );
}

export default React.memo(Breadcrumb);
