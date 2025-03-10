import { yupResolver } from "@hookform/resolvers/yup";
import { lighten, Stack, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import ModalTextField from "../modalComponents/ModalTextField";
import Button from "../../utilityComponents/Button";
import theme from "../../theme/theme";
import axios from "axios";
import { useEffect, useState } from "react";
import { User } from "../../types/User";

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
  userEmail?: string;
  userPassword?: string;
}

const LoginForm = ({ formToggle, userEmail, userPassword }: LoginFormProps) => {
  const { control, handleSubmit, trigger, reset } = useForm<FormValues>({
    resolver: yupResolver(buildSchema()),
    mode: "onSubmit",
    defaultValues: {
      email: userEmail || "",
      password: userPassword || "",
    },
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Reset form when props change
  useEffect(() => {
    reset({
      email: userEmail || "",
      password: userPassword || "",
    });
  }, [userEmail, userPassword, reset]);

  const onSubmit = async (data: FormValues) => {
    setErrorMessage("");
    try {
      const response = await axios.get("./users.json");

      const users: User[] = response.data.users;

      // Find a user whose credentials match
      const foundUser = users.find(
        (u) => u.email === data.email && u.password === data.password
      );
      if (foundUser) {
        localStorage.setItem("userToken", foundUser.id);
        window.location.reload();
      } else {
        setErrorMessage("Invalid email or password.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("Login failed. Please try again later.");
    }
  };

  return (
    <>
      <Typography fontSize="32px" fontWeight="bold">
        Login
      </Typography>
      {errorMessage && (
        <Typography color="error" mb={2}>
          {errorMessage}
        </Typography>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="32px">
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
                adornmentTextFlag={false}
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
