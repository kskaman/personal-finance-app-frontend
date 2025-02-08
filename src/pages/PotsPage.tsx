import { Box, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import SetTitle from "../components/SetTitle";
import theme from "../theme/theme";
import PageDiv from "../utilityComponents/PageDiv";
import { PotsDataContext } from "../context/PotsContext";
import { useContext, useEffect, useRef, useState } from "react";
import PotItem from "../components/potsComponents/PotItem";
import Button from "../utilityComponents/Button";

const PotsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [parentWidth, setParentWidth] = useState<number>(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setParentWidth(entry.contentRect.width);
      }
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

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
            <Grid container spacing="24px" columns={parentWidth <= 800 ? 1 : 2}>
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
