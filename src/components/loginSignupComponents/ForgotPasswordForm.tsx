import { lighten, Stack, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import ModalTextField from "../modalComponents/ModalTextField";
import Button from "../../utilityComponents/Button";
import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { green, grey500, grey900, white } from "../../theme/colors";

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
          >
            <Typography fontSize="14px" fontWeight="bold">
              Request Password
            </Typography>
          </Button>
        </Stack>
      </form>

      <Stack gap={1} margin="auto" direction="row" alignItems={"center"}>
        <Typography fontSize="14px" color={grey900}>
          Go to
        </Typography>{" "}
        <Typography
          onClick={forgotPasswordFormToggle}
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

export default ForgotPasswordForm;
