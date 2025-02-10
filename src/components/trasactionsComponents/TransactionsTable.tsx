import {
  Avatar,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Transaction } from "../../types/Data";
import theme from "../../theme/theme";
import {
  formatDate,
  formatNumber,
  getInitials,
} from "../../utils/utilityFunctions";

interface Props {
  txns: Transaction[];
}

const TransactionsTable = ({ txns }: Props) => {
  return (
    <Table>
      <TableHead sx={{ display: { xs: "none", sm: "table-header-group" } }}>
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
        </TableRow>
      </TableHead>

      <TableBody>
        {txns.map((txn) => {
          return (
            <TableRow
              key={txn.id}
              sx={{
                "&:last-child td": { border: 0 },
              }}
            >
              <TableCell
                sx={{
                  height: "100%",
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
                  color:
                    txn.amount < 0
                      ? theme.palette.primary.main
                      : theme.palette.others.green,
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {txn.amount < 0 ? "-" : "+"}$
                {formatNumber(Math.abs(txn.amount))}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TransactionsTable;
