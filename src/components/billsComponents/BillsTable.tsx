import {
  Avatar,
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { RecurringBill } from "../../types/Data";
import {
  dateSuffix,
  formatNumber,
  getInitials,
} from "../../utils/utilityFunctions";
import PaidIcon from "../../Icons/PaidIcon";
import DueIcon from "../../Icons/DueIcon";
import OptionsButton from "../modalComponents/OptionsButton";
import { MD_SM_BREAK } from "../../data/widthConstants";
import { useContext } from "react";
import { SettingsContext } from "../../context/SettingsContext";

//! Consider using early returns to avoid deeply nested code
//! you can also strictly type output as a discriminated union of possible statuses
//! this will help you avoid typos
const getBillStatus = (lastPaid: string, dueDate: string) => {
  let status = "unpaid";

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastPaidDate = lastPaid ? new Date(lastPaid) : null;

  //! At this point you know you can check for the paid status and return early
  //! if (lastPaidDate && lastPaidDate >= startOfMonth) return "paid";

  const dueDateObj =
    dueDate && !isNaN(Number(dueDate))
      ? new Date(now.getFullYear(), now.getMonth(), Number(dueDate))
      : null;

  //! if there is no due date object, that likely indicates an error in the data, but currently it will default to "unpaid" -- is that necessarily accurate ? Maybe do an early return of "Invalid Due Date" or something similar
  //! if (!dueDateObj) return "Invalid Due Date";

  //! You can remove some of the following checks with early returns as well
  /*
  const diffDays = (dueDateObj.getTime() - now.getTime()) / (1000 * 3600 * 24);
  if (diffDays <= 0) return "due";
  if (diffDays <= 3) return "dueSoon";
  return "unpaid";
  */

  if (lastPaidDate && lastPaidDate >= startOfMonth) {
    status = "paid";
  } else {
    const diffDays =
      dueDateObj && (dueDateObj.getTime() - now.getTime()) / (1000 * 3600 * 24);
    const isDueSoon = dueDateObj && diffDays && diffDays > 0 && diffDays <= 3;
    const isDue = dueDateObj && diffDays && diffDays <= 0;
    if (isDueSoon) status = "dueSoon";
    if (isDue) status = "due";
  }
  return status;
};

//! Generally cleaner to define an interface for your props
/*
interface BillsTableProps {
  bills: RecurringBill[];
  parentWidth: number;
  setDeleteModalOpen: (recurringBill: RecurringBill) => void;
  setEditModalOpen: (recurringBill: RecurringBill) => void;
}

const BillsTable = ({
  bills,
  parentWidth,
  setDeleteModalOpen,
  setEditModalOpen,
}: BillsTableProps) => {
  ...
*/

const BillsTable = ({
  bills,
  parentWidth,
  setDeleteModalOpen,
  setEditModalOpen,
}: {
  bills: RecurringBill[];
  parentWidth: number;
  setDeleteModalOpen: (recurringBill: RecurringBill) => void;
  setEditModalOpen: (recurringBill: RecurringBill) => void;
}) => {
  const theme = useTheme();
  const isParentWidth = parentWidth < MD_SM_BREAK;

  const currencySymbol = useContext(SettingsContext).selectedCurrency;

  return (
    <Table
      sx={{
        "& td, & th": { paddingX: "0" },
      }}
    >
      <TableHead
        sx={{ display: isParentWidth ? "none" : "table-header-group" }}
      >
        <TableRow>
          {/* Your Header Cells both here and in TransactionsTable.tsx always have the same styling, in those cases you should try to reduce duplicate code either by creating a custom <HeaderTableCell /> component,  extracting the common styling into a styles file and import it where needed or by creating a custom Table component where you can set the Headers once and just pass data. Always try to keep in mind to reduce duplicate code where possible */}
          <TableCell
            sx={{
              fontSize: "12px",
              color: theme.palette.primary.light,
              textAlign: "left",
            }}
          >
            Bill Title
          </TableCell>
          <TableCell
            sx={{
              fontSize: "12px",
              color: theme.palette.primary.light,
              textAlign: "left",
            }}
          >
            Due Date
          </TableCell>
          <TableCell
            sx={{
              fontSize: "12px",
              color: theme.palette.primary.light,
              textAlign: "right",
            }}
          >
            Amount
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {bills.map((bill) => {
          const status = getBillStatus(bill.lastPaid, bill.dueDate);
          const isDue = status === "due";
          const dueSoon = status === "dueSoon";

          return (
            <TableRow
              key={bill.id}
              sx={{
                "&:first-of-type td": { paddingTop: "24px" },
                "&:last-child td": { border: 0 },
                display: isParentWidth ? "flex" : "table-row",
                flexDirection: isParentWidth ? "column" : "row",
                alignItems: isParentWidth ? "start" : "center",
              }}
            >
              {/* Mobile View: Compact format */}
              <TableCell
                sx={{
                  display: isParentWidth ? "flex" : "none",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "8px",
                  width: "100%",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      sx={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: theme.palette.primary.contrastText,
                        backgroundColor: bill.theme,
                        width: "32px",
                        height: "32px",
                        marginRight: "12px",
                      }}
                    >
                      {getInitials(bill.name)}
                    </Avatar>
                    <Typography
                      fontSize={isDue ? "16px" : "14px"}
                      fontWeight="bold"
                      color={
                        isDue
                          ? theme.palette.others.red
                          : theme.palette.primary.main
                      }
                    >
                      {bill.name}
                    </Typography>
                  </Box>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                    width="100%"
                    marginLeft={"auto"}
                  >
                    <OptionsButton
                      type="bill"
                      onEdit={() => {
                        setEditModalOpen(bill);
                      }}
                      onDelete={() => {
                        setDeleteModalOpen(bill);
                      }}
                    />
                  </Stack>
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                >
                  <Stack
                    direction="row"
                    gap="8px"
                    alignItems="center"
                    justifyContent="flex-start"
                  >
                    <Typography
                      fontSize={isDue ? "14px" : "12px"}
                      fontWeight={isDue ? "bold" : "normal"}
                      color={
                        isDue
                          ? theme.palette.others.red
                          : theme.palette.others.green
                      }
                    >
                      {`Monthly~${bill.dueDate}${
                        dateSuffix[bill.dueDate as keyof typeof dateSuffix]
                      }`}
                    </Typography>
                    {/* can avoid the ternary here and just use Short Circuit Rendering
                    {status === "paid" && <PaidIcon />}
                    {(isDue || dueSoon) && <DueIcon />}
                    */}
                    {status === "paid" ? (
                      <PaidIcon />
                    ) : isDue || dueSoon ? (
                      <DueIcon />
                    ) : (
                      ""
                    )}
                  </Stack>
                  <Typography
                    fontSize={isDue ? "16px" : "14px"}
                    fontWeight="bold"
                    color={
                      isDue || dueSoon
                        ? theme.palette.others.red
                        : theme.palette.primary.main
                    }
                  >
                    {currencySymbol}
                    {formatNumber(Math.abs(bill.amount))}
                  </Typography>
                </Stack>
              </TableCell>

              {/* Default Table Format for Tablet & PC */}
              <TableCell
                sx={{
                  display: isParentWidth ? "none" : "table-cell",
                  textAlign: "left",
                  color: isDue
                    ? theme.palette.others.red
                    : theme.palette.primary.main,
                  fontWeight: "bold",
                  fontSize: isDue ? "16px" : "14px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    sx={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: theme.palette.primary.contrastText,
                      backgroundColor: bill.theme,
                      width: "40px",
                      height: "40px",
                      marginRight: "16px",
                    }}
                  >
                    {getInitials(bill.name)}
                  </Avatar>
                  {bill.name}
                </Box>
              </TableCell>

              <TableCell
                sx={{
                  display: isParentWidth ? "none" : "table-cell",
                  textAlign: "left",
                  color: isDue
                    ? theme.palette.others.red
                    : theme.palette.others.green,
                  fontSize: isDue ? "14px" : "12px",
                }}
              >
                <Stack
                  direction="row"
                  gap="8px"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  {`Monthly~${bill.dueDate}${
                    dateSuffix[bill.dueDate as keyof typeof dateSuffix]
                  }`}
                  {status === "paid" ? (
                    <PaidIcon />
                  ) : isDue || dueSoon ? (
                    <DueIcon />
                  ) : (
                    ""
                  )}
                </Stack>
              </TableCell>

              <TableCell
                sx={{
                  display: isParentWidth ? "none" : "table-cell",
                  textAlign: "right",
                  color:
                    isDue || dueSoon
                      ? theme.palette.others.red
                      : theme.palette.primary.main,
                  fontSize: isDue ? "16px" : "14px",
                  fontWeight: "bold",
                }}
              >
                {currencySymbol}
                {formatNumber(Math.abs(bill.amount))}
              </TableCell>

              <TableCell
                sx={{
                  display: isParentWidth ? "none" : "table-cell",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  width="100%"
                  marginLeft={"auto"}
                >
                  <OptionsButton
                    type="bill"
                    onEdit={() => {
                      setEditModalOpen(bill);
                    }}
                    onDelete={() => {
                      setDeleteModalOpen(bill);
                    }}
                  />
                </Stack>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default BillsTable;
