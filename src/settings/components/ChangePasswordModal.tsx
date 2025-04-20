import { lighten, Stack, Typography, useTheme } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "../../ui/Button";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { User } from "../../types/User";
import ActionModal from "../../ui/ActionModal";
import PasswordTextField from "../../ui/PasswordTextField";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@_])[A-Za-z\d#@_]{8,20}$/;

const buildSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .matches(
      passwordRegex,
      "Password must be 8-20 characters long, include at least one uppercase letter, one lowercase letter, one digit, and one of the special characters: #, @, or _"
    )
    .notOneOf(
      [yup.ref("currentPassword")],
      "New password must not match the current password"
    ),
  confirmNewPassword: yup
    .string()
    .required("Confirm new password is required")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

const ChangePasswordModal = ({ open, onClose }: ChangePasswordModalProps) => {
  const theme = useTheme();
  const { user, setUser } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: yupResolver(buildSchema),
    mode: "onSubmit",
  });

  const onSubmit = (data: FormValues) => {
    if (!user) {
      setErrorMessage("No user found in AuthContext.");
      return;
    }
    // Validate that the current password matches what we have in UserContext
    if (user.password !== data.currentPassword) {
      setErrorMessage("The current password you entered is incorrect.");
      return;
    }

    const updatedUser: User = {
      ...user,
      password: data.newPassword,
    };
    setUser(updatedUser);
    reset();
    onClose();
  };

  return (
    <ActionModal open={open} onClose={onClose} heading="Change Password">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="20px">
          <Controller
            name="currentPassword"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <PasswordTextField
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={error}
                placeholder="Current Password"
              />
            )}
          />
          <Controller
            name="newPassword"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <PasswordTextField
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={error}
                placeholder="New Password"
              />
            )}
          />
          <Controller
            name="confirmNewPassword"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <PasswordTextField
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={error}
                placeholder="Confirm New Password"
              />
            )}
          />
          {errorMessage && (
            <Typography color="error" variant="body2">
              {errorMessage}
            </Typography>
          )}

          <Button
            type="submit"
            width="100%"
            height="45px"
            backgroundColor={theme.palette.primary.main}
            color={theme.palette.text.primary}
            hoverColor={theme.palette.text.primary}
            hoverBgColor={lighten(theme.palette.primary.main, 0.2)}
            onClick={() => {}}
          >
            <Typography noWrap fontSize="14px" fontWeight="bold">
              Save Changes
            </Typography>
          </Button>
        </Stack>
      </form>
    </ActionModal>
  );
};

export default ChangePasswordModal;
