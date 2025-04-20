import { Stack, Typography, useTheme } from "@mui/material";
import CaretLeftIcon from "../../Icons/CaretLeftIcon";
import Button from "../../ui/Button";
import CaretRightIcon from "../../Icons/CaretRightIcon";
import { SM_BREAK } from "../../data/widthConstants";

interface Props {
  numbers: number[];
  selectedPage: number;
  handlePageSelect: (newPageNum: number) => void;
  parentWidth: number;
}

const PageNav = ({
  numbers,
  selectedPage,
  handlePageSelect,
  parentWidth,
}: Props) => {
  const theme = useTheme();
  const isMobile = parentWidth < SM_BREAK;
  const lastIndex = numbers.length - 1;

  let displayedNumbers: (number | "...")[] = [];

  if (isMobile) {
    if (lastIndex < 3) {
      displayedNumbers = numbers;
    } else if (selectedPage < 3) {
      displayedNumbers = [numbers[0], numbers[1], "...", numbers[lastIndex]];
    } else if (selectedPage < numbers[lastIndex - 1]) {
      displayedNumbers = [
        selectedPage - 1,
        selectedPage,
        "...",
        numbers[lastIndex],
      ];
    } else {
      displayedNumbers = [
        numbers[0],
        "...",
        numbers[lastIndex - 1],
        numbers[lastIndex],
      ];
    }
  } else {
    if (lastIndex < 5) {
      displayedNumbers = numbers;
    } else if (selectedPage < 3) {
      displayedNumbers = [
        numbers[0],
        numbers[1],
        numbers[2],
        "...",
        numbers[lastIndex],
      ];
    } else if (selectedPage < numbers[lastIndex - 2]) {
      displayedNumbers = [
        selectedPage - 1,
        selectedPage,
        selectedPage + 1,
        "...",
        numbers[lastIndex],
      ];
    } else {
      displayedNumbers = [
        numbers[0],
        "...",
        numbers[lastIndex - 2],
        numbers[lastIndex - 1],
        numbers[lastIndex],
      ];
    }
  }

  return (
    <Stack
      height="64px"
      minWidth="100%"
      direction="row"
      justifyContent="space-between"
      alignItems="flex-end"
    >
      <Button
        color={theme.palette.primary.dark}
        borderColor={theme.palette.primary.dark}
        onClick={() => handlePageSelect(selectedPage - 1)}
        hoverColor={theme.palette.text.primary}
        hoverBgColor={theme.palette.primary.dark}
      >
        <CaretLeftIcon color="inherit" />
        <Typography color="inherit" display={{ xs: "none", sm: "block" }}>
          Prev
        </Typography>
      </Button>

      <Stack direction="row" gap="8px">
        {displayedNumbers.map((num) =>
          typeof num === "number" ? (
            <Button
              key={num}
              color={
                num === selectedPage
                  ? theme.palette.primary.contrastText
                  : theme.palette.primary.main
              }
              onClick={() => handlePageSelect(num)}
              borderColor={
                num === selectedPage
                  ? theme.palette.primary.main
                  : theme.palette.primary.dark
              }
              backgroundColor={
                num === selectedPage ? theme.palette.primary.main : "inherit"
              }
              hoverColor={theme.palette.text.primary}
              hoverBgColor={theme.palette.primary.dark}
            >
              <Typography>{num}</Typography>
            </Button>
          ) : (
            <Typography
              key={num}
              padding="0 16px 6px"
              color={theme.palette.primary.main}
              display="flex"
              alignItems="flex-end"
              justifyContent="center"
              borderRadius="8px"
              border={`1px solid ${theme.palette.primary.dark}`}
            >
              {num}
            </Typography>
          )
        )}
      </Stack>

      <Button
        color={theme.palette.primary.dark}
        borderColor={theme.palette.primary.dark}
        onClick={() => handlePageSelect(selectedPage + 1)}
        hoverColor={theme.palette.text.primary}
        hoverBgColor={theme.palette.primary.dark}
      >
        <Typography color="inherit" display={{ xs: "none", sm: "block" }}>
          Next
        </Typography>
        <CaretRightIcon color="inherit" />
      </Button>
    </Stack>
  );
};

export default PageNav;
