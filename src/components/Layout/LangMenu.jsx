import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from "@mui/material";
import React from "react";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import { useTranslation } from "react-i18next";

function LangMenu(props) {
  const { anchorEl, open, handleClose } = props;
  const { i18n } = useTranslation();

  return (
    <Menu
      id="language-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        "aria-labelledby": "language-button",
      }}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)", // Subtle shadow for depth
        },
      }}
    >
      <MenuList sx={{ width: 180, padding: 1 }}>
        {/* English Language Option */}
        <MenuItem
          onClick={() => {
            i18n.changeLanguage("en");
            handleClose();
          }}
          sx={{
            backgroundColor: "#fff",
            color: "#d05ce3",
            borderRadius: 1,
            marginBottom: 1,
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              backgroundColor: "#d05ce3",
              color: "#fff",
              transform: "scale(1.05)",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            },
          }}
        >
          <ListItemIcon>
            <LanguageRoundedIcon
              fontSize="small"
              sx={{
                color: "#d05ce3",
              }}
            />
          </ListItemIcon>
          <ListItemText primary="English" />
        </MenuItem>

        {/* Arabic Language Option */}
        <MenuItem
          onClick={() => {
            i18n.changeLanguage("ar");
            handleClose();
          }}
          sx={{
            backgroundColor: "#fff",
            color: "#d05ce3",
            borderRadius: 1,
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              backgroundColor: "#d05ce3",
              color: "#fff",
              transform: "scale(1.05)",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            },
          }}
        >
          <ListItemIcon>
            <LanguageRoundedIcon fontSize="small" sx={{ color: "#d05ce3" }} />
          </ListItemIcon>
          <ListItemText primary="Arabic" />
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default LangMenu;
