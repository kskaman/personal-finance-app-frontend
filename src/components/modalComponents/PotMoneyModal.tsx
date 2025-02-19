import { Box, Stack, Typography } from "@mui/material";
import theme from "../../theme/theme";
import Button from "../../utilityComponents/Button";
import { hexToRGBA } from "../../utils/utilityFunctions";
import ActionModal from "./ActionModal";
import { Controller, useForm } from "react-hook-form";
import ModalTextField from "./ModalTextField";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PotsProgressBar from "../../utilityComponents/PotsProgressBar";

// Types & Interface
interface PotMoneyModalProps {
  open: boolean;
  onClose: () => void;
  type: "addMoney" | "withdraw" | null;
  potName: string;
  potTotal: number;
  potTarget: number;
  updatePotAmount: (amount: number) => void;
}

interface FormValues {
  amount: string;
}

// Yup Schema for Validation
const buildSchema = () =>
  yup.object({
    amount: yup
      .string()
      .matches(/^\d+(\.\d{0,2})?$/, "Enter a valid number (up to 2 decimals).")
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
  updatePotAmount,
}: PotMoneyModalProps) => {
  // Form submission handler.
  const onSubmit = (data: FormValues) => {
    if (type === "addMoney") {
      updatePotAmount(potTotal + parseFloat(data.amount));
    } else if (type === "withdraw") {
      updatePotAmount(potTotal - parseFloat(data.amount));
    }

    onClose();
  };

  // Setup React Hook Form.
  const { control, handleSubmit, trigger } = useForm<FormValues>({
    resolver: yupResolver(buildSchema()),
    mode: "onSubmit",
  });

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
          {potTotal && potTarget && (
            <PotsProgressBar
              value={potTotal}
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
