import {
  FormControl,
  FormControlLabel,
  lighten,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { SettingsRadioOption } from "../../types/settingsData";
import theme from "../../theme/theme";
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
  const isParentWidth = parentWidth < MD_BREAK;
  return (
    <Stack gap={2}>
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
            display: "flex",
            flexDirection: isParentWidth ? "column" : "row",
            gap: "8px",
          }}
        >
          {options.map((option) => (
            <Stack
              key={option.value}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              onClick={() => {
                onChange({
                  target: { value: option.value },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              bgcolor={
                selectedValue === option.value
                  ? theme.palette.background.default
                  : theme.palette.text.primary
              }
              borderRadius={"8px"}
              padding={1}
              flex={1}
              sx={{
                cursor: "pointer",
                "&:hover": {
                  bgcolor: lighten(theme.palette.background.default, 0.75),
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
                <Typography fontSize="14px" color={theme.palette.primary.main}>
                  {option.label}
                </Typography>
              </Stack>
              <FormControlLabel
                value={option.value}
                control={<Radio disableRipple />}
                label=""
              />
            </Stack>
          ))}
        </RadioGroup>
      </FormControl>
    </Stack>
  );
};

export default SettingsOptionGroup;
