import { lighten, Stack, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import ModalTextField from "../../ui/ModalTextField";
import Button from "../../ui/Button";
import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { green, grey500, grey900, white } from "../../theme/colors";
import SetTitle from "../../ui/SetTitle";
import { Link } from "react-router";

interface FormValues {
  email: string;
}

const buildSchema = () =>
  yup.object({
    email: yup
      .string()
      .required("Email is required")
      .email("Enter a valid Email"),
  });

const ForgotPasswordForm = () => {
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: yupResolver(buildSchema()),
    mode: "onSubmit",
    defaultValues: {
      email: "",
    },
  });
  const [infoMessage, setInfoMessage] =
    useState<string>(`This functionality is disabled.
     This is just a frontend demo.
     Please login with default credentials.`);

  const onSubmit = (data: FormValues) => {
    // Implement API call to send password email here.
    setInfoMessage(
      "This functionality is disabled. This is just a frontend demo. Please login with default credentials."
    );
    console.log(data);
  };

  return (
    <>
      <SetTitle title={"Forgot Password"} />
      {infoMessage && (
        <Typography margin={"auto"} color={green}>
          {infoMessage}
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
                onBlur={field.onBlur}
                label="Email"
                placeholder=""
                error={error}
                adornmentTextFlag={false}
                color={grey900}
                adornmentColor={grey500}
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
            isDisabled={true}
          >
            <Typography fontSize="14px" fontWeight="bold">
              Request Password
            </Typography>
          </Button>
        </Stack>
      </form>

      {/* Login */}
      <Stack gap={1} margin="auto" direction="row">
        <Typography fontSize="14px" color={grey500}>
          Go to
        </Typography>
        <Link to="/auth/login">
          <Typography
            fontWeight="bold"
            color={grey900}
            sx={{ textDecoration: "underline" }}
          >
            Log In
          </Typography>
        </Link>
      </Stack>
    </>
  );
};

export default ForgotPasswordForm;
