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
import { Transaction } from "../../types/Data";
import theme from "../../theme/theme";
import {
  formatDate,
  formatNumber,
  getInitials,
} from "../../utils/utilityFunctions";
import Button from "../../utilityComponents/Button";

interface Props {
  txns: Transaction[];
  parentWidth: number;
}

const TransactionsTable = ({ txns, parentWidth }: Props) => {
  return (
    <Table>
      {/* Table Head (Visible only on larger screens) */}
      <TableHead
        sx={{
          // Keep it in DOM but hide
          visibility: parentWidth < 600 ? "hidden" : "visible",
          // Ensure no layout shifts
          height: parentWidth < 600 ? 0 : "auto",
          // Smooth transition
          opacity: parentWidth < 600 ? 0 : 1,
          // Smooth fade-in effect
          transition: "opacity 0.3s ease-in-out",
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
              display: parentWidth < 600 ? "flex" : "table-row",
              "&:last-child td": { border: 0 },
            }}
          >
            {/* MOBILE VIEW (Condensed layout for small screens) */}
            {parentWidth < 600 && (
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
                {/* Name + Avatar */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
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
                      marginRight: "8px",
                    }}
                  >
                    {txn.amount < 0 ? "-" : "+"}$
                    {formatNumber(Math.abs(txn.amount))}
                  </Typography>

                  {/* Action Button */}
                  <Button
                    height="20px"
                    backgroundColor="inherit"
                    color={theme.palette.primary.light}
                    hoverBgColor={theme.palette.text.primary}
                    hoverColor="inherit"
                    onClick={() => console.log("clicked ...")}
                    borderColor={theme.palette.text.primary}
                  >
                    <Typography>...</Typography>
                  </Button>
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
            {parentWidth >= 600 && (
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
                  {txn.amount < 0 ? "-" : "+"}$
                  {formatNumber(Math.abs(txn.amount))}
                </TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  <Button
                    height="20px"
                    backgroundColor="inherit"
                    color={theme.palette.primary.light}
                    hoverBgColor={theme.palette.text.primary}
                    hoverColor="inherit"
                    onClick={() => console.log("clicked ...")}
                    borderColor={theme.palette.text.primary}
                  >
                    <Typography>...</Typography>
                  </Button>
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
