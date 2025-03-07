import { Box, Stack, Typography } from "@mui/material";
import PageDiv from "../utilityComponents/PageDiv";
import theme from "../theme/theme";
import Button from "../utilityComponents/Button";
import SetTitle from "../components/SetTitle";
import LogoutIcon from "../Icons/LogoutIcon";
import SubContainer from "../utilityComponents/SubContainer";
import { SettingsRadioOption } from "../types/settingsData";
import SettingsOptionGroup from "../components/settingsComponents/SettingsOptionGroup";
import useParentWidth from "../customHooks/useParentWidth";

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
    label: "Source Cod Pro",
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
    label: "Noto Serif",
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
    label: "Public Sans",
  },
];

const currencyOptions: SettingsRadioOption[] = [
  {
    value: "usd",
    symbol: (
      <Typography color={theme.palette.primary.main} fontSize="14px">
        $
      </Typography>
    ),
    label: "U.S. Dollar",
  },
  {
    value: "cad",
    symbol: (
      <Typography fontSize="14px" color={theme.palette.primary.main}>
        C$
      </Typography>
    ),
    label: "Canadian Dollar",
  },
  {
    value: "eur",
    symbol: (
      <Typography color={theme.palette.primary.main} fontSize="14px">
        €
      </Typography>
    ),
    label: "Euro",
  },
];

const SettingsPage = () => {
  const { parentWidth, containerRef } = useParentWidth();

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
              {/* Font Options Section */}
              <SettingsOptionGroup
                heading="Font Options"
                options={fontOptions}
                selectedValue="public-sans"
                onChange={() => {}}
                parentWidth={parentWidth}
              />
            </SubContainer>
            <SubContainer>
              {/* Currency Options Section */}
              <SettingsOptionGroup
                heading="Currency Options"
                options={currencyOptions}
                selectedValue="usd"
                onChange={() => {}}
                parentWidth={parentWidth}
              />
            </SubContainer>
          </Stack>
        </Stack>
      </PageDiv>
    </>
  );
};

export default SettingsPage;
