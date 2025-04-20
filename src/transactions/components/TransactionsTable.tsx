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
import { Transaction } from "../../types/Data";
import {
  formatDate,
  formatNumber,
  getInitials,
} from "../../utils/utilityFunctions";
import { MD_SM_BREAK } from "../../data/widthConstants";
import { useContext } from "react";
import { SettingsContext } from "../../context/SettingsContext";
import OptionsButton from "../../ui/OptionsButton";

interface Props {
  txns: Transaction[];
  parentWidth: number;
  setDeleteModalOpen: (txn: Transaction) => void;
  setEditModalOpen: (txn: Transaction) => void;
}

const TransactionsTable = ({
  txns,
  parentWidth,
  setDeleteModalOpen,
  setEditModalOpen,
}: Props) => {
  const theme = useTheme();
  const isParentWidth = parentWidth < MD_SM_BREAK;
  const currencySymbol = useContext(SettingsContext).selectedCurrency;

  return (
    <Table
      sx={{
        "& td, & th": { paddingX: "0" },
      }}
    >
      {/* Table Head (Visible only on larger screens) */}
      <TableHead
        sx={{
          // Keep it in DOM but hide
          display: isParentWidth ? "none" : "table-header-group",
          // Smooth transition
          opacity: isParentWidth ? 0 : 1,
          // Smooth fade-in effect
          transition: "opacity 0.3s ease",
        }}
      >
        <TableRow>
          <TableCell
            sx={{
              fontSize: "12px",
              color: theme.palette.primary.light,
              textAlign: "left",
            }}
          >
            Recipient/Sender
          </TableCell>
          <TableCell
            sx={{
              fontSize: "12px",
              color: theme.palette.primary.light,
              textAlign: "left",
            }}
          >
            Category
          </TableCell>
          <TableCell
            sx={{
              fontSize: "12px",
              color: theme.palette.primary.light,
              textAlign: "left",
            }}
          >
            Transaction Date
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
        {txns.map((txn) => (
          <TableRow
            key={txn.id}
            sx={{
              width: "100%",
              display: isParentWidth ? "flex" : "table-row",
              "&:last-child td": { border: 0 },
            }}
          >
            {/* MOBILE VIEW (Condensed layout for small screens) */}
            {isParentWidth && (
              <TableCell
                sx={{
                  display: "flex",
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
                  {/* Name + Avatar */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      maxWidth: "80%",
                    }}
                  >
                    <Avatar
                      sx={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: theme.palette.primary.contrastText,
                        backgroundColor: txn.theme,
                        width: "32px",
                        height: "32px",
                        marginRight: "12px",
                      }}
                    >
                      {getInitials(txn.name)}
                    </Avatar>
                    <Typography
                      sx={{
                        color: theme.palette.primary.main,
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {txn.name}
                    </Typography>
                  </Box>

                  {/* Transaction Amount */}
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color:
                        txn.amount < 0
                          ? theme.palette.primary.main
                          : theme.palette.others.green,
                      marginLeft: "auto",
                    }}
                  >
                    {txn.amount < 0 ? "-" : "+"}
                    {`${currencySymbol}${formatNumber(Math.abs(txn.amount))}`}
                  </Typography>

                  {/* Action Button */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                    marginLeft={{ xs: "4px", sm: "16px" }}
                  >
                    <OptionsButton
                      type="transaction"
                      onEdit={() => setEditModalOpen(txn)}
                      onDelete={() => setDeleteModalOpen(txn)}
                    />
                  </Stack>
                </Stack>

                {/* Category + Date (Below Name) */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  color={theme.palette.primary.light}
                  fontSize="12px"
                  width="100%"
                >
                  <Typography>{txn.category}</Typography>
                  <Typography>{formatDate(txn.date)}</Typography>
                </Stack>
              </TableCell>
            )}

            {/* DESKTOP VIEW (Regular Table Format) */}
            {!isParentWidth && (
              <>
                <TableCell
                  sx={{
                    textAlign: "left",
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: theme.palette.primary.main,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      sx={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: theme.palette.primary.contrastText,
                        backgroundColor: txn.theme,
                        width: "40px",
                        height: "40px",
                        marginRight: "16px",
                      }}
                    >
                      {getInitials(txn.name)}
                    </Avatar>
                    {txn.name}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "left",
                    color: theme.palette.primary.light,
                    fontSize: "12px",
                  }}
                >
                  {txn.category}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "left",
                    color: theme.palette.primary.light,
                    fontSize: "12px",
                  }}
                >
                  {formatDate(txn.date)}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "right",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color:
                      txn.amount < 0
                        ? theme.palette.primary.main
                        : theme.palette.others.green,
                  }}
                >
                  {txn.amount < 0 ? "-" : "+"}
                  {`${currencySymbol}${formatNumber(Math.abs(txn.amount))}`}
                </TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                    width="100%"
                    marginLeft={"auto"}
                  >
                    <OptionsButton
                      type="transaction"
                      onEdit={() => setEditModalOpen(txn)}
                      onDelete={() => setDeleteModalOpen(txn)}
                    />
                  </Stack>
                </TableCell>
              </>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TransactionsTable;
