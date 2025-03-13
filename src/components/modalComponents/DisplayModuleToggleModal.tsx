import { Box, lighten, Stack, Typography, useTheme } from "@mui/material";
import ActionModal from "./ActionModal";
import Button from "../../utilityComponents/Button";
import { capitalizeSentence } from "../../utils/utilityFunctions";

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

  //! something I've seen in a few places. The button props here have a lot of common props, they can be extracted into a variable and spread into the button components. Unless they are common across other files in which case a custom button built on top of your base button component is the way to go.

  /**
   * example:
   * const buttonProps = {
   *  height: "53px",
   *  backgroundColor: theme.palette.others.red,
   *  color: theme.palette.text.primary,
   *  hoverColor: theme.palette.text.primary,
   *  hoverBgColor: lighten(theme.palette.others.red, 0.2),
   * }
   *
   * <Button
   * {...buttonProps}
   * onClick={() => {
   * handleProceed();
   * onClose();
   * }}
   * >
   */
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
