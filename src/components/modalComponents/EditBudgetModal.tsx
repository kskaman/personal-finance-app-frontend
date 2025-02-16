import { useContext, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  InputAdornment,
  TextField,
  Stack,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ActionModal from "../../components/modalComponents/ActionModal";
import theme from "../../theme/theme";
import CategoryMarkerContext from "../../context/CategoryMarkerContext";
import { MarkerTheme } from "../../types/Data";
import Button from "../../utilityComponents/Button"; // Custom button
import { formatNumber, hexToRGBA } from "../../utils/utilityFunctions";

interface EditBudgetModalProps {
  open: boolean;
  onClose: () => void;
  updateBudget: ({
    category,
    maxSpend,
    markerTheme,
  }: {
    category: string;
    maxSpend: string;
    markerTheme: string;
  }) => void;
  category: string;
  markerTheme: string;
  maximumSpend: number;
}

/**
 * Define the shape of our form data.
 * Keep maxSpend as a string for the sake of regex validation.
 */
interface FormValues {
  category: string;
  maxSpend: string;
  selectedTheme: string;
}

/**
 * A helper field for heading labels.
 */
const FieldHeading = ({ heading }: { heading: string }) => (
  <Typography
    fontSize="12px"
    color={theme.palette.primary.light}
    fontWeight="bold"
  >
    {heading}
  </Typography>
);

/**
 * 1) Construct a Yup schema that:
 * - Requires "category".
 * - Validates "maxSpend" as an optional decimal up to two places.
 * - Requires "selectedTheme".
 */
const buildSchema = () =>
  yup.object({
    category: yup.string().required("Category is required"),
    maxSpend: yup
      .string()
      .matches(/^\d+(\.\d{0,2})?$/, "Enter a valid number (up to 2 decimals).")
      .required("Maximum spend is required"),
    selectedTheme: yup.string().required("Theme is required"),
  });

const EditBudgetModal = ({
  open,
  onClose,
  updateBudget,
  category,
  markerTheme,
  maximumSpend,
}: EditBudgetModalProps) => {
  /**
   * Access the markerThemes array from context.
   * markerThemes is typically an array of objects: { name: string; colorCode: string; usedInBudgets?: boolean; ... }
   */
  const { markerThemes } = useContext(CategoryMarkerContext);

  // A map from markerName to colorCode:
  const nameToColorCode = new Map<string, string>(
    markerThemes.map((m) => [m.name, m.colorCode.toLowerCase()])
  );

  /**
   * 1. Figure out the "default theme name" from the color code in `markerTheme`.
   *    E.g., if markerTheme = "#277C78" we want to find the marker that has colorCode "#277c78".
   */
  const getDefaultThemeName = useCallback(() => {
    const markerObj = markerThemes.find(
      (m) => m.colorCode.toLowerCase() === markerTheme.toLowerCase()
    );
    return markerObj?.name || "";
  }, [markerTheme, markerThemes]);

  // We'll assume that a marker is "used" if b.usedInBudgets = true, and it's not the current one.
  // So we collect the color codes (lowercase) of all used markers, except the one that matches the default theme.
  const defaultThemeName = getDefaultThemeName();

  const usedColorCodes = new Set(
    markerThemes
      .filter(
        (b: MarkerTheme) =>
          b.usedInBudgets &&
          b.colorCode.toLowerCase() !== markerTheme.toLowerCase()
      )
      .map((b) => b.colorCode.toLowerCase())
  );

  /**
   * 4. Initialize React Hook Form
   *    - We use the yupResolver for validation
   *    - mode: "onBlur" means we won't see errors for
   *      partial input until the field loses focus
   *      or the form is submitted.
   */
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(buildSchema()),
    mode: "onBlur", // or "onSubmit", whichever you prefer
    defaultValues: {
      category: category,
      maxSpend: formatNumber(maximumSpend).toString(),
      selectedTheme: defaultThemeName,
    },
  });

  /**
   * 5. If the props for category, markerTheme, or maximumSpend change,
   *    reset the form with the new defaults.
   */
  useEffect(() => {
    reset({
      category: category,
      maxSpend: formatNumber(maximumSpend).toString(),
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

  /**
   * 6. Submission handler. We can parse maxSpend to a number here.
   */
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

  return (
    <ActionModal open={open} onClose={onClose} heading="Edit Budget">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="20px">
          <Typography fontSize="14px" color={theme.palette.primary.light}>
            As your budget changes, feel free to update your spending limits.
          </Typography>

          {/* CATEGORY FIELD (disabled, but part of the form) */}
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Box>
                <FieldHeading heading="Budget Category" />
                <Select
                  {...field}
                  disabled
                  fullWidth
                  sx={{
                    backgroundColor: theme.palette.grey[200],
                    color: theme.palette.text.primary,
                    borderRadius: "8px",
                    height: "45px",
                  }}
                  error={!!errors.category}
                >
                  <MenuItem value={category}>{category}</MenuItem>
                </Select>
              </Box>
            )}
          />

          {/* MAX SPEND FIELD (numeric input, validated by Yup regex) */}
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
                  slotProps={{
                    input: {
                      autoComplete: "off",
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
                    },
                  }}
                />
              </Box>
            )}
          />

          {/* THEME SELECTION (must not pick a used theme) */}
          <Controller
            name="selectedTheme"
            control={control}
            render={({ field }) => (
              <Box>
                <FieldHeading heading="Theme" />
                <Select
                  {...field}
                  fullWidth
                  displayEmpty
                  sx={{
                    borderRadius: "8px",
                    height: "45px",
                    display: "flex",
                    alignItems: "center",
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                  error={!!errors.selectedTheme}
                >
                  {/* Show all markerThemes. Disable if the colorCode is in usedColorCodes */}
                  {markerThemes.map((marker) => {
                    const markerColorLower = marker.colorCode.toLowerCase();
                    const isDisabled = usedColorCodes.has(markerColorLower);
                    return (
                      <MenuItem
                        key={marker.name}
                        value={marker.name}
                        disabled={isDisabled}
                        sx={{
                          fontSize: "14px",
                          color: isDisabled
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
                          "&.Mui-focusVisible": {
                            backgroundColor: "transparent",
                          },
                          "&.Mui-selected.Mui-focusVisible": {
                            backgroundColor: "transparent",
                          },
                        }}
                      >
                        <Stack
                          width="100%"
                          direction="row"
                          margin="0 8px"
                          alignItems="center"
                        >
                          <Box marginRight="16px">
                            <Box
                              width="16px"
                              height="16px"
                              borderRadius="50%"
                              bgcolor={marker.colorCode}
                            />
                          </Box>
                          <Typography>{marker.name}</Typography>
                          <Typography marginLeft="auto">
                            {isDisabled ? "(Already Used)" : ""}
                          </Typography>
                        </Stack>
                      </MenuItem>
                    );
                  })}
                </Select>
              </Box>
            )}
          />

          {/* SAVE BUTTON */}
          <Button
            type="submit"
            width="100%"
            height="53px"
            backgroundColor={theme.palette.primary.main}
            color={theme.palette.text.primary}
            hoverColor={theme.palette.text.primary}
            hoverBgColor={hexToRGBA(theme.palette.primary.main, 0.8)}
            onClick={() => {}}
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

export default EditBudgetModal;
