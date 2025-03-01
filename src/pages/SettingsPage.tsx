import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from "@mui/material";
import PageDiv from "../utilityComponents/PageDiv";
import theme from "../theme/theme";
import Button from "../utilityComponents/Button";
import SetTitle from "../components/SetTitle";
import LogoutIcon from "../Icons/LogoutIcon";
import SubContainer from "../utilityComponents/SubContainer";

const SettingsPage = () => {
  return (
    <>
      <SetTitle title="Settings" />
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
          <SubContainer>
            {/* Theme Option */}
            <SubContainer>
              <Typography variant="h6" fontWeight="bold">
                Theme
              </Typography>
              <FormControl component="fieldset">
                <FormGroup row>
                  <FormControlLabel
                    control={<Checkbox checked={true} onChange={() => {}} />}
                    label="Light"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={false} onChange={() => {}} />}
                    label="Dark"
                  />
                </FormGroup>
              </FormControl>
            </SubContainer>
          </SubContainer>
        </Stack>
      </PageDiv>
    </>
  );
};

export default SettingsPage;
