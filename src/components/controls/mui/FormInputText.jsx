import React from "react";
import { Controller } from "react-hook-form";
import { FormControl, TextField, InputAdornment } from "@mui/material";

export const FormInputText = ({
  name,
  control,
  label,
  type,
  multiline,
  size,
  helperText,
  preappend,
  postappend,
  postappendCount,
  onKeyDown,
}) => {
  return (
    <FormControl fullWidth style={{ padding: "10px" }}>
      <Controller
        name={name}
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
          formState,
        }) => (
          <TextField
            helperText={error ? error.message : helperText}
            error={!!error}
            onChange={onChange}
            size={size === "small" ? "small" : "medium"}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            value={value}
            type={type ? type : "text"}
            multiline={multiline ? true : false}
            minRows={3}
            maxRows={4}
            label={label}
            autoComplete="on"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {preappend ? "SAR" : null}
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {postappend ? "0.00" : null}
                  {postappendCount ? `Count: ${value.length}` : null}
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </FormControl>
  );
};
