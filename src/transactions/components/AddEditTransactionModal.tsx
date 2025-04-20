import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Box,
  FormControl,
  FormControlLabel,
  lighten,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ModalSelectDropdown from "../../ui/ModalSelectDropdown";
import Button from "../../ui/Button";
import { categories } from "../../data/categories";
import ActionModal from "../../ui/ActionModal";
import ModalTextField from "../../ui/ModalTextField";

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

// Yup validation schema – recurringId and dueDate required only for recurring
const buildSchema = () =>
  yup.object({
    txnName: yup.string().required("Transaction Name is required"),
    category: yup.string().required("Category is required"),
    date: yup
      .string()
      .required("Date is required")
      .matches(
        /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
        "Enter a valid date in dd/mm/yyyy format"
      )
      .test("valid-date", "Enter a valid date", (value) => {
        if (!value) return false;
        const [day, month, year] = value.split("/").map(Number);
        const dateObj = new Date(year, month - 1, day);
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
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    watch,
    reset,
    getValues,
    setValue,
    clearErrors,
  } = useForm<FormValues>({
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

  // State for inline confirmation override
  const [pendingConfirmation, setPendingConfirmation] = useState<{
    recurringData: {
      name: string;
      category: string;
      amount: string;
      dueDate: string;
    };
    newRecurringId: string;
  } | null>(null);

  // Reset form on open or when txnData changes.
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
    setPendingConfirmation(null);
  }, [txnData, open, reset]);

  // Watch paymentType and recurringId.
  const watchPaymentType = watch("paymentType");
  const watchRecurringId = watch("recurringId");

  // Force "paid" when recurring is selected.
  useEffect(() => {
    if (watchPaymentType === "recurring") {
      setValue("paymentDirection", "paid");
    }
  }, [watchPaymentType, setValue]);

  // Default to "new" if recurring is selected and recurringId is empty.
  useEffect(() => {
    if (
      watchPaymentType === "recurring" &&
      (!watchRecurringId || watchRecurringId.trim() === "")
    ) {
      setValue("recurringId", "new");
    }
  }, [watchPaymentType, watchRecurringId, setValue]);

  // When a saved recurring bill is selected, check if form data differs.
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
        const currentName = getValues("txnName") || "";
        const currentCategory = getValues("category") || "";
        const currentAmount = getValues("amount") || "";
        const currentDueDate = getValues("dueDate") || "";
        if (
          (currentName !== "" ||
            currentCategory !== "" ||
            currentAmount !== "" ||
            currentDueDate !== "") &&
          (currentName !== selectedRecurring.name ||
            currentCategory !== selectedRecurring.category ||
            currentAmount !== selectedRecurring.amount ||
            currentDueDate !== selectedRecurring.dueDate)
        ) {
          // Set pending confirmation instead of immediately overriding.
          setPendingConfirmation({
            recurringData: {
              name: selectedRecurring.name,
              category: selectedRecurring.category,
              amount: selectedRecurring.amount,
              dueDate: selectedRecurring.dueDate,
            },
            newRecurringId: selectedRecurring.value,
          });
        } else {
          setPendingConfirmation(null);
          // Update fields with recurring data (if already matching, no confirmation needed).
          setValue("paymentDirection", "paid");
          setValue("category", selectedRecurring.category);
          setValue("dueDate", selectedRecurring.dueDate);
          setValue("txnName", selectedRecurring.name);
          setValue("amount", selectedRecurring.amount);
        }
      }
    } else {
      // Clear confirmation if not recurring or "new" is selected.
      setPendingConfirmation(null);
    }
  }, [
    recurringOptions,
    watchPaymentType,
    watchRecurringId,
    getValues,
    setValue,
  ]);

  useEffect(() => {
    // As soon as paymentType changes, clear all validation errors.
    clearErrors();
  }, [watchPaymentType, clearErrors]);

  // Handlers for inline confirmation buttons.
  const handleProceedConfirmation = () => {
    if (pendingConfirmation) {
      const { recurringData } = pendingConfirmation;
      setValue("paymentDirection", "paid");
      setValue("category", recurringData.category);
      setValue("dueDate", recurringData.dueDate);
      setValue("txnName", recurringData.name);
      setValue("amount", recurringData.amount);
      // Confirm the selection by leaving the recurringId as is.
      setPendingConfirmation(null);
    }
  };

  const handleCancelConfirmation = () => {
    // Revert the recurringId to "new" and clear pending confirmation.
    setValue("recurringId", "new");
    setPendingConfirmation(null);
  };

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      heading={txnData ? "Edit Transaction" : "Add New Transaction"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="20px">
          {/* Payment Type Radio Buttons */}
          <Stack gap="4px">
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
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            color: theme.palette.primary.main,
                          },
                        }}
                      />
                      <FormControlLabel
                        value="recurring"
                        control={<Radio />}
                        label="Recurring"
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            color: theme.palette.primary.main,
                          },
                        }}
                      />
                    </Stack>
                  </RadioGroup>
                </FormControl>
              )}
            />
          </Stack>

          {/* Recurring Fields */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            display={watchPaymentType === "recurring" ? "flex" : "none"}
            gap={2}
          >
            {/* Recurring Bills Dropdown */}
            <Box flex={3}>
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

            <Box flex={2}>
              {/* Due Date for recurring bill */}
              <Controller
                name="dueDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <ModalTextField
                    isDisabled={
                      watchPaymentType === "recurring" &&
                      watchRecurringId !== "new"
                    }
                    value={field.value || ""}
                    label="Due Date"
                    placeholder="dd"
                    error={error}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    adornmentTextFlag={false}
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
                isDisabled={
                  watchPaymentType === "recurring" && watchRecurringId !== "new"
                }
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={error}
                label="Recipient/Sender"
                placeholder=""
                adornmentTextFlag={false}
              />
            )}
          />

          <Stack direction={{ xs: "column", sm: "row" }} gap={1}>
            <Box flex={5}>
              {/* Category */}
              <Controller
                name="category"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <ModalSelectDropdown
                    isDisabled={
                      watchPaymentType === "recurring" &&
                      watchRecurringId !== "new"
                    }
                    value={field.value}
                    onChange={field.onChange}
                    options={categoryOptions}
                    label="Category"
                    error={error}
                  />
                )}
              />
            </Box>
            <Box flex={4}>
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
                    adornmentTextFlag={false}
                  />
                )}
              />
            </Box>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} gap={1}>
            <Stack flex={1}>
              {/* Payment Direction */}
              <Typography
                fontSize="12px"
                color={theme.palette.primary.light}
                fontWeight="bold"
                marginBottom="4px"
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
                          sx={{
                            "& .MuiFormControlLabel-label": {
                              color: theme.palette.primary.main,
                            },
                          }}
                        />
                        <FormControlLabel
                          value="received"
                          control={<Radio />}
                          label="Received"
                          disabled={watchPaymentType === "recurring"}
                          sx={{
                            "& .MuiFormControlLabel-label": {
                              color: theme.palette.primary.main,
                            },
                          }}
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
                    isDisabled={
                      watchPaymentType === "recurring" &&
                      watchRecurringId !== "new"
                    }
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={error}
                    label="Amount"
                    placeholder="0.00"
                  />
                )}
              />
            </Box>
          </Stack>

          {/* Inline Confirmation UI */}
          {pendingConfirmation ? (
            <Stack spacing={1} mt={1}>
              <Typography fontSize={"14px"} color={theme.palette.others.red}>
                Warning: Selecting a saved recurring bill will overwrite your
                current data with the saved bill's details.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  onClick={handleProceedConfirmation}
                  backgroundColor={theme.palette.others.red}
                  width="100%"
                  height="53px"
                  color={theme.palette.text.primary}
                  hoverColor={theme.palette.text.primary}
                  hoverBgColor={lighten(theme.palette.others.red, 0.2)}
                >
                  <Typography fontSize="14px" fontWeight="bold">
                    Proceed
                  </Typography>
                </Button>
                <Button
                  onClick={handleCancelConfirmation}
                  backgroundColor={theme.palette.text.primary}
                  width="100%"
                  height="53px"
                  color={theme.palette.primary.light}
                  hoverColor={theme.palette.primary.light}
                  hoverBgColor={theme.palette.text.primary}
                >
                  <Typography fontSize="14px" fontWeight="bold">
                    Cancel
                  </Typography>
                </Button>
              </Stack>
            </Stack>
          ) : (
            // Save Button when no confirmation is pending.
            <Button
              type="submit"
              width="100%"
              height="53px"
              backgroundColor={theme.palette.primary.main}
              onClick={() => {}}
              color={theme.palette.text.primary}
              hoverColor={theme.palette.text.primary}
              hoverBgColor={lighten(theme.palette.primary.main, 0.2)}
            >
              <Typography fontSize="14px" fontWeight="bold">
                {txnData ? "Save Changes" : "Confirm Transaction"}
              </Typography>
            </Button>
          )}
        </Stack>
      </form>
    </ActionModal>
  );
};

export default AddEditTransactionModal;
