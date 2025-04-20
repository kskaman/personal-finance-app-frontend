import { Modal, Typography, Stack, useTheme } from "@mui/material";
import Button from "./Button";
import CloseModalIcon from "../Icons/CloseModalIcon";

interface Props {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  heading: string;
}

const ActionModal = ({ open, onClose, children, heading }: Props) => {
  const theme = useTheme();
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        marginY: "32px",
      }}
    >
      <Stack
        gap="20px"
        maxHeight={{ xs: "85vh", sm: "95vh" }}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          overFlowY: "hidden",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "560px" },
          bgcolor: theme.palette.text.primary,
          padding: { xs: "20px 24px", sm: "32px" },
          borderRadius: "12px",
          overflow: "auto",
          outline: "none",
          "&:focus": {
            outline: "none",
            border: "none",
          },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            fontSize="20px"
            fontWeight="bold"
            color={theme.palette.primary.main}
          >
            {heading}
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
        {children}
      </Stack>
    </Modal>
  );
};

export default ActionModal;
