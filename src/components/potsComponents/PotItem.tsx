import { Box, Stack, Typography } from "@mui/material";
import { Pot } from "../../types/Data";
import SubContainer from "../../utilityComponents/SubContainer";
import Button from "../../utilityComponents/Button";
import theme from "../../theme/theme";
import PotsProgressBar from "../../utilityComponents/PotsProgressBar";

interface Props {
  pot: Pot;
}

const PotItem = ({ pot }: Props) => {
  return (
    <SubContainer gap="32px">
      <Stack direction="row" alignItems="center" gap="24px">
        <Box
          width="20px"
          height="20px"
          borderRadius="50%"
          bgcolor={pot.theme}
        ></Box>
        <Typography
          role="heading"
          fontSize="20px"
          fontWeight="bold"
          color={theme.palette.primary.main}
        >
          {pot.name}
        </Typography>
        <Box marginLeft="auto">
          <Button
            height="20px"
            backgroundColor="inherit"
            color={theme.palette.primary.light}
            hoverBgColor={theme.palette.text.primary}
            hoverColor="inherit"
            onClick={() => console.log("clicked ...")}
            borderColor={theme.palette.text.primary}
          >
            <Typography fontSize="16px" fontWeight="bold">
              ...
            </Typography>
          </Button>
        </Box>
      </Stack>

      <PotsProgressBar
        value={pot.total}
        target={pot.target}
        color={pot.theme}
        bgColor={theme.palette.background.default}
      />

      <Stack direction="row" gap="16px" height="53px">
        <Button
          flex={1}
          height="100%"
          color={theme.palette.primary.main}
          backgroundColor={theme.palette.background.default}
          onClick={() => console.log("clicked '+ Add Money'")}
          hoverBgColor="inherit"
          hoverColor="inherit"
        >
          <Typography fontSize="14px" fontWeight="bold" noWrap>
            + Add Money
          </Typography>
        </Button>
        <Button
          flex={1}
          height="100%"
          color={theme.palette.primary.main}
          backgroundColor={theme.palette.background.default}
          onClick={() => console.log("clicked 'Withdraw'")}
          hoverBgColor="inherit"
          hoverColor="inherit"
        >
          <Typography fontSize="14px" fontWeight="bold" noWrap>
            Withdraw
          </Typography>
        </Button>
      </Stack>
    </SubContainer>
  );
};

export default PotItem;
