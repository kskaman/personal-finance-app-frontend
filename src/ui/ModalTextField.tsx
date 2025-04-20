import {
  TextField,
  InputAdornment,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import { useContext } from "react";
import { SettingsContext } from "../context/SettingsContext";

interface CustomTextFieldProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  error?: { message?: string };
  label: string;
  placeholder?: string;
  adornmentTextFlag?: boolean;
  maxLength?: number;
  isDisabled?: boolean;
  color?: string;
  adornmentColor?: string;
}

const ModalTextField = ({
  value,
  onChange,
  onBlur,
  error,
  label,
  color,
  adornmentColor,
  maxLength,
  placeholder = "",
  adornmentTextFlag = true,
  isDisabled = false,
}: CustomTextFieldProps) => {
  const theme = useTheme();
  const currencySymbol = useContext(SettingsContext).selectedCurrency;

  return (
    <Box>
      <Typography
        fontSize="12px"
        color={adornmentColor || theme.palette.primary.light}
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
              borderColor: color || theme.palette.primary.main,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: color || theme.palette.primary.main,
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
            ...(adornmentTextFlag && {
              startAdornment: (
                <InputAdornment position="start">
                  <Typography
                    color={adornmentColor || theme.palette.primary.light}
                    fontSize="14px"
                  >
                    {currencySymbol}
                  </Typography>
                </InputAdornment>
              ),
            }),
            style: {
              caretColor: color || theme.palette.primary.main, // explicitly set caret color
              color: color || theme.palette.primary.main, // ensure text color is visible
            },
          },
          ...(maxLength ? { maxLength } : {}),
        }}
      />
    </Box>
  );
};

export default ModalTextField;
