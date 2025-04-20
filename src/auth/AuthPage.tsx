import { Box, Stack, Typography } from "@mui/material";
import SubContainer from "../ui/SubContainer";
import illustrationImage from "../assets/images/illustration-authentication.svg";
import logoIcon from "../assets/images/logo-large.svg";
import { beige100, grey900, white } from "../theme/colors";
import { Outlet } from "react-router";

const AuthPage = () => {
  return (
    <>
      <Stack
        direction={{ xs: "column", md: "row" }}
        bgcolor={beige100}
        minHeight={"100vh"}
      >
        {/* illustration image for screens  >= 900px */}
        <Stack
          display={{ xs: "none", md: "flex" }}
          padding="20px"
          width="42%"
          maxWidth="560px"
          height={"100vh"}
          position="relative"
          overflow="hidden"
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
          ></Box>
          <Stack position="absolute" bottom="20px" gap="24px" padding="20px">
            <Typography
              role="heading"
              fontSize="32px"
              fontWeight="bold"
              color={white}
              width="87%"
            >
              Keep track of your money and save for your future
            </Typography>
            <Typography width="87%" fontSize="14px" color={white}>
              Personal finance app puts you in control of your spending. Track
              transactions, set budgets, and add to savings pots easily.
            </Typography>
          </Stack>
        </Stack>

        {/* Logo header for screen sizes < 900px */}
        <Stack
          display={{ xs: "flex", md: "none" }}
          bgcolor={grey900}
          justifyContent="center"
          alignItems="center"
          height="69.76px"
          sx={{
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
          }}
        >
          <img src={logoIcon} alt="Logo Icons" />
        </Stack>

        {/* Login / Signup Form Container */}
        <Stack
          flex={1}
          justifyContent="center"
          alignItems="center"
          paddingY="48px"
        >
          <SubContainer width="min(560px, 90%)" gap="20px">
            <Outlet />
          </SubContainer>
        </Stack>
      </Stack>
    </>
  );
};

export default AuthPage;
