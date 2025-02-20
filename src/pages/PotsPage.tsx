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
import AddEditPotModal from "../components/modalComponents/AddEditPotModal";
import PotMoneyModal from "../components/modalComponents/PotMoneyModal";

const PotsPage = () => {
  const { containerRef, parentWidth } = useParentWidth();

  const { pots } = useContext(PotsDataContext);
  const { setPots } = useContext(PotsActionContext);

  const potNamesUsed = pots.map((pot) => pot.name.toLowerCase());

  const {
    isOpen: isDeleteModal,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const {
    isOpen: isAddEditModalOpen,
    openModal: openAddEditModal,
    closeModal: closeAddEditModal,
  } = useModal();

  const {
    isOpen: isPotMoneyModalOpen,
    openModal: openPotMoneyModal,
    closeModal: closePotMoneyModal,
  } = useModal();

  const [selectedPot, setSelectedPot] = useState<Pot | null>(null);
  const [mode, setMode] = useState<"add" | "edit" | null>(null);
  const [potType, setPotType] = useState<"addMoney" | "withdraw" | null>(null);

  const handlePotDelete = (potName: string | null) => {
    if (selectedPot === null) return;

    setPots((prevPots) => prevPots.filter((pot) => pot.name !== potName));
    setSelectedPot(null);
  };

  const handleAddPot = ({
    potName,
    target,
    markerTheme,
  }: {
    potName: string;
    target: string;
    markerTheme: string;
  }) => {
    setPots((prevPots) => [
      ...prevPots,
      {
        name: potName,
        target: parseFloat(target),
        total: 0,
        theme: markerTheme,
      },
    ]);
  };

  const handleEditPot = ({
    potName,
    target,
    markerTheme,
  }: {
    potName: string;
    target: string;
    markerTheme: string;
  }) => {
    setPots((prevPots) =>
      prevPots.map((pot) =>
        pot.name === potName
          ? {
              name: potName,
              target: parseFloat(target),
              total: 0,
              theme: markerTheme,
            }
          : pot
      )
    );
  };

  const handleUpdatePotAmount = (potName: string, val: number) => {
    setPots((prevPots) =>
      prevPots.map((pot) =>
        pot.name === potName
          ? {
              ...pot,
              total: val,
            }
          : pot
      )
    );
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
                onClick={() => {
                  setMode("add");
                  openAddEditModal();
                }}
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
                      setEditModalOpen={() => {
                        setSelectedPot(pot);
                        setMode("edit");
                        openAddEditModal();
                      }}
                      setPotAddMoneyModalOpen={() => {
                        setSelectedPot(pot);
                        setPotType("addMoney");
                        openPotMoneyModal();
                      }}
                      setPotWithdrawMoneyModalOpen={() => {
                        setSelectedPot(pot);
                        setPotType("withdraw");
                        openPotMoneyModal();
                      }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Stack>
        </PageDiv>

        {isDeleteModal && (
          <DeleteModal
            open={isDeleteModal}
            onClose={() => {
              setSelectedPot(null);
              closeDeleteModal();
            }}
            handleDelete={() => handlePotDelete(selectedPot?.name || null)}
            label={selectedPot?.name || ""}
            type={"pot"}
          />
        )}

        {isAddEditModalOpen && (
          <AddEditPotModal
            open={isAddEditModalOpen}
            onClose={() => {
              closeAddEditModal();
              setSelectedPot(null);
              setMode(null);
            }}
            updatePots={
              mode === "edit"
                ? handleEditPot
                : mode === "add"
                ? handleAddPot
                : () => {}
            }
            mode={mode}
            potNamesUsed={potNamesUsed.filter(
              (potName) => potName !== selectedPot?.name
            )}
            potName={selectedPot?.name}
            targetVal={selectedPot?.target}
            markerTheme={selectedPot?.theme}
          />
        )}

        {isPotMoneyModalOpen && selectedPot && (
          <PotMoneyModal
            open={isPotMoneyModalOpen}
            onClose={() => {
              closePotMoneyModal();
              setSelectedPot(null);
              setPotType(null);
            }}
            type={potType}
            potName={selectedPot.name}
            potTotal={selectedPot.total}
            potTarget={selectedPot.target}
            updatePotAmount={(val) =>
              handleUpdatePotAmount(selectedPot.name, val)
            }
          />
        )}
      </Box>
    </>
  );
};

export default PotsPage;
