import { Modal, Typography, Stack } from "@mui/material";
import theme from "../../theme/theme";
import Button from "../../utilityComponents/Button";
import CloseModalIcon from "../../Icons/CloseModalIcon";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ActionModal = ({ open, onClose }: Props) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Stack
        gap="20px"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "560px" },
          bgcolor: theme.palette.text.primary,
          padding: { xs: "20px 24px", sm: "32px" },
          borderRadius: "12px",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography fontSize="20px" fontWeight="bold">
            Modal Heading
          </Typography>

          <Button
            color={"inherit"}
            onClick={onClose}
            hoverColor={"none"}
            hoverBgColor={"none"}
            borderColor={theme.palette.text.primary}
          >
            <CloseModalIcon />
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default ActionModal;
