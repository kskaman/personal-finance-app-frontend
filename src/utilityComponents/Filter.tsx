import { useState } from "react";
import { categories } from "../data/categories";
import {
  SelectChangeEvent,
  Stack,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import SearchInput from "./SearchInput";
import CustomDropdown from "./CustomDropdown";
import SearchIcon from "../Icons/SearchIcon";
import FilterIcon from "../Icons/FilterIcon";
import theme from "../theme/theme";

interface FilterProps {
  parentWidth: number;
  searchName: string;
  setSearchName: React.Dispatch<React.SetStateAction<string>>;
  category?: string;
  setCategory?: React.Dispatch<React.SetStateAction<string>>;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  selectedMonth?: string;
  setSelectedMonth?: React.Dispatch<React.SetStateAction<string>>;
  monthOptions?: string[];
}

const sortOptions = [
  "Latest",
  "Oldest",
  "A to Z",
  "Z to A",
  "Highest",
  "Lowest",
];

const FilterOption = ({
  label,
  options,
  value,
  width = "50%",
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  width: string;
  justifyContent?: string;
  onChange: (event: SelectChangeEvent) => void;
}) => (
  <Box width={width}>
    <Stack
      width={"100%"}
      direction="row"
      alignItems="center"
      gap="8px"
      justifyContent={"space-between"}
    >
      <Typography
        fontSize="14px"
        color={theme.palette.primary.light}
        whiteSpace="nowrap"
      >
        {label}
      </Typography>
      <CustomDropdown
        width="80%"
        color={theme.palette.primary.main}
        options={options}
        value={value}
        onChange={onChange}
      />
    </Stack>
  </Box>
);

const Filter = ({
  parentWidth,
  searchName,
  setSearchName,
  category,
  setCategory,
  sortBy,
  setSortBy,
  selectedMonth,
  setSelectedMonth,
  monthOptions,
}: FilterProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Layout properties for desktop: each filter gets ~30% width.
  const filterWidth = "250px";

  // Prepend "All" to the month options
  const monthDropdownOptions = monthOptions ? ["All", ...monthOptions] : [];

  // Group all extra filter options (sort, category, month)
  const extraFilters = (
    <Stack
      direction="row"
      flexWrap="wrap"
      gap="16px"
      alignItems="center"
      justifyContent="flex-start"
    >
      <FilterOption
        width={filterWidth}
        label="Sort By"
        options={sortOptions}
        value={sortBy}
        onChange={(event) => setSortBy(event.target.value)}
      />
      {category && setCategory && (
        <FilterOption
          width={filterWidth}
          label="Category"
          options={["All Transactions", ...categories]}
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        />
      )}
      {selectedMonth && setSelectedMonth && monthOptions && (
        <FilterOption
          width={filterWidth}
          label="Month"
          options={monthDropdownOptions}
          value={selectedMonth}
          onChange={(event) => setSelectedMonth(event.target.value)}
        />
      )}
    </Stack>
  );

  return (
    <>
      <Stack direction="column">
        <Stack
          direction="row"
          height="45px"
          gap="24px"
          alignItems="center"
          justifyContent="space-between"
        >
          <SearchInput
            placeholder="Search Transaction"
            value={searchName}
            width={{ xs: "100%", sm: "375px" }}
            Icon={SearchIcon}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setSearchName(event.target.value)
            }
          />

          <IconButton onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <FilterIcon color={theme.palette.primary.main} />
          </IconButton>
        </Stack>

        {isFilterOpen && (
          <Stack direction="column" gap="16px" marginTop="24px" width="100%">
            {extraFilters}
          </Stack>
        )}
      </Stack>
    </>
  );
};

export default Filter;
