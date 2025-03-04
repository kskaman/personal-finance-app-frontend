import { useState } from "react";
import { categories } from "../data/categories";
import {
  SelectChangeEvent,
  Stack,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import SearchInput from "./SearchInput";
import CustomDropdown from "./CustomDropdown";
import SearchIcon from "../Icons/SearchIcon";
import FilterIcon from "../Icons/FilterIcon";
import theme from "../theme/theme";
import { MD_BREAK, SM_BREAK } from "../data/widthConstants";

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
  onChange: (event: SelectChangeEvent) => void;
}) => (
  <Box width={width}>
    <Stack
      width="100%"
      direction="row"
      alignItems="center"
      gap="8px"
      justifyContent="space-between"
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

  // Prepend "All" to the month options
  const monthDropdownOptions = monthOptions ? ["All", ...monthOptions] : [];

  // Group all extra filter options (sort, category, month)
  const extraFilters = (() => {
    if (parentWidth > MD_BREAK) {
      // For large screens: render filters in a row with fixed 250px width and spaced-between.
      return (
        <Grid container spacing={2} justifyContent="space-between">
          <Grid>
            <FilterOption
              label="Sort By"
              options={sortOptions}
              value={sortBy}
              width="250px"
              onChange={(event) => setSortBy(event.target.value)}
            />
          </Grid>
          {category && setCategory && (
            <Grid>
              <FilterOption
                label="Category"
                options={["All Transactions", ...categories]}
                value={category}
                width="250px"
                onChange={(event) => setCategory(event.target.value)}
              />
            </Grid>
          )}
          {selectedMonth && setSelectedMonth && monthOptions && (
            <Grid>
              <FilterOption
                label="Month"
                options={monthDropdownOptions}
                value={selectedMonth}
                width="250px"
                onChange={(event) => setSelectedMonth(event.target.value)}
              />
            </Grid>
          )}
        </Grid>
      );
    } else if (parentWidth >= SM_BREAK && parentWidth <= MD_BREAK) {
      // For medium screens: two columns per row (each taking 50% width).
      return (
        <Grid container spacing={2}>
          <Grid size={6}>
            <FilterOption
              label="Sort By"
              options={sortOptions}
              value={sortBy}
              width="100%"
              onChange={(event) => setSortBy(event.target.value)}
            />
          </Grid>
          {category && setCategory && (
            <Grid size={6}>
              <FilterOption
                label="Category"
                options={["All Transactions", ...categories]}
                value={category}
                width="100%"
                onChange={(event) => setCategory(event.target.value)}
              />
            </Grid>
          )}
          {selectedMonth && setSelectedMonth && monthOptions && (
            <Grid size={6}>
              <FilterOption
                label="Month"
                options={monthDropdownOptions}
                value={selectedMonth}
                width="100%"
                onChange={(event) => setSelectedMonth(event.target.value)}
              />
            </Grid>
          )}
        </Grid>
      );
    } else {
      // For small screens (<600): render in a vertical stack.
      return (
        <Stack direction="column" gap="16px">
          <FilterOption
            label="Sort By"
            options={sortOptions}
            value={sortBy}
            width="100%"
            onChange={(event) => setSortBy(event.target.value)}
          />
          {category && setCategory && (
            <FilterOption
              label="Category"
              options={["All Transactions", ...categories]}
              value={category}
              width="100%"
              onChange={(event) => setCategory(event.target.value)}
            />
          )}
          {selectedMonth && setSelectedMonth && monthOptions && (
            <FilterOption
              label="Month"
              options={monthDropdownOptions}
              value={selectedMonth}
              width="100%"
              onChange={(event) => setSelectedMonth(event.target.value)}
            />
          )}
        </Stack>
      );
    }
  })();

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
