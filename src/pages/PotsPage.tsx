import { Box, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import SetTitle from "../components/SetTitle";
import theme from "../theme/theme";
import PageDiv from "../utilityComponents/PageDiv";
import { PotsDataContext } from "../context/PotsContext";
import { useContext } from "react";
import PotItem from "../components/potsComponents/PotItem";
import Button from "../utilityComponents/Button";
import useParentWidth from "../customHooks/useParentWidth";
import { MD_BREAK } from "../data/widthConstants";

const PotsPage = () => {
  const { containerRef, parentWidth } = useParentWidth();

  const pots = useContext(PotsDataContext).pots;

  return (
    <>
      <SetTitle title="Pots" />
      <PageDiv>
        <Box ref={containerRef}>
          <Stack gap="24px">
            <Stack direction="row" gap="32px">
              <Typography
                width="100%"
                height="56px"
                fontSize="32px"
                fontWeight="bold"
                color={theme.palette.primary.main}
              >
                Pots
              </Typography>
              <Button
                height="53px"
                padding="16px"
                backgroundColor={theme.palette.primary.main}
                color={theme.palette.text.primary}
                onClick={() => console.log("clicked Add New Button")}
                hoverColor={theme.palette.text.primary}
                hoverBgColor={theme.palette.primary.light}
              >
                <Typography noWrap fontSize="14px" fontWeight="bold">
                  + Add New Pot
                </Typography>
              </Button>
            </Stack>
            <Grid
              container
              spacing="24px"
              columns={parentWidth <= MD_BREAK ? 1 : 2}
            >
              {pots.map((pot) => {
                return (
                  <Grid key={pot.name} size={1}>
                    <PotItem pot={pot} />
                  </Grid>
                );
              })}
            </Grid>
          </Stack>
        </Box>
      </PageDiv>
    </>
  );
};

export default PotsPage;
