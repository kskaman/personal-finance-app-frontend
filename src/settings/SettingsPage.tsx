import { Box, Stack, Typography, useTheme } from "@mui/material";
import PageDiv from "../ui/PageDiv";
import Button from "../ui/Button";
import SetTitle from "../ui/SetTitle";
import LogoutIcon from "../Icons/LogoutIcon";
import SubContainer from "../ui/SubContainer";
import {
  Currencies,
  DisplayedModules,
  Fonts,
  SettingsRadioOption,
} from "../types/settingsData";
import SettingsOptionGroup from "./components/SettingsOptionGroup";
import useParentWidth from "../customHooks/useParentWidth";
import { useContext } from "react";
import { SettingsContext } from "../context/SettingsContext";
import CategorySettings from "./components/CategorySettings";
import DisplayModulesGroup from "./components/DisplayModulesGroup";
import UserAccountInfo from "./components/UserAccountInfo";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router";
import DeleteAccount from "./components/DeleteAccount";

const SettingsPage = () => {
  const theme = useTheme();
  const { parentWidth, containerRef } = useParentWidth();
  const {
    selectedFont,
    setSelectedFont,
    selectedCurrency,
    setSelectedCurrency,
    displayedModules,
    setDisplayedModules,
  } = useContext(SettingsContext);

  const navigate = useNavigate();

  const { logout } = useContext(AuthContext);
  // Handler to toggle the "using" property for a given module.
  const handleModuleToggle = (moduleKey: keyof DisplayedModules) => {
    setDisplayedModules((prev: DisplayedModules) => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        using: !prev[moduleKey].using,
      },
    }));
  };

  const fontOptions: SettingsRadioOption[] = [
    {
      value: "source-code",
      symbol: (
        <Typography
          fontSize="14px"
          color={theme.palette.primary.main}
          fontFamily="source-code"
        >
          Aa
        </Typography>
      ),
      label: (
        <Typography
          fontFamily="source-code"
          fontSize="14px"
          color={theme.palette.primary.main}
        >
          Source Code
        </Typography>
      ),
    },
    {
      value: "noto-serif",
      symbol: (
        <Typography
          fontSize="14px"
          color={theme.palette.primary.main}
          fontFamily="noto-serif"
        >
          Aa
        </Typography>
      ),
      label: (
        <Typography
          fontSize="14px"
          fontFamily="noto-serif"
          color={theme.palette.primary.main}
        >
          Noto Serif
        </Typography>
      ),
    },
    {
      value: "public-sans",
      symbol: (
        <Typography
          fontSize="14px"
          color={theme.palette.primary.main}
          fontFamily="public-sans"
        >
          Aa
        </Typography>
      ),
      label: (
        <Typography
          fontFamily="public-sans"
          fontSize="14px"
          color={theme.palette.primary.main}
        >
          Public Sans
        </Typography>
      ),
    },
  ];

  const currencyOptions: SettingsRadioOption[] = [
    {
      value: "$",
      symbol: (
        <Typography color={theme.palette.primary.main} fontSize="14px">
          $
        </Typography>
      ),
      label: (
        <Typography fontSize="14px" color={theme.palette.primary.main}>
          U.S. Dollar
        </Typography>
      ),
    },
    {
      value: "C$",
      symbol: (
        <Typography fontSize="14px" color={theme.palette.primary.main}>
          C$
        </Typography>
      ),
      label: (
        <Typography fontSize="14px" color={theme.palette.primary.main}>
          Canadian Dollar
        </Typography>
      ),
    },
    {
      value: "€",
      symbol: (
        <Typography color={theme.palette.primary.main} fontSize="14px">
          €
        </Typography>
      ),
      label: (
        <Typography fontSize="14px" color={theme.palette.primary.main}>
          Euro
        </Typography>
      ),
    },
    {
      value: "₹",
      symbol: (
        <Typography color={theme.palette.primary.main} fontSize="14px">
          ₹
        </Typography>
      ),
      label: (
        <Typography fontSize="14px" color={theme.palette.primary.main}>
          Indian Rupees
        </Typography>
      ),
    },
    {
      value: "£",
      symbol: (
        <Typography color={theme.palette.primary.main} fontSize="14px">
          £
        </Typography>
      ),
      label: (
        <Typography fontSize="14px" color={theme.palette.primary.main}>
          British Pound Sterling
        </Typography>
      ),
    },
    {
      value: "A$",
      symbol: (
        <Typography color={theme.palette.primary.main} fontSize="14px">
          A$
        </Typography>
      ),
      label: (
        <Typography fontSize="14px" color={theme.palette.primary.main}>
          Australian Dollar
        </Typography>
      ),
    },
    {
      value: "¥",
      symbol: (
        <Typography color={theme.palette.primary.main} fontSize="14px">
          ¥
        </Typography>
      ),
      label: (
        <Typography fontSize="14px" color={theme.palette.primary.main}>
          Chinese Yuan
        </Typography>
      ),
    },
  ];

  return (
    <>
      <SetTitle title="Settings" />
      <Box ref={containerRef}></Box>
      <PageDiv>
        <Stack gap="32px">
          <Stack direction="row" gap="32px">
            <Typography
              width="100%"
              height="56px"
              fontSize="32px"
              fontWeight="bold"
              color={theme.palette.primary.main}
            >
              Settings
            </Typography>
            <Button
              height="53px"
              padding="16px"
              backgroundColor={theme.palette.primary.main}
              color={theme.palette.text.primary}
              onClick={() => {
                navigate("/auth/login");
                logout();
              }}
              hoverColor={theme.palette.text.primary}
              hoverBgColor={theme.palette.primary.light}
            >
              <Stack direction="row" gap={1} alignItems="center">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "24px",
                    height: "24px",
                  }}
                >
                  <LogoutIcon color="inherit" />
                </Box>
                <Typography
                  noWrap
                  display={parentWidth < 450 ? "none" : "auto"}
                  fontSize="14px"
                  fontWeight="bold"
                >
                  Log Out
                </Typography>
              </Stack>
            </Button>
          </Stack>

          {/* User Account Info */}
          <UserAccountInfo />

          <Stack gap="20px">
            {/* Font Option */}
            <SubContainer>
              <SettingsOptionGroup
                heading="Font Options"
                options={fontOptions}
                selectedValue={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value as Fonts)}
                parentWidth={parentWidth}
              />
            </SubContainer>
            <SubContainer>
              <SettingsOptionGroup
                heading="Currency Symbol"
                options={currencyOptions}
                selectedValue={selectedCurrency}
                onChange={(e) =>
                  setSelectedCurrency(e.target.value as Currencies)
                }
                parentWidth={parentWidth}
              />
            </SubContainer>

            {/* Category Option container */}
            <CategorySettings parentWidth={parentWidth} />

            {/* Display Modules Group */}
            <SubContainer>
              <DisplayModulesGroup
                heading="Display Features"
                displayOptions={displayedModules}
                onChange={handleModuleToggle}
                parentWidth={parentWidth}
              />
            </SubContainer>
          </Stack>

          {/* Delete Account Button */}
          <Box marginLeft="auto">
            <DeleteAccount />
          </Box>
        </Stack>
      </PageDiv>
    </>
  );
};

export default SettingsPage;
