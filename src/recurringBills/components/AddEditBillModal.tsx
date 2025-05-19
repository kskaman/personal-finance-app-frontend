import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { lighten, Stack, Typography, useTheme } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ModalSelectDropdown from "../../ui/ModalSelectDropdown";
import Button from "../../ui/Button";
import { categories } from "../../data/categories";
import { dateOptions } from "../../data/dates";
import ActionModal from "../../ui/ActionModal";
import ModalTextField from "../../ui/ModalTextField";

// Types & Interfaces
export interface BillFormValues {
  name: string;
  category: string;
  amount: string;
  dueDate: string;
}

interface AddEditBillModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BillFormValues) => void;
  // if billData is provided, we're in edit mode
  billData?: {
    id: string;
    name: string;
    category: string;
    amount: number;
    dueDate: string;
  };
}

// Yup Schema – all fields required.
const buildSchema = () =>
  yup.object({
    name: yup.string().required("Bill Name is required"),
    category: yup.string().required("Category is required"),
    amount: yup
      .string()
      .required("Amount is required")
      .matches(/^\d+(\.\d{0,2})?$/, "Enter a valid number (up to 2 decimals)")
      .test(
        "positive",
        "Amount must be positive",
        (value) => Number(value) > 0
      ),
    dueDate: yup.string().required("Due Date is required"),
  });

const AddEditBillModal = ({
  open,
  onClose,
  onSubmit,
  billData,
}: AddEditBillModalProps) => {
  const theme = useTheme();
  const { control, handleSubmit, reset } = useForm<BillFormValues>({
    resolver: yupResolver(buildSchema()),
    mode: "onChange",
    defaultValues: {
      name: "",
      category: "",
      amount: "",
      dueDate: "",
    },
  });

  // Reset the form when modal opens or billData changes.
  useEffect(() => {
    if (billData) {
      reset({
        name: billData.name,
        category: billData.category,
        amount: Math.abs(billData.amount).toFixed(2),
        dueDate: billData.dueDate,
      });
    } else {
      reset({
        name: "",
        category: "",
        amount: "",
        dueDate: "",
      });
    }
  }, [billData, open, reset]);

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      heading={billData ? "Edit Recurring Bill" : "Add New Recurring Bill"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="20px">
          <Typography fontSize="14px" color={theme.palette.primary.light}>
            Please enter the bill details below. Changes in Bill Name or
            Category will reflect across all related transactions.
          </Typography>

          {/* Bill Name Field */}
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <ModalTextField
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={error}
                label="Bill Name / Recipient"
                placeholder="Enter bill name"
                adornmentTextFlag={false}
              />
            )}
          />

          {/* Category Dropdown */}
          <Controller
            name="category"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <ModalSelectDropdown
                value={field.value}
                onChange={field.onChange}
                options={categories.map((cat) => ({ value: cat, label: cat }))}
                label="Category"
                error={error}
              />
            )}
          />

          {/* Amount Field */}
          <Controller
            name="amount"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <ModalTextField
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={error}
                label="Amount"
                placeholder="0.00"
              />
            )}
          />

          {/* Due Date Dropdown */}
          <Controller
            name="dueDate"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <ModalSelectDropdown
                value={field.value}
                onChange={field.onChange}
                options={dateOptions}
                label="Due Date"
                error={error}
              />
            )}
          />

          {/* SAVE BUTTON */}
          <Button
            type="submit"
            width="100%"
            height="53px"
            backgroundColor={theme.palette.primary.main}
            color={theme.palette.text.primary}
            hoverColor={theme.palette.text.primary}
            hoverBgColor={lighten(theme.palette.primary.main, 0.2)}
            onClick={() => {}}
          >
            <Typography fontSize="14px" fontWeight="bold">
              {billData ? "Save Changes" : "Add Bill"}
            </Typography>
          </Button>
        </Stack>
      </form>
    </ActionModal>
  );
};

export default AddEditBillModal;
