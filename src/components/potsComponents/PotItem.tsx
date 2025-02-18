import { Box, Stack, Typography } from "@mui/material";
import { Pot } from "../../types/Data";
import SubContainer from "../../utilityComponents/SubContainer";
import Button from "../../utilityComponents/Button";
import theme from "../../theme/theme";
import PotsProgressBar from "../../utilityComponents/PotsProgressBar";
import OptionsButton from "../modalComponents/OptionsButton";

interface Props {
  pot: Pot;
  setDeleteModalOpen: () => void;
}

const PotItem = ({ pot, setDeleteModalOpen }: Props) => {
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
        <OptionsButton
          type="pot"
          onEdit={() => console.log("Edit Pot")}
          onDelete={setDeleteModalOpen}
        />
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
