import { Box, Menu, MenuItem, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import Button from "./Button";

interface OptionsButtonProps {
  height?: string;
  backgroundColor?: string;
  color?: string;
  hoverBgColor?: string;
  hoverColor?: string;
  borderColor?: string;
  type: "bill" | "pot" | "budget" | "transaction";
  marginLeft?: string;
  onEdit: () => void;
  onDelete: () => void;
}

const OptionsButton = ({
  type,
  onEdit,
  onDelete,
  height,
  backgroundColor,
  color,
  hoverBgColor,
  hoverColor,
  borderColor,
  marginLeft,
}: OptionsButtonProps) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const optionType = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <>
      {/* ... Button */}
      <Box marginLeft={marginLeft || "auto"}>
        <Button
          height={height || "20px"}
          backgroundColor={backgroundColor || "inherit"}
          color={color || theme.palette.primary.light}
          hoverBgColor={hoverBgColor || theme.palette.text.primary}
          hoverColor={hoverColor || theme.palette.primary.main}
          onClick={handleOpen}
          borderColor={borderColor || theme.palette.text.primary}
        >
          <Typography>...</Typography>
        </Button>
      </Box>

      {/* Dropdown menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              mt: "8px", // gap between select and dropdown
              borderRadius: "8px",
              padding: "12px 20px",
              bgcolor: theme.palette.primary.contrastText,
            },
          },
        }}
        // Ensures the dropdown moves left, aligning with the button's right edge
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          disableRipple
          onClick={(event) => {
            // Remove focus from element
            event.currentTarget.blur();
            onEdit();
            handleClose();
          }}
          sx={{
            fontSize: "14px",
            color: theme.palette.primary.light,
            padding: "12px 0",
            borderBottom: `1px solid ${theme.palette.secondary.contrastText}`,
            "&:last-child": { borderBottom: "none" },
            "&:hover": { backgroundColor: "transparent" }, // Remove hover background
            "&.Mui-selected": {
              backgroundColor: "transparent", // Remove active background
              "&:hover": { backgroundColor: "transparent" },
            },
            // Remove background when navigating with keyboard
            "&.Mui-focusVisible": { backgroundColor: "transparent" },
            // Remove blue background when selected
            "&.Mui-selected.Mui-focusVisible": {
              backgroundColor: "transparent",
            },
          }}
        >
          {`Edit ${optionType}`}
        </MenuItem>
        <MenuItem
          disableRipple
          onClick={(event) => {
            event.currentTarget.blur();
            onDelete();
            handleClose();
          }}
          sx={{
            fontSize: "14px",
            color: theme.palette.others.red,
            padding: "12px 0",
            borderBottom: `1px solid ${theme.palette.secondary.contrastText}`,
            "&:last-child": { borderBottom: "none" },
            "&:hover": { backgroundColor: "transparent" }, // Remove hover background
            "&.Mui-selected": {
              backgroundColor: "transparent", // Remove active background
              "&:hover": { backgroundColor: "transparent" },
            },
            // Remove background when navigating with keyboard
            "&.Mui-focusVisible": { backgroundColor: "transparent" },
            // Remove blue background when selected
            "&.Mui-selected.Mui-focusVisible": {
              backgroundColor: "transparent",
            },
          }}
        >
          {`Delete ${optionType}`}
        </MenuItem>
      </Menu>
    </>
  );
};

export default OptionsButton;
