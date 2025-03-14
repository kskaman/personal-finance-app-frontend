// utils/budgetUtils.ts
import { Budget, Category, MarkerTheme } from "../types/Data";

//! If budgets and categories are always unique, we can convert them to a Set to make the includes check O(1) instead of O(n). A Set.has() check is O(1) since it is a direct lookup, while an Array.includes() check is O(n) since it has to iterate over the array to find the value and worst case scenario the value you are looking for is at the end of the array. Not a requirement, just something worth keeping in mind when working with large, unique datasets.
export const updateUsedStatuses = (
  budgets: Budget[],
  categories: Category[],
  markerThemes: MarkerTheme[]
): { updatedCategories: Category[]; updatedMarkerThemes: MarkerTheme[] } => {
  const updatedCategories = categories.map((cat) => ({
    ...cat,
    usedInBudgets: budgets.some((budget) => budget.category === cat.name),
  }));

  const updatedMarkerThemes = markerThemes.map((theme) => ({
    ...theme,
    usedInBudgets: budgets.some(
      (budget) => budget.theme.toLowerCase() === theme.colorCode.toLowerCase()
    ),
  }));

  return { updatedCategories, updatedMarkerThemes };
};
