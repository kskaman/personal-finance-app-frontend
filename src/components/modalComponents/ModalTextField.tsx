import React from "react";
import { TextField, InputAdornment, Typography, Box } from "@mui/material";
import theme from "../../theme/theme";

interface CustomTextFieldProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  error?: { message?: string };
  label: string;
  placeholder?: string;
  adornmentText?: string | null;
  maxLength?: number;
  isDisabled?: boolean;
}

const ModalTextField: React.FC<CustomTextFieldProps> = ({
  value,
  onChange,
  onBlur,
  error,
  label,
  maxLength,
  placeholder = "",
  adornmentText = null,
  isDisabled = false,
}) => {
  return (
    <Box>
      <Typography
        fontSize="12px"
        color={theme.palette.primary.light}
        fontWeight="bold"
        sx={{ marginBottom: "2px" }}
      >
        {label}
      </Typography>
      <TextField
        disabled={isDisabled}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        type="text"
        variant="outlined"
        placeholder={placeholder}
        error={!!error}
        helperText={error ? error.message : ""}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            height: "45px",
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderRadius: "8px",
          },
          width: "100%",
        }}
        slotProps={{
          input: {
            autoComplete: "off",
            ...(adornmentText && {
              startAdornment: (
                <InputAdornment position="start">
                  <Typography
                    color={theme.palette.primary.light}
                    fontSize="14px"
                  >
                    {adornmentText}
                  </Typography>
                </InputAdornment>
              ),
            }),
          },
          ...(maxLength ? { maxLength } : { maxLength }),
        }}
      />
    </Box>
  );
};

export default ModalTextField;
