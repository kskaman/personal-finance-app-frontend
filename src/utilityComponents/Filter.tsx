import { useState } from "react";
import { categories } from "../data/categories";
import {
  SelectChangeEvent,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import CustomInput from "./CustomInput";
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
  width,
  justifyContent,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  width: string;
  justifyContent?: string;
  onChange: (event: SelectChangeEvent) => void;
}) => (
  <Stack
    width={width}
    direction="row"
    alignItems="center"
    gap="8px"
    justifyContent={justifyContent || "flex-start"}
  >
    <Typography
      fontSize="14px"
      color={theme.palette.primary.light}
      whiteSpace="nowrap"
    >
      {label}
    </Typography>
    <CustomDropdown
      width="fit-content"
      color={theme.palette.primary.main}
      options={options}
      value={value}
      onChange={onChange}
    />
  </Stack>
);

const Filter = ({
  parentWidth,
  searchName,
  setSearchName,
  category,
  setCategory,
  sortBy,
  setSortBy,
}: FilterProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
      <Stack
        direction="row"
        height="45px"
        gap="24px"
        alignItems="center"
        justifyContent="space-between"
      >
        <CustomInput
          placeholder="Search Transaction"
          value={searchName}
          width={{ xs: "100%", sm: "375px" }}
          Icon={SearchIcon}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setSearchName(event.target.value)
          }
        />
        {parentWidth < 800 ? (
          <IconButton onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <FilterIcon color={theme.palette.primary.main} />
          </IconButton>
        ) : (
          <Stack direction="row" gap="24px" alignItems="center">
            <FilterOption
              width="177px"
              label="Sort By"
              options={sortOptions}
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            />
            {category && setCategory && (
              <FilterOption
                width="245px"
                label="Category"
                options={["All Transactions", ...categories]}
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              />
            )}
          </Stack>
        )}
      </Stack>
      {isFilterOpen && parentWidth < 800 && (
        <Stack direction="column" gap="16px" marginTop="8px" width="100%">
          <FilterOption
            width={"100%"}
            label="Sort By"
            options={sortOptions}
            value={sortBy}
            justifyContent="space-between"
            onChange={(event) => setSortBy(event.target.value)}
          />
          {category && setCategory && (
            <FilterOption
              width={"100%"}
              label="Category"
              options={["All Transactions", ...categories]}
              value={category}
              justifyContent="space-between"
              onChange={(event) => setCategory(event.target.value)}
            />
          )}
        </Stack>
      )}
    </>
  );
};

export default Filter;
