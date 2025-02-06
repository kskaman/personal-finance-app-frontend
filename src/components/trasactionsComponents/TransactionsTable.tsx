import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Transaction } from "../../types/Data";

interface Props {
  txns: Transaction[];
}

const TransactionsTable = ({ txns }: Props) => {
  return (
    <Table>
      <TableHead sx={{ display: { xs: "none", sm: "block" } }}>
        <TableRow>
          <TableCell>Recipient/Sender</TableCell>
          <TableCell>Category</TableCell>
          <TableCell>Transaction Date</TableCell>
          <TableCell>Amount</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {txns.map((txn) => (
          <TableRow key={txn.date}>
            <TableCell>{txn.name}</TableCell>
            <TableCell>{txn.category}</TableCell>
            <TableCell>{txn.date}</TableCell>
            <TableCell>{txn.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TransactionsTable;
