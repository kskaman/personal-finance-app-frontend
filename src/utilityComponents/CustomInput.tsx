import { InputAdornment, TextField } from "@mui/material";

interface Props {
  placeholder: string;
  value: string;
  width: object;
  Icon: React.FC<{ color: string }>;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInput = ({ placeholder, value, width, onChange, Icon }: Props) => {
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

export default CustomInput;
