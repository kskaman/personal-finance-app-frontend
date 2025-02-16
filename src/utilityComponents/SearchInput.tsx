import { InputAdornment, TextField } from "@mui/material";
import theme from "../theme/theme";

interface Props {
  placeholder: string;
  value: string;
  width: object;
  Icon: React.FC<{ color: string }>;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput = ({ placeholder, value, width, onChange, Icon }: Props) => {
  return (
    <TextField
      variant="outlined"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px", // Apply border-radius to input
          height: "100%",
          "&.Mui-focused": {
            "& .MuiOutlinedInput-notchedOutline": {
              // Apply to the fieldset border, on focus
              borderColor: theme.palette.primary.main,
            },
          },
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderRadius: "8px", // Apply border-radius to fieldset (outline)
        },
        width: width,
      }}
      slotProps={{
        input: {
          autoComplete: "off", // Disable autocomplete suggestions
          endAdornment: (
            <InputAdornment position="end">
              <Icon color="inherit" />
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default SearchInput;
