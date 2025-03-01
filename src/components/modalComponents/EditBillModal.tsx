import { Controller, useForm } from "react-hook-form";
import ActionModal from "./ActionModal";
import { Box, Stack, Typography } from "@mui/material";
import theme from "../../theme/theme";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { formatDecimalNumber, hexToRGBA } from "../../utils/utilityFunctions";
import ModalTextField from "./ModalTextField";
import ModalSelectDropdown from "./ModalSelectDropdown";
import Button from "../../utilityComponents/Button";
import { dateOptions } from "../../data/dates";

// types and Interfaces
interface EditBillModalProps {
  open: boolean;
  onClose: () => void;
  billId: string;
  amount: number;
  dueDate: string;
  updateBill: (billId: string, amount: number, dueDate: string) => void;
}

interface FormValues {
  amount: string;
  dueDate: string;
}

// Yup Schema for Validation remains the same
const buildSchema = () =>
  yup.object({
    amount: yup
      .string()
      .required("Amount is required")
      .matches(/^\d+(\.\d{0,2})?$/, "Enter a valid number (up to 2 decimals).")
      .test(
        "positive",
        "Maximum spend must be a positive number",
        (value) => Number(value) > 0
      ),
    dueDate: yup.string().required("Due Date is required"),
  });

// Main Modal Component
const EditBillModal = ({
  open,
  onClose,
  billId,
  amount,
  dueDate,
  updateBill,
}: EditBillModalProps) => {
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: yupResolver(buildSchema()),
    mode: "onChange",
    defaultValues: {
      amount: formatDecimalNumber(amount).toString(),
      dueDate: dueDate,
    },
  });

  const onSubmit = (data: FormValues) => {
    updateBill(
      billId,
      (amount = parseFloat(data.amount)),
      (dueDate = data.dueDate)
    );
    onClose();
  };

  return (
    <ActionModal open={open} onClose={onClose} heading={"Edit Recurring Bill"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="20px">
          <Typography fontSize="14px" color={theme.palette.primary.light}>
            Feel free to update your Due Date and Amount.
          </Typography>

          {/* Amount Field */}
          <Controller
            name="amount"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Box>
                <ModalTextField
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={error}
                  label="Amount"
                  placeholder="0.00"
                  adornmentText="$"
                />
              </Box>
            )}
          />

          {/* Due Date Selection Filed */}
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <Box>
                <ModalSelectDropdown
                  value={field.value}
                  onChange={field.onChange}
                  options={dateOptions}
                  label={"Due Date"}
                />
              </Box>
            )}
          />

          {/* SAVE BUTTON */}
          <Button
            type="submit"
            width="100%"
            height="53px"
            backgroundColor={theme.palette.primary.main}
            onClick={() => {}}
            color={theme.palette.text.primary}
            hoverColor={theme.palette.text.primary}
            hoverBgColor={hexToRGBA(theme.palette.primary.main, 0.8)}
          >
            <Typography fontSize="14px" fontWeight="bold">
              Save Changes
            </Typography>
          </Button>
        </Stack>
      </form>
    </ActionModal>
  );
};

export default EditBillModal;
