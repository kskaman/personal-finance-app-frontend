import { Box, lighten, Stack, Typography, useTheme } from "@mui/material";
import Button from "../../ui/Button";
import { capitalizeSentence } from "../../utils/utilityFunctions";
import ActionModal from "../../ui/ActionModal";

interface Props {
  open: boolean;
  onClose: () => void;
  handleProceed: () => void;
  label: string;
}

const DisplayModuleToggleModal = ({
  open,
  onClose,
  handleProceed,
  label,
}: Props) => {
  const theme = useTheme();
  const typedLabel = capitalizeSentence(label);
  return (
    <ActionModal
      open={open}
      onClose={onClose}
      heading={`Confirm Change for '${typedLabel}'`}
    >
      <Stack gap="32px">
        <Typography fontSize="14px" color={theme.palette.primary.light}>
          {`Unchecking this feature will remove 
                  the corresponding page from the navigation. 
                  Your data will remain saved for future reference, 
                  although monthly 
                  statistics may change based on available transactions.`}
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            flex={1}
            height="53px"
            backgroundColor={theme.palette.others.red}
            color={theme.palette.text.primary}
            onClick={() => {
              handleProceed();
              onClose();
            }}
            hoverColor={theme.palette.text.primary}
            hoverBgColor={lighten(theme.palette.others.red, 0.2)}
          >
            <Typography fontSize="14px" fontWeight="bold">
              Proceed
            </Typography>
          </Button>
          <Button
            flex={1}
            height="53px"
            backgroundColor={theme.palette.text.primary}
            color={theme.palette.primary.light}
            onClick={onClose}
            hoverColor={theme.palette.primary.light}
            hoverBgColor={theme.palette.text.primary}
          >
            <Typography fontSize="14px" fontWeight="bold">
              Cancel
            </Typography>
          </Button>
        </Box>
      </Stack>
    </ActionModal>
  );
};

export default DisplayModuleToggleModal;
