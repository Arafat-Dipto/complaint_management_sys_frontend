import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../component/common/Button";
import CommonModal from "../component/common/CommonModal";
import CustomCheckbox from "../component/common/CustomCheckbox";
import DropdownField from "../component/common/DropdownField";
import InputField from "../component/common/InputField";
import Loader from "../component/common/Loader";
import useCustomSwal from "../component/common/customHooks/useCustomSwal";
import useDeleteHandler from "../component/common/customHooks/useDeleteHandler";
import DefaultLayout from "../component/layout/DefaultLayout";
import { openSnackbar } from "../redux/actions/snackbarAction";
import { roleList } from "../services/Roles";
import { userCreate, userDelete, userEdit, userList } from "../services/Users.js";
import { createOptionsReactSelect } from "../utils/MakeOptionsSelect.js";
import { privilegesEnum } from "../utils/Privileges.js";
import { createUserSchema, editUserSchema } from "../utils/ValidationSchema";
export default function UserList() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalShow, setModalShow] = useState(false);
  const [singleUser, setSingleUser] = useState({});
  const [duplicateError, setDuplicateError] = useState(null);

  const hasPermission = useSelector(
    (state) => state?.auth?.privilege
  );
  const dispatch = useDispatch();
  const MySwal = useCustomSwal();

  const handleCloseModal = () => {
    setDuplicateError(null);
    setModalShow(false);
    formik.resetForm();
    setSingleUser({});
  };

  const userListAsync = async () => {
    setLoading(true);
    try {
      const res = await userList();
      if (res?.success) {
        setUsers(res?.data);
      }
    } catch (error) {
      dispatch(openSnackbar("server error", false));
    }
    setLoading(false);
  };
  const roleListAsync = async () => {
    setLoading(true);
    try {
      const res = await roleList();
      if (res?.success) {
        const roleOptions = createOptionsReactSelect(res?.data, "id", "name");
        setRoles(roleOptions);
      }
    } catch (error) {
      console.error(error);
      dispatch(openSnackbar("Server error", false));
    }
    setLoading(false);
  };

  useEffect(() => {
    userListAsync();
    roleListAsync();
  }, []);

  const handleEdit = (user) => {
    const roleValue = user.roles.map((role) => role.id);
    formik.setValues({
      id: user.id,
      name: user.name,
      email: user.email,
      is_active: user.is_active,
      roles: roleValue,
    });
    setSingleUser(user);
    setModalShow(true);
  };
  const onSubmit = async (values) => {
    setLoading(true);
    try {
      let res;
      if (singleUser?.id) {
        res = await userEdit(values, singleUser?.id);
        dispatch(openSnackbar("Successfully Updated", true));
      } else {
        res = await userCreate(values);
        dispatch(openSnackbar("Successfully Created", true));
      }
      handleCloseModal();
      userListAsync();
    } catch (error) {
      setLoading(false);
      console.error(error);
      if (error.status === 422) {
        setDuplicateError(
          error?.data?.errors?.email && error?.data?.errors?.email[0]
        );
      } else {
        dispatch(openSnackbar("server error", false));
      }
    }
  };

  const handleCompanyDelete = useDeleteHandler(userDelete, userListAsync);
  const handleDelete = (user) => {
    handleCompanyDelete(user);
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      is_active: 1,
      roles: "",
    },
    onSubmit,
    validateOnChange: true,
    validationSchema: singleUser?.id ? editUserSchema : createUserSchema,
  });
  if (loading) {
    return <Loader />;
  }
  return (
      <DefaultLayout>
        
      <div className="container">
        <div className="text-center mt-4">
          <div className="text-2xl font-semibold">User List</div>
        </div>
        <div className="flex flex-wrap pe-3 pt-3">
          <div className="w-full md:w-2/3">
            <div className="flex justify-between items-center"></div>
          </div>
          <div className="w-full md:w-1/3">
            <div className="flex justify-end items-center">
              {hasPermission?.includes(privilegesEnum.UserCreate) && (
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  onClick={() => setModalShow(true)}
                >
                  Create New User
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
                <th className="border border-gray-300 px-4 py-2">
                  #
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Name
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Email
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Status
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Roles
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, key) => (
                <tr
                  key={user.id}
                  className="text-center"
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {key+1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.is_active === 1 ? (
                          <span className=" badge badge-green ">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="6"
                              height="6"
                              viewBox="0 0 6 6"
                              fill="none"
                            >
                              <circle
                                cx="2.83685"
                                cy="3.26532"
                                r="2.53534"
                                fill="#00AA50"
                              />
                            </svg>
                            Active
                          </span>
                        ) : (
                          <span className="badge badge-red">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="6"
                              height="6"
                              viewBox="0 0 6 6"
                              fill="none"
                            >
                              <circle
                                cx="3.33685"
                                cy="3.26508"
                                r="2.53534"
                                fill="#ED2B21"
                              />
                            </svg>
                            Inactive
                          </span>
                        )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.roles?.map((role, i) => (
                      <span key={i} className="badge badge-secondary me-1">
                        {role?.name}
                      </span>
                    ))}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {hasPermission?.includes(privilegesEnum.UserUpdate) && (
                      <button
                        className="edit-button mr-3 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                        onClick={() => handleEdit(user)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5l4 4L7 21H3v-4L16.5 3.5z" />
                        </svg>
                      </button>
                    )}
                    {hasPermission?.includes(privilegesEnum.UserDelete) && (
                      <button
                        className="delete-button px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                        onClick={() => handleDelete(user)}
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
            title={`${singleUser?.id ? "Update User" : "Create New User"}`}
          >
            <form onSubmit={formik.handleSubmit}>
              {duplicateError && (
                <div className="text-red-600 text-center mb-2 text-sm font-bold">
                  <i className="bi bi-x-octagon-fill pe-2"></i>
                  {duplicateError}
                </div>
              )}
              <div className="mb-4 flex flex-col sm:flex-row">
                <label className="sm:w-1/3 font-medium">Name</label>
                <div className="sm:w-2/3">
                  <InputField
                    formik={formik}
                    fieldName={"name"}
                    placeholder={"User Name"}
                  />
                </div>
              </div>
              <div className="mb-4 flex flex-col sm:flex-row">
                <label className="sm:w-1/3 font-medium">Email</label>
                <div className="sm:w-2/3">
                  <InputField
                    formik={formik}
                    fieldName={"email"}
                    placeholder={"User Email"}
                  />
                </div>
              </div>
              {!singleUser?.id && (
                <>
                  <div className="mb-4 flex flex-col sm:flex-row">
                    <label className="sm:w-1/3 font-medium">Password</label>
                    <div className="sm:w-2/3">
                      <InputField
                        type={"password"}
                        formik={formik}
                        fieldName={"password"}
                        placeholder={"User Password"}
                      />
                    </div>
                  </div>
                  <div className="mb-4 flex flex-col sm:flex-row">
                    <label className="sm:w-1/3 font-medium">Confirm Password</label>
                    <div className="sm:w-2/3">
                      <InputField
                        type={"password"}
                        formik={formik}
                        fieldName={"password_confirmation"}
                        placeholder={"Confirm Password"}
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="mb-4 flex flex-col sm:flex-row">
                <label className="sm:w-1/3 font-medium">Active Status</label>
                <div className="sm:w-2/3">
                  <CustomCheckbox id="is_active" name="is_active" formik={formik} />
                </div>
              </div>
              <div className="mb-4 flex flex-col sm:flex-row">
                <label className="sm:w-1/3 font-medium">Roles</label>
                <div className="sm:w-2/3">
                  <DropdownField
                    formik={formik}
                    fieldName="roles"
                    placeholder="Select an option"
                    options={roles}
                    isMulti={true}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-gray-200 text-gray-700 py-2 px-4 rounded"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <Button
                  buttonType="submit"
                  text={`${singleUser?.id ? "Update" : "Create"}`}
                  color="primary"
                  disabled={Object.keys(formik.errors).length > 0 || loading ? true : false}
                />

              </div>
            </form>
          </CommonModal>

      </div>

     
     </DefaultLayout>

  );
}
