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
  formatDate,
  formatNumber,
  getInitials,
  getRandomColor,
} from "../../utils/utilityFunctions";
import Button from "../../utilityComponents/Button";

const BillsTable = ({ bills }: { bills: RecurringBill[] }) => {
  return (
    <Table
      sx={{
        "& td, & th": { paddingX: "0" },
      }}
    >
      <TableHead sx={{ display: { xs: "none", sm: "table-header-group" } }}>
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
          return (
            <TableRow
              key={bill.id}
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
                      backgroundColor: getRandomColor(),
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
                  textAlign: "left",
                  color: theme.palette.primary.light,
                  fontSize: "12px",
                }}
              >
                {formatDate(bill.dueDate)}
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "right",
                  color: theme.palette.primary.main,
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                ${formatNumber(Math.abs(bill.amount))}
              </TableCell>
              <TableCell>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  width="100%"
                >
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
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default BillsTable;
