import { useState } from "react";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import Button from "../../utilityComponents/Button";
import VisibilityOnIcon from "../../Icons/VisibilityOnIcon";
import VisibilityOffIcon from "../../Icons/VisibilityOffIcon";
import theme from "../../theme/theme";

interface PasswordTextFieldProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  error?: { message?: string };
  placeholder?: string;
}

const PasswordTextField = ({
  value,
  onChange,
  onBlur,
  error,
  placeholder = "",
}: PasswordTextFieldProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box>
      <Typography
        fontSize="12px"
        color={theme.palette.primary.light}
        fontWeight="bold"
        sx={{ marginBottom: "2px" }}
      >
        Password
      </Typography>
      <TextField
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        type={showPassword ? "text" : "password"}
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
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderRadius: "8px",
          },
          width: "100%",
        }}
        InputProps={{
          autoComplete: "off",
          endAdornment: (
            <InputAdornment position="end">
              <Button
                color={theme.palette.primary.main}
                onClick={handleShowPassword}
                padding="4px"
                hoverColor={theme.palette.primary.main}
                hoverBgColor={theme.palette.primary.contrastText}
                backgroundColor={theme.palette.primary.contrastText}
              >
                {showPassword ? <VisibilityOnIcon /> : <VisibilityOffIcon />}
              </Button>
            </InputAdornment>
          ),
          style: {
            caretColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
          },
        }}
      />
    </Box>
  );
};

export default PasswordTextField;
