import { useCallback, useContext, useEffect } from "react";
import CategoryMarkerContext from "../../context/CategoryMarkerContext";
import { MarkerTheme } from "../../types/Data";
import ActionModal from "./ActionModal";
import { Box, Stack, Typography } from "@mui/material";
import theme from "../../theme/theme";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { formatDecimalNumber, hexToRGBA } from "../../utils/utilityFunctions";
import ModalTextField from "./ModalTextField";
import Button from "../../utilityComponents/Button";
import ModalSelectDropdown from "./ModalSelectDropdown";
import { yupResolver } from "@hookform/resolvers/yup";

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
}

interface FormValues {
  potName: string;
  target: string;
  selectedTheme: string;
}

interface Option {
  value: string;
  label: string;
  used?: boolean;
  colorCode: string;
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
  markerTheme = "",
}: AddEditPotModalProps) => {
  // Access marker themes and categories from context.
  const { markerThemes } = useContext(CategoryMarkerContext);

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

  // Setup React Hook Form.
  const { control, handleSubmit, reset, trigger } = useForm<FormValues>({
    resolver: yupResolver(buildSchema(potNamesUsed)),
    mode: "onSubmit",
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
  }, [
    potName,
    targetVal,
    markerTheme,
    markerThemes,
    reset,
    getDefaultThemeName,
  ]);

  // Build dropdown options for marker themes.
  const themeOptions: Option[] = markerThemes.map((marker) => ({
    value: marker.name,
    label: marker.name,
    used: usedColorCodes.has(marker.colorCode.toLowerCase()),
    colorCode: marker.colorCode,
  }));

  // Form submission handler.
  const onSubmit = (data: FormValues) => {
    const selectedThemeCode =
      nameToColorCode.get(data.selectedTheme) || "#fffff";
    updatePots({
      potName: data.potName,
      target: data.target,
      markerTheme: selectedThemeCode,
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
                  onBlur={() => {
                    field.onBlur();
                    if (field.value.trim() !== "") {
                      trigger(field.name);
                    }
                  }}
                  error={error}
                  label={"Pot Name"}
                  maxLength={30}
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
                  onBlur={() => {
                    field.onBlur();
                    if (field.value.trim() !== "") {
                      trigger(field.name);
                    }
                  }}
                  error={error}
                  label="Target"
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

export default AddEditPotModal;
