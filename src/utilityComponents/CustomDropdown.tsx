import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  useTheme,
} from "@mui/material";

interface Props {
  label?: string;
  options: string[];
  value: string;
  width?: string;
  height?: string;
  color: string;
  onChange: (event: SelectChangeEvent) => void;
}

const CustomDropdown = ({
  label,
  options,
  value,
  width,
  height = "100%",
  color,
  onChange,
}: Props) => {
  const theme = useTheme();
  return (
    <FormControl sx={{ width: width, height }}>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        value={value}
        onChange={onChange}
        id={`${label}-custom-dropdown`}
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          borderRadius: "8px",
          color: theme.palette.primary.main,
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "primary.main",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "primary.main",
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              minHeight: "auto",
              maxHeight: "250px",
              overflowY: "auto",
              bgcolor: theme.palette.primary.contrastText,
              mt: "8px", // gap between select and dropdown
              borderRadius: "8px",
              padding: "12px 20px",
              minWidth: "60px",
              maxWidth: "fit-content",
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            disableRipple
            key={option}
            value={option}
            sx={{
              fontSize: "14px",
              fontWeight: value === option ? "bold" : "normal",
              color: { color },
              padding: "12px 0",
              borderBottom: `1px solid ${theme.palette.secondary.contrastText}`,
              "&:last-child": { borderBottom: "none" },
              "&:hover": { backgroundColor: "transparent" }, // Remove hover background
              "&.Mui-selected": {
                backgroundColor: "transparent", // Remove active background
                "&:hover": { backgroundColor: "transparent" },
              },
              // Remove background when navigating with keyboard
              "&.Mui-focusVisible": { backgroundColor: "transparent" },
              // Remove blue background when selected
              "&.Mui-selected.Mui-focusVisible": {
                backgroundColor: "transparent",
              },
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomDropdown;
