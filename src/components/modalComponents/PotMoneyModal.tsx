import { Box, Stack, Typography } from "@mui/material";
import theme from "../../theme/theme";
import Button from "../../utilityComponents/Button";
import { hexToRGBA } from "../../utils/utilityFunctions";
import ActionModal from "./ActionModal";
import { Controller, useForm } from "react-hook-form";
import ModalTextField from "./ModalTextField";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PotsModalProgressBar from "./PotsModalProgressBar";

// Types & Interface
interface PotMoneyModalProps {
  open: boolean;
  onClose: () => void;
  type: "addMoney" | "withdraw" | null;
  potName: string;
  potTotal: number;
  potTarget: number;
  maxLimit: number;
  updatePotAmount: (val: number, amount: number) => void;
}

interface FormValues {
  amount: string;
}

// Yup Schema for Validation
const buildSchema = (
  type: "addMoney" | "withdraw" | null,
  potTotal: number,
  maxLimit: number,
  potTarget: number
) =>
  yup.object({
    amount: yup
      .string()
      .matches(/^\d+(\.\d{0,2})?$/, "Enter a valid number (up to 2 decimals).")
      .test(
        "max-limit",
        type === "addMoney"
          ? `Amount cannot exceed available funds ($${maxLimit.toFixed(2)})`
          : `Amount cannot exceed current pot total ($${potTotal.toFixed(2)})`,
        (value) => {
          const num = parseFloat(value || "0");
          if (type === "addMoney") {
            return num <= maxLimit;
          } else if (type === "withdraw") {
            return num <= potTotal;
          }
          return true;
        }
      )
      .test(
        "target-limit",
        `Amount cannot exceed the amount required to reach target ($${potTarget.toFixed(
          2
        )})`,
        (value) => {
          const num = parseFloat(value || "0");
          if (type === "addMoney") {
            return num <= potTarget - potTotal;
          }
          return true;
        }
      )
      .required("Amount is required"),
  });

// Main modal
const PotMoneyModal = ({
  open,
  onClose,
  type,
  potName,
  potTotal,
  potTarget,
  maxLimit,
  updatePotAmount,
}: PotMoneyModalProps) => {
  // Form submission handler.
  const onSubmit = (data: FormValues) => {
    const amount = parseFloat(data.amount);
    if (type === "addMoney") {
      // For adding money: increase pot total and reduce available funds (maxLimit)
      updatePotAmount(potTotal + amount, maxLimit - amount);
    } else if (type === "withdraw") {
      // For withdrawing money: decrease pot total and increase available funds (maxLimit)
      updatePotAmount(potTotal - amount, maxLimit + amount);
    }

    onClose();
  };

  // Setup React Hook Form.
  const { control, handleSubmit, trigger, watch } = useForm<FormValues>({
    resolver: yupResolver(buildSchema(type, potTotal, maxLimit, potTarget)),
    mode: "onSubmit",
  });

  const watchedAmount = parseFloat(watch("amount")) || 0;

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      heading={
        type === "addMoney"
          ? `Add to '${potName}'`
          : `Withdraw from '${potName}'`
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="20px">
          <Typography fontSize="14px" color={theme.palette.primary.light}>
            {type === "withdraw"
              ? "Withdraw from your pot to put money back in your main balance. This will reduce the amount you have in this pot."
              : "Add money to your pot to keep it separate from your main balance. As soon as you add this money, it will be deducted from your current balance."}
          </Typography>
          {potTotal && potTarget && (
            <PotsModalProgressBar
              type={type}
              oldValue={potTotal}
              valueChange={watchedAmount}
              target={potTarget}
              color={
                type === "addMoney"
                  ? theme.palette.others.green
                  : theme.palette.others.red
              }
              bgColor={theme.palette.background.default}
            />
          )}
          {/* AMOUNT FIELD */}
          <Controller
            name="amount"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Box>
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
                  label="Maximum Spend"
                  placeholder="0.00"
                  adornmentText="$"
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
              {`Confirm ${type === "addMoney" ? "Addition" : "Withdrawal"}`}
            </Typography>
          </Button>
        </Stack>
      </form>
    </ActionModal>
  );
};

export default PotMoneyModal;
