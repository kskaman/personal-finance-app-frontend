import { Controller, useForm } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect } from "react";
import CategoryMarkerContext from "../../context/CategoryMarkerContext";
import { Category } from "../../types/Data";
import { lighten, Stack, Typography, useTheme } from "@mui/material";
import Button from "../../ui/Button";
import ActionModal from "../../ui/ActionModal";
import ModalTextField from "../../ui/ModalTextField";

// Interface and Props
interface FormValues {
  name: string;
}

interface AddEditCategoryModalProps {
  open: boolean;
  onClose: () => void;
  categoryName?: string;
  existingCategories: string[];
  updateCategories: (categoryName: string) => void;
}

const buildSchema = (existingCategories: string[]) =>
  yup.object({
    name: yup
      .string()
      .required("Category Name is required")
      .test("unique", "Category name already in use", (value) => {
        if (value && existingCategories.includes(value.toLowerCase())) {
          return false;
        }
        return true;
      }),
  });

// Main component
const AddEditCategoryModal = ({
  open,
  onClose,

  categoryName,
  updateCategories,
}: AddEditCategoryModalProps) => {
  const theme = useTheme();
  const existingCategories = useContext(CategoryMarkerContext).categories.map(
    (category: Category) => {
      return category.name.toLowerCase();
    }
  );

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: yupResolver(buildSchema(existingCategories)),
    mode: "onSubmit",
    defaultValues: {
      name: categoryName || "",
    },
  });

  useEffect(() => {
    reset({
      name: categoryName || "",
    });
  }, [categoryName, reset]);

  // Form submission handler
  const onSubmit = (data: FormValues) => {
    updateCategories(data.name);
    onClose();
  };

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      heading={categoryName ? "Edit Category" : "Add Category"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="20px">
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Stack position="relative">
                <ModalTextField
                  value={field.value}
                  onChange={(e) => {
                    if (e.target.value.length <= 24) {
                      field.onChange(e);
                    }
                  }}
                  onBlur={field.onBlur}
                  error={error}
                  label={"Category Name"}
                  maxLength={24}
                  adornmentTextFlag={false}
                />
                <Typography
                  fontSize="12px"
                  color={theme.palette.primary.light}
                  marginLeft="auto"
                  marginTop="1px"
                >
                  {`${24 - field.value.length} characters left`}
                </Typography>
              </Stack>
            )}
          />
          {/* SAVE BUTTON */}
          <Button
            type="submit"
            width="100%"
            height="53px"
            backgroundColor={theme.palette.primary.main}
            onClick={() => {}}
            color={theme.palette.text.primary}
            hoverColor={theme.palette.text.primary}
            hoverBgColor={lighten(theme.palette.primary.main, 0.2)}
          >
            <Typography fontSize="14px" fontWeight="bold">
              Save Changes
            </Typography>
          </Button>
        </Stack>
      </form>
    </ActionModal>
  );
};

export default AddEditCategoryModal;
