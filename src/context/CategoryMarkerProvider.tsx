import { ReactNode, useState } from "react";
import { Category, MarkerTheme } from "../types/Data";
import CategoryMarkerContext from "./CategoryMarkerContext";

interface CategoryMarkerProviderProps {
  categories: Category[];
  markerThemes: MarkerTheme[];
  children: ReactNode;
}

const CategoryMarkerProvider = ({
  categories,
  markerThemes,
  children,
}: CategoryMarkerProviderProps) => {
  const [categoriesArr, setCategoriesArr] = useState<Category[]>(categories);
  const [markerThemesArr, setMarkerThemesArr] =
    useState<MarkerTheme[]>(markerThemes);

  return (
    <CategoryMarkerContext.Provider
      value={{
        categories: categoriesArr,
        markerThemes: markerThemesArr,
        setCategories: setCategoriesArr,
        setMarkerThemes: setMarkerThemesArr,
      }}
    >
      {children}
    </CategoryMarkerContext.Provider>
  );
};

export default CategoryMarkerProvider;
