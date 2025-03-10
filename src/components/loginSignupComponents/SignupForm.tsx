// SignupForm.tsx
import { yupResolver } from "@hookform/resolvers/yup";
import { lighten, Stack, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import ModalTextField from "../modalComponents/ModalTextField";
import Button from "../../utilityComponents/Button";
import theme from "../../theme/theme";
import { useState } from "react";

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

interface SignupFormProps {
  formToggle: () => void;
}

const SignupForm = ({ formToggle }: SignupFormProps) => {
  const { control, handleSubmit, trigger } = useForm<FormValues>({
    resolver: yupResolver(buildSchema()),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

  const onSubmit = async (data: FormValues) => {
    setErrorMessage("");
    // For now, signup is disabled. Later you can replace this logic with an API call.
    setErrorMessage(
      "Signup is currently disabled. Please login with default credentials."
    );
    console.log(data);
  };

  return (
    <>
      <Typography fontSize="32px" fontWeight="bold">
        Sign Up
      </Typography>
      {errorMessage && (
        <Typography color="error" mb={2}>
          {errorMessage}
        </Typography>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="32px">
          {/* Name Field */}
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
                adornmentTextFlag={false}
              />
            )}
          />
          {/* Email Field */}
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
          {/* Password Field */}
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
                adornmentTextFlag={false}
              />
            )}
          />
          {/* Signup Button */}
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
              Create Account
            </Typography>
          </Button>
        </Stack>
      </form>
      <Stack gap={1} margin="auto" direction="row" mt={2}>
        <Typography fontSize="14px" color={theme.palette.primary.light}>
          Already have an account?
        </Typography>
        <Typography
          onClick={formToggle}
          fontWeight="bold"
          color={theme.palette.primary.main}
          sx={{ cursor: "pointer", textDecoration: "underline" }}
        >
          Login
        </Typography>
      </Stack>
    </>
  );
};

export default SignupForm;
