import { Box, Stack, Typography } from "@mui/material";
import illustrationImage from "../assets/images/illustration-authentication.svg";
import logoIcon from "../assets/images/logo-large.svg";

import theme from "../theme/theme";
import { useState } from "react";
import LoginForm from "../components/loginSignupComponents/LoginForm";
import SignupForm from "../components/loginSignupComponents/SignupForm";
import SubContainer from "../utilityComponents/SubContainer";

const LoginPage = () => {
  const [isLogOpen, setLogOpen] = useState<boolean>(false);

  const handleLogin = (email: string, password: string) => {
    console.log(`email : ${email}\npassword : ${password}`);
  };

  const handleSignup = (name: string, email: string, password: string) => {
    console.log(`name : ${name}\nemail : ${email}\npassword : ${password}`);
  };

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      height="100vh"
      width="100vw"
      bgcolor={theme.palette.background.default}
      overflow="hidden"
    >
      {/* illustration image for screens  >= 900px */}
      <Stack
        display={{ xs: "none", md: "flex" }}
        padding="20px"
        width="42%"
        maxWidth="560px"
        height="100%"
        position="relative"
      >
        <Box
          component="img"
          src={illustrationImage}
          alt="Authentication Image"
          borderRadius="12px"
          sx={{
            objectFit: "cover",
            height: "100%",
          }}
        />
        <Stack position="absolute" bottom="20px" gap="24px" padding="20px">
          <Typography
            role="heading"
            fontSize="32px"
            fontWeight="bold"
            color={theme.palette.text.primary}
            width="87%"
          >
            Keep track of your money and save for your future
          </Typography>
          <Typography
            width="87%"
            fontSize="14px"
            color={theme.palette.text.primary}
          >
            Personal finance app puts you in control of your spending. Track
            transactions, set budgets, and add to savings pots easily.
          </Typography>
        </Stack>
      </Stack>

      {/* Logo header for screen sizes < 900px */}
      <Stack
        display={{ xs: "flex", md: "none" }}
        bgcolor={theme.palette.primary.main}
        justifyContent="center"
        alignItems="center"
        height="69.76px"
        sx={{
          borderBottomLeftRadius: "16px",
          borderBottomRightRadius: "16px",
        }}
      >
        <img src={logoIcon} alt="Logo Icons" />
      </Stack>

      {/* Login / Signup Form Container */}
      <Stack justifyContent="center" alignItems="center" height="100%">
        <SubContainer width="min(560px, 90%)">
          {isLogOpen ? (
            <LoginForm handleLogin={handleLogin} />
          ) : (
            <SignupForm handleSignup={handleSignup} />
          )}
        </SubContainer>
      </Stack>
    </Stack>
  );
};

export default LoginPage;
