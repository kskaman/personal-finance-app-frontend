import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
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
  recurringId?: string;
  dueDate?: string;
}

interface AddEditTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
  initialData?: FormValues;
  recurringOptions: { label: string; value: string }[];
}

// Yup validation schema – note that recurringId is required only when paymentType is "recurring"
const buildSchema = () =>
  yup.object({
    name: yup.string().required("Transaction Name is required"),
    category: yup.string().required("Category is required"),
    date: yup
      .string()
      .required("Date is required")
      .matches(
        /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
        "Date must be in dd/mm/yyyy format"
      )
      .test("valid-date", "Enter a valid date", (value) => {
        if (!value) return false;
        const [day, month, year] = value.split("/").map(Number);
        const dateObj = new Date(year, month - 1, day);
        // Check that the constructed date matches the input (to catch invalid dates like 31/02/2025)
        return (
          dateObj.getFullYear() === year &&
          dateObj.getMonth() === month - 1 &&
          dateObj.getDate() === day
        );
      })
      .test("not-future", "Date cannot be in the future", (value) => {
        if (!value) return false;
        const [day, month, year] = value.split("/").map(Number);
        const dateObj = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return dateObj <= today;
      }),
    amount: yup
      .string()
      .required("Amount is required")
      .matches(/^\d+(\.\d{0,2})?$/, "Enter a valid number (up to 2 decimals)"),
    paymentType: yup
      .string()
      .oneOf(["oneTime", "recurring"])
      .required("Select a payment type"),
    recurringId: yup.string().when("paymentType", (paymentType, schema) => {
      const pt = Array.isArray(paymentType) ? paymentType[0] : paymentType;
      return pt === "recurring"
        ? schema.required("Select a recurring bill or add new")
        : schema.notRequired();
    }),
  });

const AddEditTransactionModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  recurringOptions,
}: AddEditTransactionModalProps) => {
  const { control, handleSubmit, reset, trigger, watch } = useForm<FormValues>({
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

  // Watch paymentType and recurringId for conditional rendering.
  const watchPaymentType = watch("paymentType");
  const watchRecurringId = watch("recurringId");

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      heading={initialData ? "Edit Transaction" : "Add New Transaction"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="20px">
          {/* Payment Type Radio Buttons */}
          <Typography
            fontSize="12px"
            color={theme.palette.primary.light}
            fontWeight="bold"
          >
            Payment Type
          </Typography>
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

          {/* If recurring payment is selected, show the recurring fields */}
          {watchPaymentType === "recurring" && (
            <>
              {/* Recurring Bills Dropdown */}
              <Controller
                name="recurringId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <ModalSelectDropdown
                    value={field.value || ""}
                    onChange={field.onChange}
                    options={[
                      ...recurringOptions,
                      { label: "Add New Bill", value: "new" },
                    ]}
                    label="Recurring Bills"
                    error={error}
                  />
                )}
              />

              {/* Due Date for the recurring bill */}
              <Controller
                name="dueDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <ModalTextField
                    value={field.value || ""}
                    label="Due Date"
                    placeholder="dd"
                    error={error}
                    onChange={field.onChange}
                    onBlur={() => {
                      field.onBlur();
                      if (field.value && field.value.trim() !== "") {
                        trigger(field.name);
                      }
                    }}
                  />
                )}
              />
            </>
          )}

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
                label="Date"
                placeholder="dd/mm/yyyy"
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

export default AddEditTransactionModal;
