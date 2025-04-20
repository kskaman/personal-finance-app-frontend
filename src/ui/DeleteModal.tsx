import { Box, lighten, Stack, Typography, useTheme } from "@mui/material";
import ActionModal from "./ActionModal";
import Button from "./Button";
import { capitalizeSentence } from "../utils/utilityFunctions";

interface Props {
  open: boolean;
  onClose: () => void;
  handleDelete: () => void;
  label: string;
  type: string;
  warningText?: string;
}

const DeleteModal = ({
  open,
  onClose,
  handleDelete,
  warningText,
  label,
  type,
}: Props) => {
  const theme = useTheme();
  const typedToken = capitalizeSentence(label);

  const onDelete = () => {
    handleDelete();
    onClose();
  };

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      heading={`Delete '${typedToken}'`}
    >
      <Stack gap="32px">
        <Typography fontSize="14px" color={theme.palette.primary.light}>
          {warningText
            ? warningText
            : `Are you sure you want to delete this ${type}? This action cannot be
          reversed and all the data inside it will be removed forever.`}
        </Typography>

        <Box>
          <Button
            width="100%"
            height="53px"
            backgroundColor={theme.palette.others.red}
            color={theme.palette.text.primary}
            onClick={() => {
              onDelete();
              onClose();
            }}
            hoverColor={theme.palette.text.primary}
            hoverBgColor={lighten(theme.palette.others.red, 0.2)}
          >
            <Typography fontSize="14px" fontWeight="bold">
              Yes, Confirm Delete
            </Typography>
          </Button>

          <Button
            width="100%"
            height="53px"
            backgroundColor={theme.palette.text.primary}
            color={theme.palette.primary.light}
            onClick={onClose}
            hoverColor={theme.palette.primary.light}
            hoverBgColor={theme.palette.text.primary}
          >
            <Typography fontSize="14px" fontWeight="bold">
              No, Go Back
            </Typography>
          </Button>
        </Box>
      </Stack>
    </ActionModal>
  );
};

export default DeleteModal;
