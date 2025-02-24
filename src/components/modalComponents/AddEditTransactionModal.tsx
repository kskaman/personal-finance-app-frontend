import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ActionModal from "./ActionModal";
import ModalSelectDropdown from "./ModalSelectDropdown";
import theme from "../../theme/theme";
import ModalTextField from "./ModalTextField";
import { categories } from "../../data/categories";
import Button from "../../utilityComponents/Button";
import { hexToRGBA } from "../../utils/utilityFunctions";

// Interfaces and Props
interface FormValues {
  name: string;
  category: string;
  date: string;
  amount: string;
  paymentType: "oneTime" | "recurring";
}

interface AddEditTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
  initialData?: FormValues;
}

// Yup validation schema – note that recurringId is required only when paymentType is "recurring"
const buildSchema = () =>
  yup.object({
    name: yup.string().required("Transaction Name is required"),
    category: yup.string().required("Category is required"),
    date: yup.string().required("Date is required"),
    amount: yup
      .string()
      .required("Amount is required")
      .matches(/^\d+(\.\d{0,2})?$/, "Enter a valid number (up to 2 decimals)"),
    paymentType: yup
      .string()
      .oneOf(["oneTime", "recurring"])
      .required("Select a payment type"),
  });

const AddEditTransactionModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
}: AddEditTransactionModalProps) => {
  const { control, handleSubmit, reset, trigger } = useForm<FormValues>({
    resolver: yupResolver(buildSchema()),
    defaultValues: initialData || {
      name: "",
      category: "",
      date: "",
      amount: "",
      paymentType: "oneTime",
    },
  });

  const categoryOptions = categories.map((cat: string) => ({
    value: cat,
    label: cat,
  }));

  // Reset the form values whenever the modal is opened or initialData changes
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        name: "",
        category: "",
        date: "",
        amount: "",
        paymentType: "oneTime",
      });
    }
  }, [initialData, open, reset]);

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      heading={initialData ? "Edit Transaction" : "Add New Transaction"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="20px">
          {/* Payment Type Radio Buttons */}
          <Typography variant="subtitle1">Payment Type</Typography>
          <Controller
            name="paymentType"
            control={control}
            render={({ field }) => (
              <FormControl component="fieldset">
                <RadioGroup row {...field}>
                  <FormControlLabel
                    value="oneTime"
                    control={<Radio />}
                    label="One-Time Payment"
                  />
                  <FormControlLabel
                    value="recurring"
                    control={<Radio />}
                    label="Recurring Payment"
                  />
                </RadioGroup>
              </FormControl>
            )}
          />

          {/* Transaction Name */}
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <ModalTextField
                value={field.value}
                onChange={field.onChange}
                onBlur={() => {
                  field.onBlur();
                  if (field.value.trim() !== "") {
                    trigger(field.name);
                  }
                }}
                error={error}
                label="Recipient/Sender"
                placeholder=""
              />
            )}
          />

          {/* Category */}
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <ModalSelectDropdown
                value={field.value}
                onChange={field.onChange}
                options={categoryOptions}
                label={"Category"}
              />
            )}
          />

          {/* Date */}
          <Controller
            name="date"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!error}
                helperText={error ? error.message : ""}
                fullWidth
              />
            )}
          />

          {/* Amount */}
          <Controller
            name="amount"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <ModalTextField
                value={field.value}
                onChange={field.onChange}
                onBlur={() => {
                  field.onBlur();
                  if (field.value.trim() !== "") {
                    trigger(field.name);
                  }
                }}
                error={error}
                label="Amount"
                placeholder="0.00"
                adornmentText="$"
              />
            )}
          />

          {/* Action Buttons */}
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
              {initialData ? "Add Transaction" : "Save Changes"}
            </Typography>
          </Button>
        </Stack>
      </form>
    </ActionModal>
  );
};

export default AddEditTransactionModal;
