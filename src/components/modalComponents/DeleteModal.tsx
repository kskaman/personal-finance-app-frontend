import { Box, Stack, Typography } from "@mui/material";
import ActionModal from "./ActionModal";
import theme from "../../theme/theme";
import Button from "../../utilityComponents/Button";
import { capitalizeSentence, hexToRGBA } from "../../utils/utilityFunctions";

interface Props {
  open: boolean;
  onClose: () => void;
  handleDelete: ({ category }: { category: string }) => void;
  label: string;
  type: string;
}

const DeleteModal = ({ open, onClose, handleDelete, label, type }: Props) => {
  const typedToken = capitalizeSentence(label);

  const onDelete = () => {
    handleDelete({ category: label });
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
          Are you sure you want to delete this {type}? This action cannot be
          reversed and all the data inside it will be removed forever.
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
            hoverBgColor={hexToRGBA(theme.palette.others.red, 0.8)}
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
