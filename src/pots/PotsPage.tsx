import { Box, Stack, Typography, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";
import SetTitle from "../ui/SetTitle";
import PageDiv from "../ui/PageDiv";
import { PotsActionContext, PotsDataContext } from "../context/PotsContext";
import { useContext, useEffect, useMemo, useState } from "react";
import PotItem from "./components/PotItem";
import Button from "../ui/Button";
import useParentWidth from "../customHooks/useParentWidth";
import { MD_BREAK } from "../data/widthConstants";
import useModal from "../customHooks/useModal";
import { MarkerTheme, Pot } from "../types/Data";
import DeleteModal from "../ui/DeleteModal";
import AddEditPotModal from "./components/AddEditPotModal";
import PotMoneyModal from "./components/PotMoneyModal";
import CategoryMarkerContext from "../context/CategoryMarkerContext";
import { updateUsedStatuses } from "../utils/potsUtils";
import {
  BalanceTransactionsActionContext,
  BalanceTransactionsDataContext,
} from "../context/BalanceTransactionsContext";
import EmptyStatePage from "../ui/EmptyStatePage";

const PotsPage = () => {
  const theme = useTheme();
  const { containerRef, parentWidth } = useParentWidth();

  const { pots } = useContext(PotsDataContext);
  const { setPots } = useContext(PotsActionContext);

  const potNamesUsed = pots.map((pot) => pot.name.toLowerCase());

  const currentBalance = useContext(BalanceTransactionsDataContext).balance;
  const setCurrentBalance = useContext(
    BalanceTransactionsActionContext
  ).setBalance;

  const { markerThemes, setMarkerThemes } = useContext(CategoryMarkerContext);

  const themeOptions = useMemo(() => {
    return markerThemes.map((marker: MarkerTheme) => ({
      value: marker.colorCode,
      label: marker.name,
      used: marker.usedInPots,
      colorCode: marker.colorCode,
    }));
  }, [markerThemes]);

  // Update the usedInPots flags for markerThemes whenever pots change.
  useEffect(() => {
    const { updatedMarkerThemes } = updateUsedStatuses(pots, markerThemes);
    setMarkerThemes(updatedMarkerThemes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pots]);

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

    setCurrentBalance((prevBalance) => ({
      ...prevBalance,
      current: prevBalance.current + selectedPot.total,
    }));
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

  const handleUpdatePotAmount = (
    potName: string,
    newTotal: number,
    newTarget: number,
    newBalance: number
  ) => {
    setPots((prevPots) =>
      prevPots.map((pot) =>
        pot.name === potName
          ? {
              ...pot,
              total: newTotal,
              target: newTarget,
            }
          : pot
      )
    );
    setCurrentBalance((prevBalance) => ({
      ...prevBalance,
      current: newBalance,
    }));
  };

  const sortedPots = useMemo(() => {
    return pots.slice().sort((a, b) => a.name.localeCompare(b.name));
  }, [pots]);

  if (sortedPots.length === 0) {
    return (
      <>
        <EmptyStatePage
          message="No Pots Yet"
          subText="Create your first pot to set aside money for a goal or expense."
          buttonLabel="Create a Pot"
          onButtonClick={() => {
            setMode("add");
            openAddEditModal();
          }}
        />
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
            themeOptions={themeOptions}
          />
        )}
      </>
    );
  }

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
                  {parentWidth < 450 ? "+" : "+ Add New Pot"}
                </Typography>
              </Button>
            </Stack>
            <Grid
              container
              spacing="24px"
              columns={parentWidth <= MD_BREAK ? 1 : 2}
            >
              {sortedPots.map((pot) => {
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
            warningText={`Are you sure you want to delete this pot? The money in the pot 
              will be added to current balance. This action cannot be
          reversed and all the data inside it will be removed forever.`}
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
            themeOptions={themeOptions}
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
            updatePotAmount={(newTotal, newTarget, newBalance) =>
              handleUpdatePotAmount(
                selectedPot.name,
                newTotal,
                newTarget,
                newBalance
              )
            }
            maxLimit={currentBalance.current}
          />
        )}
      </Box>
    </>
  );
};

export default PotsPage;
