import {
  FormControl,
  FormControlLabel,
  lighten,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { SettingsRadioOption } from "../../types/settingsData";
import { MD_BREAK } from "../../data/widthConstants";

interface SettingOptionGroupProp {
  heading: string;
  options: SettingsRadioOption[];
  selectedValue: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  parentWidth: number;
}

// A reusable component for each option group
const SettingsOptionGroup = ({
  heading,
  options,
  selectedValue,
  onChange,
  parentWidth,
}: SettingOptionGroupProp) => {
  const theme = useTheme();
  const isParentWidth = parentWidth < MD_BREAK;
  const gridTemplateColumns = isParentWidth
    ? "1fr"
    : "repeat(auto-fit, minmax(250px, 1fr))";
  return (
    <Stack gap="20px">
      <Typography
        fontSize="16px"
        fontWeight="bold"
        color={theme.palette.primary.main}
      >
        {heading}
      </Typography>
      <FormControl component="fieldset">
        <RadioGroup
          value={selectedValue}
          onChange={onChange}
          sx={{
            display: "grid",
            gridTemplateColumns,
            gap: "8px",
          }}
        >
          {options.map((option) => (
            <Grid
              key={option.value}
              onClick={() => {
                onChange({
                  target: { value: option.value },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              size={4}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                width={"100%"}
                bgcolor={
                  selectedValue === option.value
                    ? theme.palette.background.default
                    : theme.palette.primary.contrastText
                }
                borderRadius="8px"
                padding={1}
                flex={1}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: lighten(theme.palette.background.default, 0.6),
                  },
                }}
              >
                <Stack direction="row" gap={1} alignItems="center">
                  <Stack
                    bgcolor={theme.palette.primary.contrastText}
                    height="32px"
                    width="32px"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="8px"
                  >
                    {option.symbol}
                  </Stack>
                  {option.label}
                </Stack>
                <FormControlLabel
                  value={option.value}
                  control={<Radio disableRipple />}
                  label=""
                />
              </Stack>
            </Grid>
          ))}
        </RadioGroup>
      </FormControl>
    </Stack>
  );
};

export default SettingsOptionGroup;
