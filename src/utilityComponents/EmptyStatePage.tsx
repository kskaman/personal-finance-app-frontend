import { Typography, Stack, useTheme } from "@mui/material";
import Button from "../utilityComponents/Button";
interface EmptyStatePageProps {
  message: string;
  subText: string;
  buttonLabel: string;
  onButtonClick: () => void;
}

/**
 * A reusable component to show a semi-transparent background image,
 * a main message, an optional description, and a CTA button.
 */
const EmptyStatePage = ({
  message,
  subText,
  buttonLabel,
  onButtonClick,
}: EmptyStatePageProps) => {
  const theme = useTheme();
  return (
    <Stack
      position="relative"
      height="400px"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
    >
      {/* Foreground content (text + button) */}
      <Stack
        direction="column"
        gap="16px"
        alignItems="center"
        zIndex={1}
        textAlign="center"
        padding="16px"
      >
        <Typography variant="h5" fontWeight="bold">
          {message}
        </Typography>
        {subText && <Typography variant="body1">{subText}</Typography>}
        <Button
          height="53px"
          padding="16px"
          backgroundColor={theme.palette.primary.main}
          color={theme.palette.text.primary}
          onClick={onButtonClick}
          hoverColor={theme.palette.text.primary}
          hoverBgColor={theme.palette.primary.light}
        >
          <Typography noWrap fontSize="14px" fontWeight="bold">
            {buttonLabel}
          </Typography>
        </Button>
      </Stack>
    </Stack>
  );
};

export default EmptyStatePage;
