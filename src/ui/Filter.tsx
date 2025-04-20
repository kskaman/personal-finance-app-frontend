import { useState } from "react";
import { categories } from "../data/categories";
import {
  SelectChangeEvent,
  Stack,
  Typography,
  IconButton,
  Box,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import SearchIcon from "../Icons/SearchIcon";
import FilterIcon from "../Icons/FilterIcon";
import { XL_BREAK, MD_BREAK, MD_SM_BREAK } from "../data/widthConstants";
import CustomDropdown from "./CustomDropdown";
import SearchInput from "./SearchInput";

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
  width?: string;
  onChange: (event: SelectChangeEvent) => void;
}) => {
  const theme = useTheme();
  return (
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
};

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
  const theme = useTheme();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Determine if extra filters (category and month) are provided.
  // If not, then we treat this as a sort-only table.
  const hasExtraFilters =
    category !== undefined &&
    setCategory !== undefined &&
    selectedMonth !== undefined &&
    setSelectedMonth !== undefined &&
    monthOptions !== undefined;

  // Prepend "All" to month options if provided
  const monthDropdownOptions = monthOptions ? ["All", ...monthOptions] : [];

  // Render extra filters (for tables with category and month)
  const renderExtraFilters = () => {
    if (parentWidth > XL_BREAK) {
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
          <Grid>
            <FilterOption
              label="Category"
              options={["All Transactions", ...categories]}
              value={category!}
              width="250px"
              onChange={(event) => setCategory!(event.target.value)}
            />
          </Grid>
          <Grid>
            <FilterOption
              label="Month"
              options={monthDropdownOptions}
              value={selectedMonth!}
              width="250px"
              onChange={(event) => setSelectedMonth!(event.target.value)}
            />
          </Grid>
        </Grid>
      );
    } else if (parentWidth >= MD_SM_BREAK && parentWidth <= XL_BREAK) {
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
          <Grid size={6}>
            <FilterOption
              label="Category"
              options={["All Transactions", ...categories]}
              value={category!}
              width="100%"
              onChange={(event) => setCategory!(event.target.value)}
            />
          </Grid>
          <Grid size={6}>
            <FilterOption
              label="Month"
              options={monthDropdownOptions}
              value={selectedMonth!}
              width="100%"
              onChange={(event) => setSelectedMonth!(event.target.value)}
            />
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Stack direction="column" gap="16px">
          <FilterOption
            label="Sort By"
            options={sortOptions}
            value={sortBy}
            width="100%"
            onChange={(event) => setSortBy(event.target.value)}
          />
          <FilterOption
            label="Category"
            options={["All Transactions", ...categories]}
            value={category!}
            width="100%"
            onChange={(event) => setCategory!(event.target.value)}
          />
          <FilterOption
            label="Month"
            options={monthDropdownOptions}
            value={selectedMonth!}
            width="100%"
            onChange={(event) => setSelectedMonth!(event.target.value)}
          />
        </Stack>
      );
    }
  };

  // Render layout for sort-only table (only sort filter provided)
  const renderSortOnly = () => {
    if (parentWidth >= MD_BREAK) {
      return (
        <Stack
          direction="row"
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
          <FilterOption
            label="Sort By"
            options={sortOptions}
            value={sortBy}
            width="250px"
            onChange={(event) => setSortBy(event.target.value)}
          />
        </Stack>
      );
    } else {
      return (
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
              <FilterOption
                label="Sort By"
                options={sortOptions}
                value={sortBy}
                width="100%"
                onChange={(event) => setSortBy(event.target.value)}
              />
            </Stack>
          )}
        </Stack>
      );
    }
  };

  // Main render branching based on table type:
  if (hasExtraFilters) {
    // This is the table with all three filters
    if (parentWidth > 1350) {
      // Show search input and filters inline
      return (
        <Stack
          direction="row"
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
          {renderExtraFilters()}
        </Stack>
      );
    } else {
      // Use toggle button to show/hide filters as in your current layout
      return (
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
              {renderExtraFilters()}
            </Stack>
          )}
        </Stack>
      );
    }
  } else {
    // This is the sort-only table
    return renderSortOnly();
  }
};

export default Filter;
