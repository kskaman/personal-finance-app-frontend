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
} from "@mui/material";
import { RecurringBill } from "../../types/Data";
import theme from "../../theme/theme";
import {
  dateSuffix,
  formatNumber,
  getInitials,
} from "../../utils/utilityFunctions";
import PaidIcon from "../../Icons/PaidIcon";
import DueIcon from "../../Icons/DueIcon";
import OptionsButton from "../modalComponents/OptionsButton";
import { MD_SM_BREAK } from "../../data/widthConstants";

const getBillStatus = (lastPaid: string, dueDate: string) => {
  let status = "unpaid";

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastPaidDate = lastPaid ? new Date(lastPaid) : null;
  const dueDateObj =
    dueDate && !isNaN(Number(dueDate))
      ? new Date(now.getFullYear(), now.getMonth(), Number(dueDate))
      : null;

  if (lastPaidDate && lastPaidDate >= startOfMonth) {
    status = "paid";
  } else {
    const diffDays =
      dueDateObj &&
      Math.ceil((dueDateObj.getTime() - now.getTime()) / (1000 * 3600 * 24));
    const isDueSoon = dueDateObj && diffDays && diffDays <= 3;
    if (isDueSoon) status = "due";
  }
  return status;
};

const BillsTable = ({
  bills,
  parentWidth,
}: {
  bills: RecurringBill[];
  parentWidth: number;
}) => {
  const isParentWidth = parentWidth < MD_SM_BREAK;

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
                    <Typography fontSize="14px" fontWeight="bold">
                      {bill.name}
                    </Typography>
                  </Box>
                  <OptionsButton
                    type="bill"
                    onEdit={() => console.log("Edit Bill")}
                    onDelete={() => console.log("Delete Bill")}
                  />
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
                      fontSize="12px"
                      color={theme.palette.others.green}
                    >
                      {`Monthly~${bill.dueDate}${
                        dateSuffix[bill.dueDate as keyof typeof dateSuffix]
                      }`}
                    </Typography>
                    {status === "paid" ? (
                      <PaidIcon />
                    ) : status === "due" ? (
                      <DueIcon color={theme.palette.others.red} />
                    ) : (
                      ""
                    )}
                  </Stack>
                  <Typography
                    fontSize="14px"
                    fontWeight="bold"
                    color={
                      status === "due"
                        ? theme.palette.others.red
                        : theme.palette.primary.main
                    }
                  >
                    ${formatNumber(Math.abs(bill.amount))}
                  </Typography>
                </Stack>
              </TableCell>

              {/* Default Table Format for Tablet & PC */}
              <TableCell
                sx={{
                  display: isParentWidth ? "none" : "table-cell",
                  textAlign: "left",
                  color: theme.palette.primary.main,
                  fontWeight: "bold",
                  fontSize: "14px",
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
                  color: theme.palette.others.green,
                  fontSize: "12px",
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
                  ) : status === "due" ? (
                    <DueIcon color={theme.palette.others.red} />
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
                    status === "due"
                      ? theme.palette.others.red
                      : theme.palette.primary.main,
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                ${formatNumber(Math.abs(bill.amount))}
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
                >
                  <OptionsButton
                    type="bill"
                    onEdit={() => console.log("Edit Bill")}
                    onDelete={() => console.log("Delete Bill")}
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
