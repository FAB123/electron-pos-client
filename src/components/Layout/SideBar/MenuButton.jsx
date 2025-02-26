import React, { memo } from "react";
import { IconButton, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function MenuButton({ menu }) {
  // const { Icon, label } = menu;
  const Icon = menu.icon;

  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Stack
      direction="column"
      sx={{
        alignItems: "center",
        margin: 0,
        marginY: 1.5,
        // marginX: 0.2,
        // width: "100%",
        // border: "1px solid #fff",
        // borderRadius: 2,
      }}
      // spacing={1}
      // gap={4}
      flexWrap="wrap"
      onClick={() => navigate(menu.link)}
    >
      <IconButton color="inherit" size="40px">
        <Icon fontSize="inherit" />
      </IconButton>
      <Typography
        fontWeight={800}
        fontSize={13}
        sx={{
          whiteSpace: "normal", // Ensures text wraps
          wordBreak: "break-word", // Breaks long words if needed
          textAlign: "center", // Centers the text for better alignment
        }}
      >
        {t(`modules.${menu.label}`)}
      </Typography>
    </Stack>
  );
}

export default memo(MenuButton);
