import { useState } from "react";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import { grey500, grey900, white } from "../theme/colors";
import Button from "./Button";
import VisibilityOnIcon from "../Icons/VisibilityOnIcon";
import VisibilityOffIcon from "../Icons/VisibilityOffIcon";
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
        color={grey500}
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
              borderColor: grey900,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: grey900,
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
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  color={grey900}
                  onClick={handleShowPassword}
                  padding="4px"
                  hoverColor={grey900}
                  hoverBgColor={white}
                  backgroundColor={white}
                >
                  {showPassword ? <VisibilityOnIcon /> : <VisibilityOffIcon />}
                </Button>
              </InputAdornment>
            ),
            style: {
              caretColor: grey900,
              color: grey900,
            },
          },
        }}
      />
    </Box>
  );
};

export default PasswordTextField;
