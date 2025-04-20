import { useContext, useState } from "react";
import {
  Stack,
  Typography,
  IconButton,
  TextField,
  lighten,
  useTheme,
} from "@mui/material";
import EditIcon from "../../Icons/EditIcon";
import Button from "../../ui/Button";
import SubContainer from "../../ui/SubContainer";
import ChangePasswordModal from "./ChangePasswordModal";
import { AuthContext } from "../../context/AuthProvider";
import { User } from "../../types/User";

const UserAccountInfo = () => {
  const theme = useTheme();
  const { user, setUser } = useContext(AuthContext);
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>(user?.name || "");
  const [isPasswordModalOpen, setIsPasswordModalOpen] =
    useState<boolean>(false);

  const handleNameSave = () => {
    if (!user) return;
    const updatedUser: User = { ...user, name: editedName };
    setUser(updatedUser);
    setIsEditingName(false);
  };

  if (!user) return null;

  return (
    <SubContainer>
      <Typography
        fontSize="16px"
        fontWeight="bold"
        color={theme.palette.primary.main}
      >
        User Information
      </Typography>
      <Stack gap="20px">
        {/* Inline editable Name */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography fontSize="14px" color={theme.palette.primary.main}>
            Name :
          </Typography>
          {isEditingName ? (
            <>
              <TextField
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                size="small"
              />
              <Button
                onClick={handleNameSave}
                height="40px"
                padding="8px"
                backgroundColor={theme.palette.primary.main}
                color={theme.palette.text.primary}
                hoverColor={theme.palette.primary.light}
                hoverBgColor={lighten(theme.palette.primary.main, 0.2)}
              >
                Save
              </Button>
            </>
          ) : (
            <>
              <Typography fontSize={"14px"} color={theme.palette.primary.light}>
                {user.name}
              </Typography>
              <IconButton onClick={() => setIsEditingName(true)}>
                <EditIcon />
              </IconButton>
            </>
          )}
        </Stack>

        {/* Email (read-only) */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography fontSize="14px" color={theme.palette.primary.main}>
            Email :
          </Typography>
          <Typography fontSize="14px" color={theme.palette.primary.light}>
            {user.email}
          </Typography>
        </Stack>

        {/* Trigger password change modal */}
        <Button
          onClick={() => setIsPasswordModalOpen(true)}
          height="40px"
          padding="8px"
          backgroundColor={theme.palette.primary.main}
          color={theme.palette.text.primary}
          hoverColor={theme.palette.text.primary}
          hoverBgColor={lighten(theme.palette.primary.main, 0.2)}
        >
          <Typography
            fontSize="14px"
            fontWeight="bold"
            color={theme.palette.text.primary}
          >
            Change Password
          </Typography>
        </Button>
      </Stack>

      {isPasswordModalOpen && (
        <ChangePasswordModal
          open={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      )}
    </SubContainer>
  );
};

export default UserAccountInfo;
