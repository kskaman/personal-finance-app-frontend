import { Box, Stack, Typography } from "@mui/material";
import SetTitle from "../components/SetTitle";
import theme from "../theme/theme";
import PageDiv from "../utilityComponents/PageDiv";
import { useContext, useState } from "react";
import {
  RecurringActionContext,
  RecurringDataContext,
} from "../context/RecurringContext";
import Total from "../components/billsComponents/Total";
import Summary from "../components/billsComponents/Summary";
import BillsTable from "../components/billsComponents/BillsTable";
import SubContainer from "../utilityComponents/SubContainer";
import Filter from "../utilityComponents/Filter";
import { RecurringBill } from "../types/Data";
import useParentWidth from "../customHooks/useParentWidth";
import { SM_BREAK, XL_BREAK } from "../data/widthConstants";
import DeleteModal from "../components/modalComponents/DeleteModal";
import useModal from "../customHooks/useModal";
import EditBillModal from "../components/modalComponents/EditBillModal";

// Function to filter & sort bills
const filterAndSortBills = (
  bills: RecurringBill[],
  searchName: string,
  sortBy: string
): RecurringBill[] => {
  const filteredBills = bills.filter((bill) =>
    searchName
      ? bill.name.toLowerCase().includes(searchName.toLowerCase().trim())
      : true
  );

  return filteredBills.sort((a, b) => {
    switch (sortBy) {
      case "Latest":
        return Number(a.dueDate) - Number(b.dueDate);
      case "Oldest":
        return Number(b.dueDate) - Number(a.dueDate);
      case "A to Z":
        return a.name.localeCompare(b.name);
      case "Z to A":
        return b.name.localeCompare(a.name);
      case "Highest":
        return a.amount - b.amount;
      case "Lowest":
        return b.amount - a.amount;
      default:
        return 0;
    }
  });
};

const BillsPage = () => {
  const { containerRef, parentWidth } = useParentWidth();

  const { recurringBills } = useContext(RecurringDataContext);
  const setRecurringBills = useContext(
    RecurringActionContext
  ).setRecurringBills;

  const [searchName, setSearchName] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("Latest");

  const totalBill = Math.abs(
    recurringBills.reduce((sum, bill) => sum + bill.amount, 0)
  );
  const filteredBills = filterAndSortBills(recurringBills, searchName, sortBy);

  // Modal management hooks.
  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const {
    isOpen: isEditModalOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();

  // Local state for the selected budget (for edit/delete)
  const [selectedBill, setSelectedBill] = useState<RecurringBill | null>(null);

  const handleBillDelete = (selectedBillId: string) => {
    if (selectedBillId === "") return;
    const newBills = recurringBills.filter(
      (bill: RecurringBill) => bill.id !== selectedBillId
    );
    setRecurringBills(newBills);
    setSelectedBill(null);
  };

  const handleUpdateBill = (
    billId: string,
    amount: number,
    dueDate: string
  ) => {
    if (!billId) return;
    const updatedBills = recurringBills.map((bill) =>
      bill.id === billId ? { ...bill, amount: -amount, dueDate } : bill
    );
    setRecurringBills(updatedBills);
  };

  return (
    <>
      <SetTitle title="Recurring Bills" />
      <Box ref={containerRef}>
        <PageDiv>
          <Stack direction="column" gap="32px">
            <Typography
              width="100%"
              height="56px"
              fontSize="32px"
              fontWeight="bold"
              color={theme.palette.primary.main}
            >
              Recurring Bills
            </Typography>
            <Stack
              direction={parentWidth < XL_BREAK ? "column" : "row"}
              gap="24px"
            >
              <Stack
                flex={1}
                gap="24px"
                width="100%"
                minWidth="200px"
                direction={
                  parentWidth > XL_BREAK
                    ? "column"
                    : parentWidth > SM_BREAK
                    ? "row"
                    : "column"
                }
              >
                <Total parentWidth={parentWidth} totalBill={totalBill} />
                <Summary />
              </Stack>
              <SubContainer flex={2}>
                <Stack gap="24px">
                  <Filter
                    parentWidth={parentWidth}
                    searchName={searchName}
                    setSearchName={setSearchName}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                  />
                  <BillsTable
                    parentWidth={parentWidth}
                    bills={filteredBills}
                    setDeleteModalOpen={(bill: RecurringBill) => {
                      setSelectedBill(bill);
                      openDeleteModal();
                    }}
                    setEditModalOpen={(bill: RecurringBill) => {
                      setSelectedBill(bill);
                      openEditModal();
                    }}
                  />
                </Stack>
              </SubContainer>
            </Stack>
          </Stack>
        </PageDiv>

        {/* Delete Modal Component */}
        {selectedBill && isDeleteModalOpen && (
          <DeleteModal
            open={isDeleteModalOpen}
            onClose={() => {
              setSelectedBill(null);
              closeDeleteModal();
            }}
            handleDelete={() => handleBillDelete(selectedBill.id)}
            label={"Recurring Bill"}
            type="bill"
          />
        )}

        {/* Edit Recurring Bill Modal */}
        {selectedBill && isEditModalOpen && (
          <EditBillModal
            open={isEditModalOpen}
            onClose={closeEditModal}
            billId={selectedBill.id}
            amount={Math.abs(selectedBill.amount)}
            dueDate={selectedBill.dueDate}
            updateBill={handleUpdateBill}
          />
        )}
      </Box>
    </>
  );
};

export default BillsPage;
