import { yupResolver } from "@hookform/resolvers/yup";
import { lighten, Stack, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import ModalTextField from "../modalComponents/ModalTextField";
import Button from "../../utilityComponents/Button";
import { useState } from "react";
import PasswordTextField from "./PasswordTextField";
import { grey500, grey900, white } from "../../theme/colors";

interface FormValues {
  name: string;
  email: string;
  password: string;
}

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@_])[A-Za-z\d#@_]{8,20}$/;

const buildSchema = () =>
  yup.object({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .required("Email is required")
      .email("Enter a valid email"),
    password: yup
      .string()
      .required("Password is required")
      .matches(passwordRegex, "Password does not meet criteria"),
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
        <Stack gap="20px">
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
                color={grey900}
                adornmentColor={grey500}
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
                color={grey900}
                adornmentColor={grey500}
              />
            )}
          />
          {/* Password Field */}
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
          {/* Password instructions */}
          <Typography fontSize="14px" color={grey500}>
            Your password must be 8 to 20 characters long and include at least
            one uppercase letter, one lowercase letter, one digit, and at least
            one of the following special characters: #, @, or _
          </Typography>

          {/* Signup Button */}
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
              Create Account
            </Typography>
          </Button>
        </Stack>
      </form>
      <Stack gap={1} margin="auto" direction="row" alignItems="center">
        <Typography fontSize="14px" color={grey500}>
          Already have an account?
        </Typography>
        <Typography
          onClick={formToggle}
          fontWeight="bold"
          color={grey900}
          sx={{ cursor: "pointer", textDecoration: "underline" }}
        >
          Login
        </Typography>
      </Stack>
    </>
  );
};

export default SignupForm;
