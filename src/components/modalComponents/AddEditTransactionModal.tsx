import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Box,
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
  txnName: string;
  category: string;
  date: string;
  amount: string;
  paymentType: "oneTime" | "recurring";
  paymentDirection: "paid" | "received";
  recurringId?: string;
  dueDate?: string;
}

interface AddEditTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
  txnData?: FormValues;
  recurringOptions: {
    label: string;
    value: string;
    dueDate: string;
    category: string;
    name: string;
    amount: string;
  }[];
}

// Yup validation schema – note that recurringId is required only when paymentType is "recurring"
const buildSchema = () =>
  yup.object({
    txnName: yup.string().required("Transaction Name is required"),
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
      .test(
        "positive",
        "Amount must be positive",
        (value) => parseFloat(value || "0") > 0
      )
      .matches(
        /^\d+(\.\d{0,2})?$/,
        "Enter a valid positive number (up to 2 decimals)"
      ),

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
    paymentDirection: yup
      .string()
      .oneOf(["paid", "received"])
      .required("Select a payment direction"),
    dueDate: yup.string().when("paymentType", (paymentType, schema) => {
      const pt = Array.isArray(paymentType) ? paymentType[0] : paymentType;
      return pt === "recurring"
        ? schema
            .required("Due Date is required")
            .test(
              "is-valid-day",
              "Due Date must be between 1 and 31 inclusive.",
              (value) => {
                const day = Number(value);
                return day >= 1 && day <= 31;
              }
            )
        : schema.notRequired();
    }),
  });

const AddEditTransactionModal = ({
  open,
  onClose,
  onSubmit,
  txnData,
  recurringOptions,
}: AddEditTransactionModalProps) => {
  const { control, handleSubmit, reset, trigger, watch, getValues, setValue } =
    useForm<FormValues>({
      resolver: yupResolver(buildSchema()),
      mode: "onChange",
      defaultValues: {
        txnName: "",
        category: "",
        date: "",
        amount: "",
        paymentType: "oneTime",
        paymentDirection: "paid",
      },
    });

  const categoryOptions = categories.map((cat: string) => ({
    value: cat,
    label: cat,
  }));

  // Reset the form values whenever the modal is opened or initialData changes
  useEffect(() => {
    if (txnData) {
      reset(txnData);
    } else {
      reset({
        txnName: "",
        category: "",
        date: "",
        amount: "",
        paymentType: "oneTime",
        recurringId: "new",
        paymentDirection: "paid",
      });
    }
  }, [txnData, open, reset]);

  // Watch paymentType and recurringId for conditional rendering.
  const watchPaymentType = watch("paymentType");
  const watchRecurringId = watch("recurringId");

  useEffect(() => {
    if (watchPaymentType === "recurring") {
      // Force "paid"
      setValue("paymentDirection", "paid");
    }
  }, [watchPaymentType, setValue]);

  // Create a flag for saved recurring bill (not "new")
  const isSavedRecurring =
    (watchPaymentType === "recurring" &&
      watchRecurringId &&
      watchRecurringId !== "new") ||
    false;

  // if user switches to "recurring" and has no recurringId, default to "new"
  useEffect(() => {
    if (watchPaymentType === "recurring") {
      if (!watchRecurringId || watchRecurringId.trim() === "") {
        setValue("recurringId", "new");
      }
    }
  }, [watchPaymentType, watchRecurringId, setValue]);

  // When a recurring transaction is selected and a recurringId other than "new" is chosen,
  // update the form with the recurring bill's category and dueDate.
  useEffect(() => {
    if (
      watchPaymentType === "recurring" &&
      watchRecurringId &&
      watchRecurringId !== "new"
    ) {
      const selectedRecurring = recurringOptions.find(
        (opt) => opt.value === watchRecurringId
      );
      if (selectedRecurring) {
        // update only the specific fields with setValue.
        setValue("paymentDirection", "paid");
        setValue("category", selectedRecurring.category);
        setValue("dueDate", selectedRecurring.dueDate);
        setValue("txnName", selectedRecurring.name);
        setValue("amount", selectedRecurring.amount);
      }
    }
  }, [
    recurringOptions,
    watchPaymentType,
    watchRecurringId,
    getValues,
    setValue,
  ]);

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      heading={txnData ? "Edit Transaction" : "Add New Transaction"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="20px">
          {/* Payment Type Radio Buttons */}
          <Stack gap={"4px"}>
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
                  <RadioGroup
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  >
                    <Stack direction="row" justifyContent="space-evenly">
                      <FormControlLabel
                        value="oneTime"
                        control={<Radio />}
                        label="One-Time"
                      />
                      <FormControlLabel
                        value="recurring"
                        control={<Radio />}
                        label="Recurring"
                      />
                    </Stack>
                  </RadioGroup>
                </FormControl>
              )}
            />
          </Stack>

          {/* Always render the recurring fields, but hide them if paymentType is not recurring */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            display={watchPaymentType === "recurring" ? "flex" : "none"}
            gap={2}
          >
            {/* Recurring Bills Dropdown */}
            <Box flex={2}>
              <Controller
                name="recurringId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <ModalSelectDropdown
                    value={field.value || ""}
                    onChange={field.onChange}
                    options={[
                      { label: "Add New Bill", value: "new" },
                      ...recurringOptions,
                    ]}
                    label="Recurring Bills"
                    error={error}
                  />
                )}
              />
            </Box>

            <Box flex={1}>
              {/* Due Date for the recurring bill */}
              <Controller
                name="dueDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <ModalTextField
                    isDisabled={isSavedRecurring}
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
            </Box>
          </Stack>

          {/* Transaction Name */}
          <Controller
            name="txnName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <ModalTextField
                isDisabled={isSavedRecurring}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={error}
                label="Recipient/Sender"
                placeholder=""
              />
            )}
          />

          <Stack direction={{ xs: "column", sm: "row" }} gap={1}>
            <Box flex={2}>
              {/* Category */}
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <ModalSelectDropdown
                    isDisabled={isSavedRecurring}
                    value={field.value}
                    onChange={field.onChange}
                    options={categoryOptions}
                    label={"Category"}
                  />
                )}
              />
            </Box>
            <Box flex={1}>
              {/* Date */}
              <Controller
                name="date"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <ModalTextField
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={error}
                    label="Date"
                    placeholder="dd/mm/yyyy"
                  />
                )}
              />
            </Box>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }}>
            <Stack flex={1}>
              {/* Payment Direction */}
              <Typography
                fontSize="12px"
                color={theme.palette.primary.light}
                fontWeight="bold"
                marginBottom={"4px"}
              >
                Payment Direction
              </Typography>
              <Controller
                name="paymentDirection"
                control={control}
                render={({ field }) => (
                  <FormControl component="fieldset">
                    <RadioGroup
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    >
                      <Stack direction="row" justifyContent="space-evenly">
                        <FormControlLabel
                          value="paid"
                          control={<Radio />}
                          label="Paid"
                        />
                        <FormControlLabel
                          value="received"
                          control={<Radio />}
                          label="Received"
                          disabled={watchPaymentType === "recurring"}
                        />
                      </Stack>
                    </RadioGroup>
                  </FormControl>
                )}
              />
            </Stack>

            <Box flex={1}>
              {/* Amount */}
              <Controller
                name="amount"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <ModalTextField
                    isDisabled={isSavedRecurring}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={error}
                    label="Amount"
                    placeholder="0.00"
                    adornmentText="$"
                  />
                )}
              />
            </Box>
          </Stack>

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
