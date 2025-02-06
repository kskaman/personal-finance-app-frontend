import { categories } from "../../categories";
import { SelectChangeEvent, Stack, Typography } from "@mui/material";
import CustomInput from "../../utilityComponents/CustomInput";
import CustomDropdown from "../../utilityComponents/CustomDropdown";
import SearchIcon from "../../Icons/SearchIcon";
import theme from "../../theme/theme";

interface FilterProps {
  searchName: string;
  setSearchName: React.Dispatch<React.SetStateAction<string>>;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
}

const sortOptions = [
  "Latest",
  "Oldest",
  "A to Z",
  "Z to A",
  "Highest",
  "Lowest",
];

const Filter = ({
  searchName,
  setSearchName,
  category,
  setCategory,
  sortBy,
  setSortBy,
}: FilterProps) => {
  return (
    <Stack direction="row" height="45px">
      <CustomInput
        placeholder="Search Transaction"
        value={searchName}
        width="375px"
        Icon={SearchIcon}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setSearchName(event.target.value)
        }
      />

      <Stack
        width="175px"
        direction="row"
        alignItems="center"
        marginLeft="auto"
        gap="8px"
      >
        <Typography
          fontSize="14px"
          color={theme.palette.primary.light}
          width="48px"
          whiteSpace="nowrap"
        >
          Sort By
        </Typography>
        <CustomDropdown
          color={theme.palette.primary.main}
          options={sortOptions}
          value={sortBy}
          onChange={(event: SelectChangeEvent) => setSortBy(event.target.value)}
        />
      </Stack>
      <Stack
        width="245px"
        direction="row"
        alignItems="center"
        marginLeft="24px"
        gap="8px"
      >
        <Typography fontSize="14px" color={theme.palette.primary.light}>
          Category
        </Typography>
        <CustomDropdown
          color={theme.palette.primary.main}
          options={["All Transactions", ...categories]}
          value={category}
          onChange={(event: SelectChangeEvent) =>
            setCategory(event.target.value)
          }
        />
      </Stack>
    </Stack>
  );
};

export default Filter;
