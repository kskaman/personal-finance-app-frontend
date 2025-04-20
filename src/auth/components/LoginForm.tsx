import { yupResolver } from "@hookform/resolvers/yup";
import { lighten, Stack, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import ModalTextField from "../../ui/ModalTextField";
import Button from "../../ui/Button";

import { useContext, useEffect } from "react";

import PasswordTextField from "../../ui/PasswordTextField";
import { AuthContext } from "../../context/AuthProvider";
import { Link, useNavigate } from "react-router";
import { grey500, grey900, white } from "../../theme/colors";
import SetTitle from "../../ui/SetTitle";

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
  userEmail?: string;
  userPassword?: string;
}

const LoginForm = ({ userEmail, userPassword }: LoginFormProps) => {
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
      <SetTitle title={"Login"} />
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
                color={grey900}
                adornmentColor={grey500}
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
            backgroundColor={grey900}
            onClick={() => {}}
            color={white}
            hoverColor={white}
            hoverBgColor={lighten(grey900, 0.2)}
          >
            <Typography fontSize="14px" fontWeight="bold">
              Login
            </Typography>
          </Button>
        </Stack>
      </form>
      {/* “Forgot password?” */}
      <Stack gap={1} margin="auto" direction="row" alignItems="center">
        <Link to="/auth/forgot-password">
          <Typography
            fontWeight="bold"
            color={grey900}
            sx={{ textDecoration: "underline" }}
          >
            Forgot Password?
          </Typography>
        </Link>
      </Stack>

      {/* “Sign‑up” */}
      <Stack gap={1} margin="auto" direction="row">
        <Typography fontSize="14px" color={grey500}>
          Need to create an account?
        </Typography>
        <Link to="/auth/signup">
          <Typography
            fontWeight="bold"
            color={grey900}
            sx={{ textDecoration: "underline" }}
          >
            Sign Up
          </Typography>
        </Link>
      </Stack>
    </>
  );
};

export default LoginForm;
