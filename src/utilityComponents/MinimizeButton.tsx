import { Typography, Box, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import theme from "../theme/theme";

interface MinimizeButtonProps {
  icon: string;
}

const MinimizeButton = ({ icon }: MinimizeButtonProps) => {
  return (
    <>
      <Button
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
            width: "276px",
            height: "56px",
            padding: "16px 32px",
            color: theme.palette.background.paper,
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          <Box
            component="img"
            src={icon}
            alt={`minimize icon`}
            sx={{ width: "24px", height: "24px" }}
          />
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
        </Stack>
      </Button>
    </>
  );
};

export default MinimizeButton;
