import { Box, Stack, Typography } from "@mui/material";
import PageDiv from "../utilityComponents/PageDiv";
import theme from "../theme/theme";
import Button from "../utilityComponents/Button";
import SetTitle from "../components/SetTitle";
import LogoutIcon from "../Icons/LogoutIcon";
import SubContainer from "../utilityComponents/SubContainer";
import { Currencies, Fonts, SettingsRadioOption } from "../types/settingsData";
import SettingsOptionGroup from "../components/settingsComponents/SettingsOptionGroup";
import useParentWidth from "../customHooks/useParentWidth";
import { useContext } from "react";
import { SettingsContext } from "../context/SettingsContext";
import CategorySettings from "../components/settingsComponents/CategorySettings";

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
        fontFamily={"public-sans"}
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

  // ---- ADDED BELOW ----
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

const SettingsPage = () => {
  const { parentWidth, containerRef } = useParentWidth();
  const {
    selectedFont,
    setSelectedFont,
    selectedCurrency,
    setSelectedCurrency,
  } = useContext(SettingsContext);

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
              onClick={() => console.log("clicked logOut")}
              hoverColor={theme.palette.text.primary}
              hoverBgColor={theme.palette.primary.light}
            >
              <Stack direction="row" gap={1} alignItems="center">
                <Box
                  className="iconClass"
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
                <Typography noWrap fontSize="14px" fontWeight="bold">
                  Log Out
                </Typography>
              </Stack>
            </Button>
          </Stack>

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
          </Stack>
        </Stack>
      </PageDiv>
    </>
  );
};

export default SettingsPage;
