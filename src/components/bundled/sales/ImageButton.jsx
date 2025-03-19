import { ImageListItem, ImageListItemBar, Stack } from "@mui/material";
import TouchRipple from "@mui/material/ButtonBase/TouchRipple";
import React from "react";
import { styled } from "@mui/material/styles";
import { useTheme } from "@emotion/react";
import { useState } from "react";

const StyledImageListItemBar = styled(ImageListItemBar)(
  ({ theme, textSize = 15 }) => ({
    ".MuiImageListItemBar-titleWrap": {
      display: "block",
      padding: 0,
      textAlign: "center",
    },
    ".MuiImageListItemBar-title": {
      display: "block",
      fontWeight: 700,
      fontSize: textSize,
      color: "#fff",
      width: "100%",
      lineHeight: `calc(${textSize} * 1.2)`,
      textAlign: "center",
      wordWrap: "break-word",
      whiteSpace: "normal",
    },
    ".MuiImageListItemBar-subtitle": {
      color: "#fff",
      // position: "absolute",
      width: "100%",
      // marginTop: "3px",
      fontSize: `calc(${textSize} * 1.1)`,
      lineHeight: `calc(${textSize} * 1.3)`,
      fontWeight: 650,
    },
  })
);

function ImageButton({ item, pic, fontSize, iconSize, addToCart }) {
  const rippleRef = React.useRef(null);

  const theme = useTheme();
  const onRippleStart = (e) => {
    rippleRef.current.start(e);
  };
  const onRippleStop = (e) => {
    rippleRef.current.stop(e);
  };

  return (
    <Stack alignItems="center" m={0} p={0}>
      <ImageListItem
        sx={{
          width: iconSize, //size of icon
          border: `solid ${theme.palette.primary.main} 2px`,
          borderRadius: "12px",
        }}
        onMouseDown={onRippleStart}
        onMouseUp={onRippleStop}
        onClick={() => addToCart(item)}
      >
        <TouchRipple ref={rippleRef} center={false} />
        <img
          src={pic}
          srcSet={pic}
          alt={item.item_name}
          loading="lazy"
          style={{
            objectFit: "contain",
            opacity: "0.8",
            borderRadius: "12px",
            padding: "2px",
            cursor: "pointer",
          }}
        />

        <StyledImageListItemBar
          subtitle={`${item.unit_price} SR`}
          title={`${item.item_name} ${
            item.item_name_ar ? " - " + item.item_name_ar : ""
          }`}
          position="bottom"
          textSize={`${fontSize}px`}
          sx={{
            height: "auto",
            backgroundColor: theme.palette.primary.main, //"primary",// "#a09",
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
            // backgroundColor: "#f0f",
          }}
        />
      </ImageListItem>
    </Stack>
  );
}

export default ImageButton;
