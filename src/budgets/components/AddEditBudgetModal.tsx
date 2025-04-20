import { useEffect, useCallback, useMemo } from "react";
import { Box, Typography, Stack, lighten, useTheme } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Button from "../../ui/Button";
import ModalSelectDropdown from "../../ui/ModalSelectDropdown";
import { formatDecimalNumber } from "../../utils/utilityFunctions";
import ActionModal from "../../ui/ActionModal";
import ModalTextField from "../../ui/ModalTextField";

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
  // New props for options
  categoryOptions: { value: string; label: string; used?: boolean }[];
  themeOptions: {
    value: string;
    label: string;
    used?: boolean;
    colorCode?: string;
  }[];
}

interface FormValues {
  category: string;
  maxSpend: string;
  selectedTheme: string;
}

// Yup Schema for Validation remains the same.
const buildSchema = () =>
  yup.object({
    category: yup.string().required("Category is required"),
    maxSpend: yup
      .string()
      .matches(/^\d+(\.\d{0,2})?$/, "Enter a valid number (up to 2 decimals).")
      .test(
        "positive",
        "Maximum spend must be a positive number",
        (value) => Number(value) > 0
      )
      .required("Maximum spend is required"),
    selectedTheme: yup.string().required("Theme is required"),
  });

const AddEditBudgetModal = ({
  open,
  onClose,
  updateBudgets,
  category,
  markerTheme,
  maximumSpend,
  mode = "edit",
  categoryOptions,
  themeOptions,
}: AddEditBudgetModalProps) => {
  const theme = useTheme();
  const getDefaultThemeName = useCallback(() => {
    const defaultTheme = themeOptions.find(
      (t) =>
        t.value &&
        markerTheme &&
        t.value.toLowerCase() === markerTheme.toLowerCase()
    );
    return defaultTheme?.value || "";
  }, [markerTheme, themeOptions]);

  const defaultThemeName = getDefaultThemeName();

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: yupResolver(buildSchema()),
    mode: "onChange",
    defaultValues: {
      category: category || "",
      maxSpend: maximumSpend
        ? formatDecimalNumber(maximumSpend).toString()
        : "",
      selectedTheme: defaultThemeName,
    },
  });

  // Compute filtered category options
  const filteredCategoryOptions = useMemo(() => {
    return categoryOptions.map((cat) => {
      // Example logic: If it's the currently selected category in 'edit' mode,
      // mark it as unused so the user can still see & pick it
      if (mode === "edit" && cat.value === category) {
        return { ...cat, used: false };
      }
      // Otherwise, return cat as is (or update 'used' per your logic)
      return cat;
    });
  }, [categoryOptions, category, mode]);

  // Compute filtered theme options
  const filteredThemeOptions = useMemo(() => {
    return themeOptions.map((themeOpt) => {
      // If this theme is the currently selected theme,
      // ensure it's allowed (e.g. "used: false") so user can keep it
      if (
        mode === "edit" &&
        markerTheme &&
        themeOpt.value.toLowerCase() === markerTheme.toLowerCase()
      ) {
        return { ...themeOpt, used: false };
      }
      // Otherwise return as is (or adjust as needed)
      return themeOpt;
    });
  }, [themeOptions, markerTheme, mode]);

  useEffect(() => {
    reset({
      category: category || "",
      maxSpend: maximumSpend
        ? formatDecimalNumber(maximumSpend).toString()
        : "",

      selectedTheme: getDefaultThemeName(),
    });
  }, [
    category,
    maximumSpend,
    markerTheme,
    reset,
    getDefaultThemeName,
    categoryOptions,
  ]);

  const onSubmit = (data: FormValues) => {
    // Convert selected theme to color code using the passed in options.
    const selectedThemeOption = themeOptions.find(
      (option) => option.value === data.selectedTheme
    );
    const selectedThemeCode = selectedThemeOption?.colorCode || "#ffffff";

    updateBudgets({
      category: data.category,
      maxSpend: data.maxSpend,
      markerTheme: selectedThemeCode,
    });
    onClose();
  };

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
            render={({ field, fieldState: { error } }) => (
              <Box>
                <ModalSelectDropdown
                  value={field.value}
                  onChange={field.onChange}
                  options={filteredCategoryOptions}
                  isDisabled={mode === "edit"}
                  label={"Budget Category"}
                  error={error}
                />
              </Box>
            )}
          />

          {/* MAXIMUM SPEND FIELD */}
          <Controller
            name="maxSpend"
            control={control}
            render={({ field, fieldState: { error } }) => {
              return (
                <Box>
                  <ModalTextField
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={error}
                    label="Maximum Spend"
                    placeholder="0.00"
                    adornmentTextFlag={true}
                  />
                </Box>
              );
            }}
          />

          {/* THEME SELECTION FIELD */}
          <Controller
            name="selectedTheme"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Box>
                <ModalSelectDropdown
                  value={field.value}
                  onChange={field.onChange}
                  options={filteredThemeOptions}
                  isTheme={true}
                  label={"Theme"}
                  error={error}
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
            hoverBgColor={lighten(theme.palette.primary.main, 0.2)}
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
