import { useCallback, useEffect } from "react";
import { Box, lighten, Stack, Typography, useTheme } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { formatDecimalNumber } from "../../utils/utilityFunctions";
import Button from "../../ui/Button";
import ModalSelectDropdown from "../../ui/ModalSelectDropdown";
import { yupResolver } from "@hookform/resolvers/yup";
import ActionModal from "../../ui/ActionModal";
import ModalTextField from "../../ui/ModalTextField";

// Types & Interfaces
interface AddEditPotModalProps {
  open: boolean;
  onClose: () => void;
  potNamesUsed: string[];
  potName?: string;
  targetVal?: number;
  mode?: "edit" | "add" | null;
  markerTheme?: string;
  updatePots: (args: {
    potName: string;
    target: string;
    markerTheme: string;
  }) => void;
  themeOptions: {
    value: string;
    label: string;
    used: boolean;
    colorCode: string;
  }[];
}

interface FormValues {
  potName: string;
  target: string;
  selectedTheme: string;
}

// Yup Schema for Validation
const buildSchema = (usedPotNames: string[]) =>
  yup.object({
    potName: yup
      .string()
      .required("Pot Name is required")
      .test("unique", "Pot name already in use", function (value) {
        if (value && usedPotNames.includes(value.toLowerCase())) {
          return false;
        }
        return true;
      }),
    target: yup
      .string()
      .matches(
        /^\d+(\.\d{0, 2})?$/,
        "Enter a valid number (up to 2 decimal places)."
      )
      .test(
        "positive",
        "Target must be a positive number",
        (value) => Number(value) > 0
      )
      .required("Target is required"),
    selectedTheme: yup.string().required("Theme is required"),
  });

// Add Edit Pot Modal
const AddEditPotModal = ({
  open,
  onClose,
  updatePots,

  potNamesUsed,
  mode = "edit",
  potName,
  targetVal,
  themeOptions,
  markerTheme = "",
}: AddEditPotModalProps) => {
  const theme = useTheme();
  // Get default theme name based on provided markerTheme.
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

  // Setup React Hook Form.
  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: yupResolver(buildSchema(potNamesUsed)),
    mode: "onChange",
    defaultValues: {
      potName: potName || "",
      target: targetVal ? formatDecimalNumber(targetVal).toString() : "",
      selectedTheme: defaultThemeName,
    },
  });

  // Reset Form when props change.
  useEffect(() => {
    reset({
      potName: potName || "",
      target: targetVal ? formatDecimalNumber(targetVal).toString() : "",
      selectedTheme: getDefaultThemeName(),
    });
  }, [potName, targetVal, markerTheme, reset, getDefaultThemeName]);

  // Form submission handler.
  const onSubmit = (data: FormValues) => {
    const selectedThemeOption = themeOptions.find(
      (option) => option.value === data.selectedTheme
    );
    updatePots({
      potName: data.potName,
      target: data.target,
      markerTheme: selectedThemeOption?.colorCode || "#ffffff",
    });
    onClose();
  };

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      heading={mode === "edit" ? "Edit Pot" : "Add New Pot"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="20px">
          <Typography fontSize="14px" color={theme.palette.primary.light}>
            {mode === "edit"
              ? "If your saving targets change, feel free to update your pots."
              : "Create a pot to set savings targets. These can help keep you on track as you save for special purchases."}
          </Typography>

          {/* POT NAME */}
          <Controller
            name="potName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Stack position="relative">
                <ModalTextField
                  value={field.value}
                  onChange={(e) => {
                    if (e.target.value.length <= 30) {
                      field.onChange(e);
                    }
                  }}
                  onBlur={field.onBlur}
                  error={error}
                  label={"Pot Name"}
                  maxLength={30}
                  adornmentTextFlag={false}
                />
                <Typography
                  fontSize="12px"
                  color={theme.palette.primary.light}
                  marginLeft="auto"
                  marginTop="1px"
                >
                  {`${30 - field.value.length} characters left`}
                </Typography>
              </Stack>
            )}
          />

          {/* TARGET FIELD */}
          <Controller
            name="target"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Box>
                <ModalTextField
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={error}
                  label="Target"
                  placeholder="0.00"
                  adornmentTextFlag={true}
                />
              </Box>
            )}
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
                  options={themeOptions}
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

export default AddEditPotModal;
