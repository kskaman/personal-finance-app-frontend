import { Typography, Box, Stack, useTheme } from "@mui/material";
import Button from "@mui/material/Button";

import MinimizeIcon from "../Icons/MinimizeIcon";

interface MinimizeButtonProps {
  onClick: () => void;
  isMinimized: boolean;
}

const MinimizeButton = ({ onClick, isMinimized }: MinimizeButtonProps) => {
  const theme = useTheme();
  return (
    <>
      <Button
        onClick={onClick}
        disableElevation={true}
        disableTouchRipple={true}
        variant="contained"
        sx={{
          backgroundColor: theme.palette.primary.main,
          padding: 0,
          margin: 0,
        }}
      >
        <Stack
          direction="row"
          gap={2}
          alignItems="center"
          justifyContent="flex-start"
          sx={{
            width: isMinimized ? "80px" : "276px",
            height: "56px",
            padding: "16px 32px",
            color: theme.palette.background.paper,
            cursor: "pointer",
            textDecoration: "none",
            ":hover": {
              color: theme.palette.secondary.contrastText,
            },
          }}
        >
          <Box
            sx={{
              width: "24px",
              height: "24px",
              transform: isMinimized ? "rotate(180deg)" : "",
            }}
          >
            <MinimizeIcon color="inherit" />
          </Box>

          {!isMinimized && (
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                textAlign: "left",
                textTransform: "none",
              }}
            >
              Minimize Menu
            </Typography>
          )}
        </Stack>
      </Button>
    </>
  );
};

export default MinimizeButton;
