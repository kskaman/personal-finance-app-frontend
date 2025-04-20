import { useContext, useState } from "react";
import { Box, lighten, Stack, Typography, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { MD_BREAK } from "../../data/widthConstants.ts";
import SubContainer from "../../ui/SubContainer.tsx";
import EditIcon from "../../Icons/EditIcon.tsx";
import DeleteIcon from "../../Icons/DeleteIcon.tsx";
import CategoryMarkerContext from "../../context/CategoryMarkerContext.tsx";
import { Category } from "../../types/Data.ts";
import Button from "../../ui/Button.tsx";
import useModal from "../../customHooks/useModal.ts";
import DeleteModal from "../../ui/DeleteModal.tsx";
import AddEditCategoryModal from "./AddEditCategory.tsx";
import { BalanceTransactionsActionContext } from "../../context/BalanceTransactionsContext.tsx";

// Interfaces
interface CategorySettingsProps {
  parentWidth: number;
}

// Helper function to convert a string to camelCase
const toCamelCase = (str: string): string => {
  return str
    .split(" ")
    .map((word, index) => {
      if (index === 0) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
};

// Main component
const CategorySettings = ({ parentWidth }: CategorySettingsProps) => {
  const theme = useTheme();
  const { categories, setCategories } = useContext(CategoryMarkerContext);
  const { setTransactions } = useContext(BalanceTransactionsActionContext);
  const {
    isOpen: isDeleteModal,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();
  const {
    isOpen: isAddEditModalOpen,
    openModal: openAddEditModal,
    closeModal: closeAddEditModal,
  } = useModal();

  const existingCategories = categories.map((c) => c.name.toLowerCase());

  // State to track the currently selected category
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  // Use a responsive grid layout similar to your settings radio group component
  const gridTemplateColumns =
    parentWidth < MD_BREAK ? "1fr" : "repeat(auto-fit, minmax(225px, 1fr))";

  // Add Category
  const handleAddCategory = (categoryName: string) => {
    setCategories((prev) => [
      ...prev,
      {
        id: toCamelCase(categoryName),
        type: "custom",
        name: categoryName,
        usedInBudgets: false,
      },
    ]);
  };

  // Edit Category
  const handleEditCategory = (categoryName: string) => {
    if (!selectedCategory) return;

    const oldName = selectedCategory.name;
    const id = toCamelCase(categoryName);
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === selectedCategory?.id
          ? { ...cat, id, name: categoryName }
          : cat
      )
    );

    // Update transactions: Replace old category name with new one
    setTransactions((prevTxs) =>
      prevTxs.map((tx) =>
        tx.category === oldName ? { ...tx, category: categoryName } : tx
      )
    );
  };

  // Delete Category
  const handleDeleteCategory = () => {
    if (!selectedCategory) return;
    const deletedCategoryName = selectedCategory.name;
    setCategories((prev) =>
      prev.filter((cat) => cat.id !== selectedCategory.id)
    );

    // Update transactions so that any transaction that had the deleted category now is "General"
    setTransactions((prevTxs) =>
      prevTxs.map((tx) =>
        tx.category === deletedCategoryName
          ? { ...tx, category: "General" }
          : tx
      )
    );
    setSelectedCategory(null);
  };

  return (
    <SubContainer>
      {/* Header with title and add button */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        height="53px"
      >
        <Typography
          fontSize="16px"
          fontWeight="bold"
          color={theme.palette.primary.main}
        >
          Categories
        </Typography>
        <Button
          color={`${theme.palette.text.primary}`}
          onClick={() => {
            setSelectedCategory(null);
            openAddEditModal();
          }}
          hoverColor={`${theme.palette.text.primary}`}
          hoverBgColor={`${lighten(theme.palette.primary.main, 0.2)}`}
          height="53px"
          padding="10px"
          backgroundColor={`${theme.palette.primary.main}`}
        >
          <Typography noWrap fontSize="14px" fontWeight="bold">
            {parentWidth < 450 ? "+" : "+ Add New Category"}
          </Typography>
        </Button>
      </Stack>

      {/* Categories grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns,
          gap: "8px",
        }}
      >
        {categories.map((category: Category) => (
          <Grid
            key={category.id}
            onClick={() => {
              // Optionally handle click events here
            }}
            sx={{ cursor: "pointer" }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              bgcolor={theme.palette.primary.contrastText}
              borderRadius="8px"
              padding={2}
              sx={{
                "&:hover": {
                  backgroundColor: lighten(
                    theme.palette.background.default,
                    0.6
                  ),
                },
              }}
            >
              <Typography color={theme.palette.primary.main}>
                {category.name}
              </Typography>
              {category.type === "custom" && (
                <Stack direction="row" gap={"4px"}>
                  <Button
                    color={`${theme.palette.primary.main}`}
                    onClick={() => {
                      setSelectedCategory(category);
                      openAddEditModal();
                    }}
                    padding="4px"
                    hoverColor={`${theme.palette.primary.main}`}
                    hoverBgColor={`${theme.palette.primary.contrastText}`}
                    backgroundColor={theme.palette.primary.contrastText}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    color={`${theme.palette.primary.main}`}
                    onClick={() => {
                      setSelectedCategory(category);
                      openDeleteModal();
                    }}
                    padding="4px"
                    hoverColor={`${theme.palette.primary.main}`}
                    hoverBgColor={`${theme.palette.primary.contrastText}`}
                    backgroundColor={theme.palette.primary.contrastText}
                  >
                    <DeleteIcon />
                  </Button>
                </Stack>
              )}
            </Stack>
          </Grid>
        ))}
      </Box>

      {/* Delete Category Modal */}
      {isDeleteModal && (
        <DeleteModal
          open={isDeleteModal}
          onClose={() => {
            setSelectedCategory(null);
            closeDeleteModal();
          }}
          handleDelete={handleDeleteCategory}
          label={selectedCategory?.name || ""}
          warningText={`Are you sure you want to delete this category?
             This action cannot be reversed.
             The Category for Transactions for this category will be changed to General.`}
          type="category"
        />
      )}

      {/* Add/Edit Category Modal */}
      {isAddEditModalOpen && (
        <AddEditCategoryModal
          open={isAddEditModalOpen}
          onClose={() => {
            closeAddEditModal();
            setSelectedCategory(null);
          }}
          updateCategories={
            selectedCategory?.name ? handleEditCategory : handleAddCategory
          }
          categoryName={selectedCategory?.name}
          existingCategories={existingCategories}
        />
      )}
    </SubContainer>
  );
};

export default CategorySettings;
