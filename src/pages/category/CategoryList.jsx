import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../component/common/Button";
import CommonModal from "../../component/common/CommonModal";
import InputField from "../../component/common/InputField";
import Loader from "../../component/common/Loader";
import useCustomSwal from "../../component/common/customHooks/useCustomSwal";
import useDeleteHandler from "../../component/common/customHooks/useDeleteHandler";
import DefaultLayout from "../../component/layout/DefaultLayout";
import { openSnackbar } from "../../redux/actions/snackbarAction";
import { categoryCreate, categoryDelete, categoryEdit, categoryList } from "../../services/Category";
import { privilegesEnum } from "../../utils/Privileges.js";
import { createCategorySchema } from "../../utils/ValidationSchema";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [singleCategory, setSingleCategory] = useState(null);
  const [duplicateError, setDuplicateError] = useState(null);

  const hasPermission = useSelector((state) => state?.auth?.privilege);
  const dispatch = useDispatch();
  const MySwal = useCustomSwal();

  const handleCloseModal = () => {
    setDuplicateError(null);
    setModalShow(false);
    formik.resetForm();
    setSingleCategory(null);
  };

  const categoryListAsync = async () => {
    setLoading(true);
    try {
      const res = await categoryList();
      if (res?.success) {
        setCategories(res?.data);
      } else {
        dispatch(openSnackbar("Failed to load categories", false));
      }
    } catch (error) {
      dispatch(openSnackbar("Server error", false));
    }
    setLoading(false);
  };

  useEffect(() => {
    categoryListAsync();
  }, []);

  const handleEdit = (category) => {
    formik.setValues({ name: category.name });
    setSingleCategory(category);
    setModalShow(true);
  };

  const handleCategoryDelete = useDeleteHandler(categoryDelete, categoryListAsync);
  
  const handleDelete = (category) => {
    handleCategoryDelete(category);
  };
  console.log(hasPermission)
  console.log(privilegesEnum.CategoryCreate)
  const onSubmitCategory = async (values) => {
    setLoading(true);
    try {
      let res;
      if (singleCategory?.id) {
        res = await categoryEdit(values, singleCategory.id);
        dispatch(openSnackbar("Successfully Updated", true));
      } else {
        res = await categoryCreate(values);
        dispatch(openSnackbar("Successfully Created", true));
      }
      setDuplicateError(null);
      handleCloseModal();
      categoryListAsync();
    } catch (error) {
      setLoading(false);
      if (error?.response?.status === 422) {
        setDuplicateError(error?.response?.data?.errors?.name?.[0]);
      } else {
        dispatch(openSnackbar("Server error", false));
      }
    }
    setLoading(false);
  };

  const formik = useFormik({
    initialValues: { name: "" },
    onSubmit: onSubmitCategory,
    validationSchema: createCategorySchema,
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <DefaultLayout>
      <div className="container">
        <div className="text-center mt-4">
          <div className="text-2xl font-semibold">Category List</div>
        </div>
        <div className="flex flex-wrap pe-3 pt-3">
          <div className="w-full md:w-2/3">
            <div className="flex justify-between items-center"></div>
          </div>
          <div className="w-full md:w-1/3">
            <div className="flex justify-end items-center">
              {hasPermission?.includes(privilegesEnum.CategoryCreate) && (
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  onClick={() => setModalShow(true)}
                >
                  Create New Category
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="mt-3">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="text-center bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">#</th>
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, key) => (
                  <tr key={category.id} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">{key + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{category.name}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {hasPermission?.includes(privilegesEnum.CategoryEdit) && (
                        <button
                          className="edit-button mr-3 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          onClick={() => handleEdit(category)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5l4 4L7 21H3v-4L16.5 3.5z" />
                          </svg>
                        </button>
                      )}
                      {hasPermission?.includes(privilegesEnum.CategoryDelete) && (
                        <button
                          className="delete-button px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          onClick={() => handleDelete(category)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <CommonModal
          modalShow={modalShow}
          handleCloseModal={handleCloseModal}
          title={singleCategory?.id ? "Update Category" : "Create New Category"}
        >
          <form onSubmit={formik.handleSubmit}>
            {duplicateError && (
              <div className="text-red-500 text-center mb-2">
                {duplicateError}
              </div>
            )}
            <div className="mb-3 flex items-center">
              <label className="w-1/4 text-right pr-3">Name</label>
              <div className="w-3/4">
                <InputField
                  formik={formik}
                  fieldName="name"
                  placeholder="Category Name"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 mr-2"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <Button
                buttonType="submit"
                text={singleCategory?.id ? "Update" : "Create"}
                color="primary"
                disabled={formik.errors.name || loading}
              />
            </div>
          </form>
        </CommonModal>
      </div>
    </DefaultLayout>
  );
}
