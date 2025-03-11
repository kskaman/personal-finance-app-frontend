import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

// For the reusable dropdown options
interface Option {
  value: string;
  label: string;
  used?: boolean;
  colorCode?: string;
}

interface ModalSelectDropdownProps {
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  options: Option[];
  label?: string;
  isDisabled?: boolean;
  isTheme?: boolean;
  error?: { message?: string };
}

const ModalSelectDropdown = ({
  value,
  onChange,
  options,
  label = "",
  error,
  isDisabled = false,
  isTheme = false,
}: ModalSelectDropdownProps) => {
  const theme = useTheme();
  // Sort options: used items are pushed to the bottom.
  const sortedOptions = [...options].sort((a, b) => {
    const aUsed = !!a.used;
    const bUsed = !!b.used;
    if (aUsed === bUsed) return 0;
    return aUsed ? 1 : -1;
  });

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
      <Select
        value={value}
        onChange={onChange}
        disabled={isDisabled}
        fullWidth
        error={!!error}
        sx={{
          borderRadius: "8px",
          height: "45px",
          display: "flex",
          alignItems: "center",
          color: theme.palette.primary.main,

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: theme.palette.primary.contrastText,
              minHeight: "auto",
              maxHeight: "250px",
              overflowY: "auto",
              mt: "8px", // gap between select and dropdown
              borderRadius: "8px",
              padding: "12px 20px",
              minWidth: "60px",
              maxWidth: "fit-content",
            },
          },
        }}
      >
        {sortedOptions.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            disabled={option.used}
            disableRipple
            sx={{
              fontSize: "14px",
              color: option.used
                ? theme.palette.primary.light
                : theme.palette.primary.main,
              padding: "12px 0",
              borderBottom: `1px solid ${theme.palette.secondary.contrastText}`,
              "&:last-child": { borderBottom: "none" },
              "&:hover": { backgroundColor: "transparent" },
              "&.Mui-selected": {
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: "transparent" },
              },
            }}
          >
            <Stack
              direction="row"
              width="100%"
              margin="0 8px"
              alignItems="center"
            >
              {isTheme && (
                <Box marginRight="16px">
                  <Box
                    width="16px"
                    height="16px"
                    borderRadius="50%"
                    bgcolor={option.colorCode}
                  />
                </Box>
              )}
              <Typography>{option.label}</Typography>
              {option.used && (
                <Typography marginLeft="auto">(Already Used)</Typography>
              )}
            </Stack>
          </MenuItem>
        ))}
      </Select>
      {error && (
        <Typography
          marginLeft="12px"
          variant="caption"
          color="error"
          sx={{ mt: 1 }}
        >
          {error.message}
        </Typography>
      )}
    </Box>
  );
};

export default ModalSelectDropdown;
