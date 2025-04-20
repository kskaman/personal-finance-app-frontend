import { Box, lighten, Stack, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router";
import { useContext } from "react";
import Button from "../../ui/Button";
import DeleteIcon from "../../Icons/DeleteIcon";
import DeleteModal from "../../ui/DeleteModal";
import ActionModal from "../../ui/ActionModal";
import useModal from "../../customHooks/useModal";
import { AuthContext } from "../../context/AuthProvider";

const DEMO_ACCOUNTS = ["john@example.com", "empty@example.com"];

const DeleteAccount = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const isDemo = user && DEMO_ACCOUNTS.includes(user?.email);

  // Confirmation modal (real users)
  const {
    isOpen: isConfirmOpen,
    openModal: openConfirm,
    closeModal: closeConfirm,
  } = useModal();

  // Blocked‑action modal (demo users)
  const {
    isOpen: isBlockedOpen,
    openModal: openBlocked,
    closeModal: closeBlocked,
  } = useModal();

  // Click handler
  const onDeleteClick = () => {
    return isDemo ? openBlocked() : openConfirm();
  };

  // Delete after confirmation
  const handleDeleteAccount = () => {
    // 👉🏽  Place API call here later (DELETE /users/:id)
    logout();
    navigate("/auth/login", { replace: true });
  };

  return (
    <>
      {/* Delete button */}
      <Button
        height="53px"
        padding="16px"
        backgroundColor={theme.palette.others.red}
        color={theme.palette.text.primary}
        onClick={onDeleteClick}
        hoverColor={theme.palette.text.primary}
        hoverBgColor={lighten(theme.palette.others.red, 0.2)}
      >
        <Stack direction="row" gap={1} alignItems="center">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "24px",
              height: "24px",
            }}
          >
            <DeleteIcon color="inherit" />
          </Box>
          <Typography noWrap fontSize="14px" fontWeight="bold">
            Delete&nbsp;Account
          </Typography>
        </Stack>
      </Button>

      {/* 1) Confirm‑delete for real users */}
      {isConfirmOpen && (
        <DeleteModal
          open={isConfirmOpen}
          onClose={closeConfirm}
          handleDelete={handleDeleteAccount}
          label={user?.name ?? "Account"}
          warningText={`Are you sure you want to delete your account? 
            This action cannot be reversed. All data will be removed and 
            you will be redirected to the sign‑in page.`}
          type="account"
        />
      )}

      {/* 2) Blocked‑delete for demo users */}
      {isBlockedOpen && (
        <ActionModal
          open={isBlockedOpen}
          onClose={closeBlocked}
          heading="Demo account - deletion disabled"
        >
          <Typography fontSize="14px" color={theme.palette.primary.light}>
            This demo account is provided for exploration only and cannot be
            deleted.
          </Typography>

          <Button
            width="100%"
            height="53px"
            backgroundColor={theme.palette.primary.main}
            color={theme.palette.text.primary}
            onClick={closeBlocked}
            hoverColor={theme.palette.text.primary}
            hoverBgColor={theme.palette.primary.light}
          >
            <Typography fontSize="14px" fontWeight="bold">
              OK
            </Typography>
          </Button>
        </ActionModal>
      )}
    </>
  );
};

export default DeleteAccount;
