import { createContext } from "react";
import { Category, MarkerTheme } from "../types/Data";

interface CategoryMarkerContextProps {
  categories: Category[];
  markerThemes: MarkerTheme[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setMarkerThemes: React.Dispatch<React.SetStateAction<MarkerTheme[]>>;
}

const CategoryMarkerContext = createContext<CategoryMarkerContextProps>({
  categories: [],
  markerThemes: [],
  setCategories: () => {},
  setMarkerThemes: () => {},
});

export default CategoryMarkerContext;
