import { Box, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import SetTitle from "../components/SetTitle";
import theme from "../theme/theme";
import PageDiv from "../utilityComponents/PageDiv";
import { PotsActionContext, PotsDataContext } from "../context/PotsContext";
import { useContext, useState } from "react";
import PotItem from "../components/potsComponents/PotItem";
import Button from "../utilityComponents/Button";
import useParentWidth from "../customHooks/useParentWidth";
import { MD_BREAK } from "../data/widthConstants";
import useModal from "../customHooks/useModal";
import { Pot } from "../types/Data";
import DeleteModal from "../components/modalComponents/DeleteModal";

const PotsPage = () => {
  const { containerRef, parentWidth } = useParentWidth();

  const { pots } = useContext(PotsDataContext);
  const { setPots } = useContext(PotsActionContext);

  const {
    isOpen: isDeleteModal,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const [selectedPot, setSelectedPot] = useState<Pot | null>(null);

  const handlePotDelete = (potName: string | null) => {
    if (selectedPot === null) return;

    setPots((prevPots) => prevPots.filter((pot) => pot.name !== potName));
    setSelectedPot(null);
  };

  return (
    <>
      <SetTitle title="Pots" />
      <Box ref={containerRef}>
        <PageDiv>
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
                    <PotItem
                      pot={pot}
                      setDeleteModalOpen={() => {
                        setSelectedPot(pot);
                        openDeleteModal();
                      }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Stack>
        </PageDiv>

        <DeleteModal
          open={isDeleteModal}
          onClose={closeDeleteModal}
          handleDelete={() => handlePotDelete(selectedPot?.name || null)}
          label={selectedPot?.name || ""}
          type={"pot"}
        />
      </Box>
    </>
  );
};

export default PotsPage;
