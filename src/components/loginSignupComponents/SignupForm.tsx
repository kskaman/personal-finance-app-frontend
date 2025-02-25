import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import * as yup from "yup";
import ModalTextField from "../modalComponents/ModalTextField";
import Button from "../../utilityComponents/Button";
import theme from "../../theme/theme";
import { hexToRGBA } from "../../utils/utilityFunctions";

interface FormValues {
  name: string;
  email: string;
  password: string;
}

const buildSchema = () =>
  yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().required("Email is required"),
    password: yup.string().required("Password is required"),
  });

interface LoginFormProps {
  handleSignup: (name: string, email: string, password: string) => void;
}

const SignupForm = ({ handleSignup }: LoginFormProps) => {
  const { control, handleSubmit, trigger } = useForm<FormValues>({
    resolver: yupResolver(buildSchema()),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    handleSignup(data.name, data.email, data.password);
  };

  return (
    <>
      <Typography fontSize="32px" fontWeight="bold">
        Sign Up
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="32px">
          {/* Name */}
          <Controller
            name="name"
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
                label="Name"
                placeholder=""
              />
            )}
          />

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
                label="Create Password"
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
              Create Account
            </Typography>
          </Button>
        </Stack>
      </form>

      <Stack gap={1} margin="auto" direction="row">
        <Typography fontSize="14px" color={theme.palette.primary.light}>
          Already have an Account?
        </Typography>{" "}
        <a>Login</a>
      </Stack>
    </>
  );
};

export default SignupForm;
