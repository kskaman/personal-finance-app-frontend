import { useContext, useEffect, useCallback } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ActionModal from "./ActionModal";
import theme from "../../theme/theme";
import CategoryMarkerContext from "../../context/CategoryMarkerContext";
import { Category, MarkerTheme } from "../../types/Data";
import Button from "../../utilityComponents/Button";
import { formatDecimalNumber, hexToRGBA } from "../../utils/utilityFunctions";
import ModalSelectDropdown from "./ModalSelectDropdown";
import ModalTextField from "./ModalTextField";

// Types & Interfaces
interface AddEditBudgetModalProps {
  open: boolean;
  onClose: () => void;
  updateBudgets: (args: {
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

interface Option {
  value: string;
  label: string;
  used?: boolean;
  colorCode?: string;
}

// Yup Schema for Validation
const buildSchema = () =>
  yup.object({
    category: yup.string().required("Category is required"),
    maxSpend: yup
      .string()
      .matches(/^\d+(\.\d{0,2})?$/, "Enter a valid number (up to 2 decimals).")
      .required("Maximum spend is required"),
    selectedTheme: yup.string().required("Theme is required"),
  });

// Add/Edit Budget Modal Component
const AddEditBudgetModal = ({
  open,
  onClose,
  updateBudgets,
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
  const { control, handleSubmit, reset, trigger } = useForm<FormValues>({
    resolver: yupResolver(buildSchema()),
    mode: "onSubmit",
    defaultValues: {
      category: category || "",
      maxSpend: maximumSpend
        ? formatDecimalNumber(maximumSpend).toString()
        : "",
      selectedTheme: defaultThemeName,
    },
  });

  // Reset form when props change.
  useEffect(() => {
    reset({
      category: category || "",
      maxSpend: maximumSpend
        ? formatDecimalNumber(maximumSpend).toString()
        : "0.00",
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
    updateBudgets({
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
                <ModalSelectDropdown
                  value={field.value}
                  onChange={field.onChange}
                  options={categoryOptions}
                  disabled={mode === "edit"}
                  label={"Budget Category"}
                />
              </Box>
            )}
          />

          {/* MAXIMUM SPEND FIELD */}
          <Controller
            name="maxSpend"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Box>
                <ModalTextField
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={() => {
                    field.onBlur();
                    if (field.value.trim() !== "") {
                      trigger(field.name);
                    }
                  }}
                  error={error}
                  label="Maximum Spend"
                  placeholder="0.00"
                  adornmentText="$"
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
                <ModalSelectDropdown
                  value={field.value}
                  onChange={field.onChange}
                  options={themeOptions}
                  isTheme={true}
                  label={"Theme"}
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
