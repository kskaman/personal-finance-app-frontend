import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

interface Props {
  label?: string;
  options: string[];
  value: string;
  width?: string;
  color: string;
  onChange: (event: SelectChangeEvent) => void;
}

const CustomDropdown = ({
  label,
  options,
  value,
  width,
  color,
  onChange,
}: Props) => {
  return (
    <FormControl sx={{ width: width || "100%", height: "100%" }}>
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
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{ fontSize: "14px", color: { color } }}
          >
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomDropdown;
