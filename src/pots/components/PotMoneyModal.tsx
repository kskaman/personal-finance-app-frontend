import { lighten, Stack, Typography, useTheme } from "@mui/material";
import Button from "../../ui/Button";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PotsModalProgressBar from "./PotsModalProgressBar";
import { useContext, useEffect, useState } from "react";
import { Currencies } from "../../types/settingsData";
import { SettingsContext } from "../../context/SettingsContext";
import ActionModal from "../../ui/ActionModal";
import ModalTextField from "../../ui/ModalTextField";

// Types & Interface
interface PotMoneyModalProps {
  open: boolean;
  onClose: () => void;
  type: "addMoney" | "withdraw" | null;
  potName: string;
  potTotal: number;
  potTarget: number;
  maxLimit: number;
  updatePotAmount: (
    newTotal: number,
    newTarget: number,
    newBalance: number
  ) => void;
}

interface FormValues {
  amount: string;
}

// Yup Schema for Validation
const buildSchema = (
  type: "addMoney" | "withdraw" | null,
  potTotal: number,
  maxLimit: number,
  potTarget: number,
  isConfirmed: boolean,
  currencySymbol: Currencies
) =>
  yup.object({
    amount: yup
      .string()
      .matches(/^\d+(\.\d{0,2})?$/, "Enter a valid number (up to 2 decimals).")
      .test(
        "max-limit",
        type === "addMoney"
          ? `Amount cannot exceed available funds (${currencySymbol}${maxLimit.toFixed(
              2
            )})`
          : `Amount cannot exceed current pot total (${currencySymbol}${potTotal.toFixed(
              2
            )})`,
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
        `Amount exceeded the required amount to reach target. This extra will increase your target.`,
        (value) => {
          const num = parseFloat(value || "0");
          if (isConfirmed) return true;
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
  const theme = useTheme();
  // Local state to hold confirmation details
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [exceedFlag, setExceedFlag] = useState<boolean>(false);
  const [isConfirm, setIsConfirm] = useState<boolean>(false);

  const currencySymbol = useContext(SettingsContext).selectedCurrency;
  // Setup React Hook Form.
  const { control, handleSubmit, watch, reset } = useForm<FormValues>({
    defaultValues: { amount: "" },
    resolver: yupResolver(
      buildSchema(
        type,
        potTotal,
        maxLimit,
        potTarget,
        isConfirm,
        currencySymbol
      )
    ),
    mode: "onChange",
  });

  // Get the current amount value.
  const watchedAmount = parseFloat(watch("amount")) || 0;
  const requiredToReachTarget = potTarget - potTotal;
  const extra =
    type === "addMoney" && watchedAmount > requiredToReachTarget
      ? watchedAmount - requiredToReachTarget
      : 0;
  const computedNewTarget = potTarget + extra;

  // Update confirmation flag when amount changes.
  useEffect(() => {
    if (type === "addMoney" && watchedAmount > requiredToReachTarget) {
      setShowConfirm(true);
    } else {
      setShowConfirm(false);
    }
  }, [watchedAmount, type, requiredToReachTarget]);

  const onSubmit = (data: FormValues) => {
    const amount = parseFloat(data.amount);
    if (type === "addMoney") {
      updatePotAmount(potTotal + amount, computedNewTarget, maxLimit - amount);
    } else if (type === "withdraw") {
      updatePotAmount(potTotal - amount, computedNewTarget, maxLimit + amount);
    }
    onClose();
  };

  // Handler for confirming the extra amount inline.
  const handleConfirm = () => {
    if (exceedFlag) return;
    setShowConfirm(false);
    setIsConfirm(true);
  };

  // Handler to cancel the confirmation.
  const handleCancel = () => {
    if (exceedFlag) {
      setExceedFlag(false);
    }
    setShowConfirm(false);
    reset({ amount: "" });
  };

  useEffect(() => {
    if (type === "addMoney") {
      const requiredToReachTarget = potTarget - potTotal;
      if (watchedAmount > requiredToReachTarget) {
        if (watchedAmount > maxLimit) {
          setExceedFlag(true);
          setShowConfirm(false);
        } else {
          setExceedFlag(false);
          setShowConfirm(true);
        }
      } else {
        setExceedFlag(false);
        setShowConfirm(false);
      }
    }
  }, [watchedAmount, type, potTarget, potTotal, maxLimit]);

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
              target={potTarget + extra}
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
              <ModalTextField
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={error}
                label="Maximum Spend"
                placeholder="0.00"
              />
            )}
          />

          {exceedFlag || showConfirm ? (
            <Stack direction="row" spacing={2} mt={1}>
              <Button
                onClick={handleConfirm}
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
                onClick={handleCancel}
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
          ) : (
            /* SAVE BUTTON */
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
                {`Confirm ${type === "addMoney" ? "Addition" : "Withdrawal"}`}
              </Typography>
            </Button>
          )}
        </Stack>
      </form>
    </ActionModal>
  );
};

export default PotMoneyModal;
