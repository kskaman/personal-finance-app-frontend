import { useContext, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  InputAdornment,
  TextField,
  Stack,
  SelectChangeEvent,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ActionModal from "./ActionModal";
import theme from "../../theme/theme";
import CategoryMarkerContext from "../../context/CategoryMarkerContext";
import { Category, MarkerTheme } from "../../types/Data";
import Button from "../../utilityComponents/Button";
import { formatNumber, hexToRGBA } from "../../utils/utilityFunctions";

// -------------------------
// Types & Interfaces
// -------------------------
interface AddEditBudgetModalProps {
  open: boolean;
  onClose: () => void;
  updateBudget: (args: {
    category: string;
    maxSpend: string;
    markerTheme: string;
  }) => void;
  category?: string;
  markerTheme?: string;
  maximumSpend?: number;
  mode?: "edit" | "add" | null;
}

interface FormValues {
  category: string;
  maxSpend: string;
  selectedTheme: string;
}

// For the reusable dropdown options
interface Option {
  value: string;
  label: string;
  used?: boolean;
  colorCode?: string;
}

interface CustomSelectDropdownProps {
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  options: Option[];
  disabled?: boolean;
  isTheme?: boolean;
}

// -------------------------
// Reusable Select Dropdown Component
// -------------------------
const SelectDropdown = ({
  value,
  onChange,
  options,
  disabled = false,
  isTheme = false,
}: CustomSelectDropdownProps) => {
  // Sort options: used items are pushed to the bottom.
  const sortedOptions = [...options].sort((a, b) => {
    const aUsed = !!a.used;
    const bUsed = !!b.used;
    if (aUsed === bUsed) return 0;
    return aUsed ? 1 : -1;
  });

  return (
    <Box>
      <Select
        value={value}
        onChange={onChange}
        disabled={disabled}
        fullWidth
        sx={{
          borderRadius: "8px",
          height: "45px",
          display: "flex",
          alignItems: "center",
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
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
    </Box>
  );
};

// -------------------------
// Field Heading Component
// -------------------------
const FieldHeading = ({ heading }: { heading: string }) => (
  <Typography
    fontSize="12px"
    color={theme.palette.primary.light}
    fontWeight="bold"
  >
    {heading}
  </Typography>
);

// -------------------------
// Yup Schema for Validation
// -------------------------
const buildSchema = () =>
  yup.object({
    category: yup.string().required("Category is required"),
    maxSpend: yup
      .string()
      .matches(/^\d+(\.\d{0,2})?$/, "Enter a valid number (up to 2 decimals).")
      .required("Maximum spend is required"),
    selectedTheme: yup.string().required("Theme is required"),
  });

// -------------------------
// Main Add/Edit Budget Modal Component
// -------------------------
const AddEditBudgetModal = ({
  open,
  onClose,
  updateBudget,
  category,
  markerTheme,
  maximumSpend,
  mode = "edit",
}: AddEditBudgetModalProps) => {
  // Access marker themes and categories from context.
  const { markerThemes, categories } = useContext(CategoryMarkerContext);

  // Create a map for marker name to its lowercased color code.
  const nameToColorCode = new Map<string, string>(
    markerThemes.map((m) => [m.name, m.colorCode.toLowerCase()])
  );

  // Get default theme name based on provided markerTheme.
  const getDefaultThemeName = useCallback(() => {
    const markerObj = markerThemes.find(
      (m) => m.colorCode.toLowerCase() === markerTheme?.toLowerCase()
    );
    return markerObj?.name || "";
  }, [markerTheme, markerThemes]);

  const defaultThemeName = getDefaultThemeName();

  // Determine used color codes (for markers already used in budgets).
  const usedColorCodes = new Set(
    markerThemes
      .filter(
        (b: MarkerTheme) =>
          b.usedInBudgets &&
          b.colorCode.toLowerCase() !== markerTheme?.toLowerCase()
      )
      .map((b) => b.colorCode.toLowerCase())
  );

  // Determine categories already used (except current one).
  const UsedCategoriesNames = new Set(
    categories
      .filter((c: Category) => c.name !== category && c.usedInBudgets)
      .map((c) => c.name)
  );

  // Setup React Hook Form.
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(buildSchema()),
    mode: "onBlur",
    defaultValues: {
      category: category || "",
      maxSpend: maximumSpend ? formatNumber(maximumSpend).toString() : "0.00",
      selectedTheme: defaultThemeName,
    },
  });

  // Reset form when props change.
  useEffect(() => {
    reset({
      category: category || "",
      maxSpend: maximumSpend ? formatNumber(maximumSpend).toString() : "0.00",
      selectedTheme: getDefaultThemeName(),
    });
  }, [
    category,
    maximumSpend,
    markerTheme,
    markerThemes,
    reset,
    getDefaultThemeName,
  ]);

  // Form submission handler.
  const onSubmit = (data: FormValues) => {
    const selectedThemeCode =
      nameToColorCode.get(data.selectedTheme) || "#ffffff";
    updateBudget({
      category: data.category,
      maxSpend: data.maxSpend,
      markerTheme: selectedThemeCode,
    });
    onClose();
  };

  // Build dropdown options for categories.
  const categoryOptions: Option[] = categories.map((c) => ({
    value: c.name,
    label: c.name,
    used: UsedCategoriesNames.has(c.name),
  }));

  // Build dropdown options for marker themes.
  const themeOptions: Option[] = markerThemes.map((marker) => ({
    value: marker.name,
    label: marker.name,
    used: usedColorCodes.has(marker.colorCode.toLowerCase()),
    colorCode: marker.colorCode,
  }));

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      heading={`${mode === "edit" ? "Edit" : "Add New"} Budget`}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="20px">
          <Typography fontSize="14px" color={theme.palette.primary.light}>
            {mode === "edit"
              ? "As your budget changes, feel free to update your spending limits."
              : "Choose a category to set a spending budget. These categories can help you monitor spending."}
          </Typography>

          {/* CATEGORY FIELD */}
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Box>
                <FieldHeading heading="Budget Category" />
                <SelectDropdown
                  value={field.value}
                  onChange={field.onChange}
                  options={categoryOptions}
                  disabled={mode === "edit"}
                />
              </Box>
            )}
          />

          {/* MAXIMUM SPEND FIELD */}
          <Controller
            name="maxSpend"
            control={control}
            render={({ field }) => (
              <Box>
                <FieldHeading heading="Maximum Spend" />
                <TextField
                  {...field}
                  type="text"
                  variant="outlined"
                  placeholder="0.00"
                  error={!!errors.maxSpend}
                  helperText={errors.maxSpend?.message || ""}
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography
                          color={theme.palette.primary.light}
                          fontSize="14px"
                        >
                          $
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            )}
          />

          {/* THEME SELECTION FIELD */}
          <Controller
            name="selectedTheme"
            control={control}
            render={({ field }) => (
              <Box>
                <FieldHeading heading="Theme" />
                <SelectDropdown
                  value={field.value}
                  onChange={field.onChange}
                  options={themeOptions}
                  isTheme={true}
                />
              </Box>
            )}
          />

          {/* SAVE BUTTON */}
          <Button
            type="submit"
            width="100%"
            height="53px"
            backgroundColor={theme.palette.primary.main}
            onClick={() => {}}
            color={theme.palette.text.primary}
            hoverColor={theme.palette.text.primary}
            hoverBgColor={hexToRGBA(theme.palette.primary.main, 0.8)}
          >
            <Typography fontSize="14px" fontWeight="bold">
              Save Changes
            </Typography>
          </Button>
        </Stack>
      </form>
    </ActionModal>
  );
};

export default AddEditBudgetModal;
