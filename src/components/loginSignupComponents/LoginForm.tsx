import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import * as yup from "yup";
import ModalTextField from "../modalComponents/ModalTextField";
import Button from "../../utilityComponents/Button";
import theme from "../../theme/theme";
import { hexToRGBA } from "../../utils/utilityFunctions";

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
  handleLogin: (email: string, password: string) => void;
}

const LoginForm = ({ handleLogin }: LoginFormProps) => {
  const { control, handleSubmit, trigger } = useForm<FormValues>({
    resolver: yupResolver(buildSchema()),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    handleLogin(data.email, data.password);
  };

  return (
    <>
      <Typography fontSize="32px" fontWeight="bold">
        Login
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="32px">
          {/* Email */}
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
              />
            )}
          />

          {/* Password */}
          <Controller
            name="password"
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
                label="Password"
                placeholder=""
              />
            )}
          />

          {/* SAVE BUTTON */}
          <Button
            type="submit"
            width="100%"
            height="53px"
            backgroundColor={theme.palette.primary.main}
            onClick={() => {}}
            color={theme.palette.text.primary}
            hoverColor={theme.palette.text.primary}
            hoverBgColor={hexToRGBA(theme.palette.primary.main, 0.8)}
          >
            <Typography fontSize="14px" fontWeight="bold">
              Login
            </Typography>
          </Button>
        </Stack>
      </form>

      <Stack gap={1} margin="auto" direction="row">
        <Typography fontSize="14px" color={theme.palette.primary.light}>
          Need to create an account?
        </Typography>{" "}
        <a>Sign Up</a>
      </Stack>
    </>
  );
};

export default LoginForm;
