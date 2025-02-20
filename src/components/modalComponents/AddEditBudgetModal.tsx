// AddEditBudgetModal.tsx
import { useEffect, useCallback } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ActionModal from "./ActionModal";
import theme from "../../theme/theme";
import Button from "../../utilityComponents/Button";
import ModalSelectDropdown from "./ModalSelectDropdown";
import ModalTextField from "./ModalTextField";
import { formatDecimalNumber, hexToRGBA } from "../../utils/utilityFunctions";

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

  useEffect(() => {
    reset({
      category: category || "",
      maxSpend: maximumSpend
        ? formatDecimalNumber(maximumSpend).toString()
        : "",

      selectedTheme: getDefaultThemeName(),
    });
  }, [category, maximumSpend, markerTheme, reset, getDefaultThemeName]);

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
