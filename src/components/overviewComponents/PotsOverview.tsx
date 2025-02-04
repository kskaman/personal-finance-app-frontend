import { Box, Link, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import theme from "../../theme/theme";
import { useContext } from "react";
import PotIcon from "../../Icons/PotIcon";
import CaretRightIcon from "../../Icons/CaretRightIcon";
import { formatNumber } from "../../utils/utilityFunctions";
import SubContainer from "../../utilityComponents/SubContainer";
import { PotsDataContext } from "../../context/PotsContext";

const PotsOverview = () => {
  const pots = useContext(PotsDataContext).pots;

  const totalSaved = pots.reduce((sum, pot) => sum + pot.total, 0);

  const fourPots = pots.slice(0, 4);

  return (
    <SubContainer>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography
          fontWeight="bold"
          fontSize="20px"
          color={theme.palette.primary.main}
        >
          Pots
        </Typography>
        <Link
          href="/pots"
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap="12px"
          underline="none"
        >
          <Typography
            fontSize="14px"
            color={theme.palette.primary.light}
            sx={{
              ":hover": {
                color: theme.palette.primary.main,
              },
            }}
          >
            See Details
          </Typography>
          <CaretRightIcon color={theme.palette.primary.light} />
        </Link>
      </Stack>
      <Stack
        direction={{ xs: "column", sm: "row", lg: "column", xl: "row" }}
        gap="20px"
      >
        <Stack
          flex={1}
          direction="row"
          padding="16px"
          alignItems="center"
          gap="16px"
          height="110px"
          bgcolor={theme.palette.background.default}
          borderRadius="12px"
        >
          <PotIcon color={theme.palette.others.green} />
          <Stack direction="column" justifyContent="space-between">
            <Typography fontSize="14px" color={theme.palette.primary.light}>
              Total Saved
            </Typography>
            <Typography fontSize="32px" color={theme.palette.primary.main}>
              ${formatNumber(totalSaved)}
            </Typography>
          </Stack>
        </Stack>
        <Grid
          container
          flex={1}
          rowSpacing="24px"
          columnSpacing="24px"
          columns={2}
        >
          {fourPots.map((pot, index) => (
            <Grid
              key={index}
              size={1}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "16px",
              }}
            >
              {/* Colored Bar */}
              <Box
                height="100%"
                width="3px"
                borderRadius="8px"
                bgcolor={pot.theme}
              />

              {/* Pot Details */}
              <Stack direction="column">
                <Typography fontSize="12px" color={theme.palette.primary.light}>
                  {pot.name}
                </Typography>
                <Typography
                  fontSize="14px"
                  fontWeight="bold"
                  color={theme.palette.primary.main}
                >
                  ${formatNumber(pot.total)}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </SubContainer>
  );
};

export default PotsOverview;
