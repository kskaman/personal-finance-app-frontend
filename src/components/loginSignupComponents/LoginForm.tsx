import { yupResolver } from "@hookform/resolvers/yup";
import { lighten, Stack, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import ModalTextField from "../modalComponents/ModalTextField";
import Button from "../../utilityComponents/Button";
import theme from "../../theme/theme";

import { useContext, useEffect } from "react";

import PasswordTextField from "./PasswordTextField";

import { AuthContext } from "../../context/AuthProvider";
import { useNavigate } from "react-router";

interface FormValues {
  email: string;
  password: string;
}

const buildSchema = () =>
  yup.object({
    email: yup.string().required("Email is required"),
    password: yup.string().required("Password is required"),
  });

interface LoginFormProps {
  formToggle: () => void;
  forgotPasswordFormToggle: () => void;
  userEmail?: string;
  userPassword?: string;
}

const LoginForm = ({
  formToggle,
  forgotPasswordFormToggle,
  userEmail,
  userPassword,
}: LoginFormProps) => {
  const { login, loginError } = useContext(AuthContext);
  const navigate = useNavigate();

  const { control, handleSubmit, trigger, reset } = useForm<FormValues>({
    resolver: yupResolver(buildSchema()),
    mode: "onSubmit",
    defaultValues: {
      email: userEmail || "",
      password: userPassword || "",
    },
  });

  // Reset form when props change
  useEffect(() => {
    reset({
      email: userEmail || "",
      password: userPassword || "",
    });
  }, [userEmail, userPassword, reset]);

  const onSubmit = async (data: FormValues) => {
    const success = await login(data.email, data.password);
    if (success) {
      navigate("/");
    }
  };

  return (
    <>
      <Typography fontSize="32px" fontWeight="bold">
        Login
      </Typography>
      {loginError && (
        <Typography color="error" mb={2}>
          {loginError}
        </Typography>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="20px">
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <ModalTextField
                value={field.value}
                onChange={field.onChange}
                onBlur={() => {
                  field.onBlur();
                  if (field.value.trim() !== "") {
                    trigger(field.name);
                  }
                }}
                error={error}
                label="Email"
                placeholder=""
                adornmentTextFlag={false}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <PasswordTextField
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={error}
              />
            )}
          />

          <Button
            type="submit"
            width="100%"
            height="53px"
            backgroundColor={theme.palette.primary.main}
            onClick={() => {}}
            color={theme.palette.text.primary}
            hoverColor={theme.palette.text.primary}
            hoverBgColor={lighten(theme.palette.primary.main, 0.2)}
          >
            <Typography fontSize="14px" fontWeight="bold">
              Login
            </Typography>
          </Button>
        </Stack>
      </form>
      <Stack gap={1} margin="auto" direction="row" alignItems="center">
        <Typography
          onClick={forgotPasswordFormToggle}
          fontWeight="bold"
          color={theme.palette.primary.main}
          sx={{ cursor: "pointer", textDecoration: "underline" }}
        >
          Forgot Password?
        </Typography>
      </Stack>
      <Stack gap={1} margin="auto" direction="row">
        <Typography fontSize="14px" color={theme.palette.primary.light}>
          Need to create an account?
        </Typography>{" "}
        <Typography
          onClick={formToggle}
          fontWeight="bold"
          color={theme.palette.primary.main}
          sx={{ cursor: "pointer", textDecoration: "underline" }}
        >
          SignUp
        </Typography>
      </Stack>
    </>
  );
};

export default LoginForm;
