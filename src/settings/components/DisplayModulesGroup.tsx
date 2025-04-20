import {
  FormControl,
  FormControlLabel,
  Checkbox,
  Stack,
  Typography,
  lighten,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { MD_BREAK } from "../../data/widthConstants";
import { DisplayedModules } from "../../types/settingsData";
import useModal from "../../customHooks/useModal";
import { useState } from "react";
import DisplayModuleToggleModal from "./DisplayModuleToggleModal";

interface DisplayModulesGroupProps {
  heading: string;
  displayOptions: DisplayedModules;
  onChange: (value: keyof DisplayedModules) => void;
  parentWidth: number;
}

const DisplayModulesGroup = ({
  heading,
  displayOptions,
  onChange,
  parentWidth,
}: DisplayModulesGroupProps) => {
  const theme = useTheme();
  const isMobile = parentWidth < MD_BREAK;
  const gridTemplateColumns = isMobile
    ? "1fr"
    : "repeat(auto-fit, minmax(250px, 1fr))";

  const [selectedModuleKey, setSelectedModuleKey] = useState<
    keyof DisplayedModules | null
  >(null);

  const { isOpen, openModal, closeModal } = useModal();

  // When a tile is clicked, check if it's currently enabled
  // If enabled (using is true), then we show the modal before unchecking
  // Otherwise, if it's not enabled, then toggle directly.
  const handleTileClick = (moduleKey: keyof DisplayedModules) => {
    if (displayOptions[moduleKey].using) {
      setSelectedModuleKey(moduleKey);
      openModal();
    } else {
      // Directly toggle if user is checking the module
      onChange(moduleKey);
    }
  };

  // When modal "Proceed" is clicked, call onChange for the selected module
  const handleModalProceed = () => {
    if (selectedModuleKey) {
      onChange(selectedModuleKey);
      setSelectedModuleKey(null);
    }
  };

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
        <Stack
          direction="row"
          gap="8px"
          sx={{
            display: "grid",
            gridTemplateColumns,
          }}
        >
          {Object.entries(displayOptions).map(([key, module]) => (
            <Grid key={key}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
                bgcolor={theme.palette.primary.contrastText}
                borderRadius="8px"
                padding={1}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: lighten(
                      theme.palette.background.default,
                      0.6
                    ),
                  },
                }}
                onClick={() => handleTileClick(key as keyof DisplayedModules)}
              >
                <Typography color={theme.palette.primary.light}>
                  {module.label}
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={module.using}
                      disableRipple
                      color="primary"
                    />
                  }
                  label=""
                />
              </Stack>
            </Grid>
          ))}
        </Stack>
      </FormControl>

      {isOpen && (
        <DisplayModuleToggleModal
          open={isOpen}
          onClose={() => {
            closeModal();
            setSelectedModuleKey(null);
          }}
          handleProceed={handleModalProceed}
          label={
            selectedModuleKey
              ? (displayOptions[selectedModuleKey].label as string)
              : ""
          }
        />
      )}
    </Stack>
  );
};

export default DisplayModulesGroup;
