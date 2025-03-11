import { lighten, Stack, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import ModalTextField from "../modalComponents/ModalTextField";
import Button from "../../utilityComponents/Button";
import theme from "../../theme/theme";
import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

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

interface ForgotPasswordFormProps {
  forgotPasswordFormToggle: () => void;
}

const ForgotPasswordForm = ({
  forgotPasswordFormToggle,
}: ForgotPasswordFormProps) => {
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: yupResolver(buildSchema()),
    mode: "onSubmit",
    defaultValues: {
      email: "",
    },
  });
  const [infoMessage, setInfoMessage] = useState<string>("");

  const onSubmit = (data: FormValues) => {
    // Implement API call to send password email here.
    setInfoMessage(
      "If the provided email is associated with a registered account, a password reset email has been sent"
    );
    console.log(data);
  };

  return (
    <>
      {infoMessage && (
        <Typography margin={"auto"} color={theme.palette.others.green}>
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
              Request Password
            </Typography>
          </Button>
        </Stack>
      </form>

      <Stack gap={1} margin="auto" direction="row" alignItems={"center"}>
        <Typography fontSize="14px" color={theme.palette.primary.light}>
          Go to
        </Typography>{" "}
        <Typography
          onClick={forgotPasswordFormToggle}
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

export default ForgotPasswordForm;
