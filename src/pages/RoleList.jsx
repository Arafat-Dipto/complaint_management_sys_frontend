import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../component/common/Button";
import CommonModal from "../component/common/CommonModal";
import DropdownField from "../component/common/DropdownField";
import InputField from "../component/common/InputField";
import Loader from "../component/common/Loader";
import useCustomSwal from "../component/common/customHooks/useCustomSwal";
import useDeleteHandler from "../component/common/customHooks/useDeleteHandler";
import DefaultLayout from "../component/layout/DefaultLayout";
import { openSnackbar } from "../redux/actions/snackbarAction";
import { privilegeList } from "../services/Privilege.js";
import {
  assignPrivilege,
  roleCreate,
  roleDelete,
  roleEdit,
  roleList,
} from "../services/Roles";
import { createOptionsReactSelect } from "../utils/MakeOptionsSelect";
import { privilegesEnum } from "../utils/Privileges";
import {
  assignPrivilegeSchema,
  createRoleSchema,
} from "../utils/ValidationSchema";

export default function RoleList() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [privilege, setPrivilege] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [privilegeModalShow, setPrivilegeModalShow] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [singleRole, setSingleRole] = useState({});
  const [duplicateError, setDuplicateError] = useState(null);

  const dispatch = useDispatch();
  const hasPermission = useSelector(
    (state) => state?.auth?.privilege
  );
  const MySwal = useCustomSwal();

  const handleCloseModal = () => {
    setDuplicateError(null);
    setModalShow(false);
    formik.resetForm();
    setSingleRole({});
  };
  const handleClosePrivilegeModal = () => {
    setPrivilegeModalShow(false);
    privilegeFormik.resetForm();
    setSelectedRole(null);
  };

  const handleEdit = (role) => {
    formik.setValues({
      id: role.id,
      name: role.name,
    });
    setSingleRole(role);
    setModalShow(true);
  };

  const roleListAsync = async () => {
    setLoading(true);
    try {
      const res = await roleList();
      if (res?.success) {
        setRoles(res?.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(openSnackbar("Server error", false));
    }
    setLoading(false);
  };
  const privilegeListAsync = async () => {
    setLoading(true);
    try {
      const res = await privilegeList();
      if (res?.success) {
        const optionPrivilege = createOptionsReactSelect(
          res?.data,
          "id",
          "name"
        );
        setPrivilege(optionPrivilege);
      }
    } catch (error) {
      console.error(error);
      dispatch(openSnackbar("Server error", false));
    }
    setLoading(false);
  };
  useEffect(() => {
    roleListAsync();
    privilegeListAsync();
  }, []);
  const handleAssignPrivilege = (role) => {
    setSelectedRole(role);
    const rolePrivilege = role?.privileges?.map((prvlg) => prvlg.id);
    privilegeFormik.setValues({
      privilege_ids: rolePrivilege,
    });
    setPrivilegeModalShow(true);
  };
  const handleRoleDelete = useDeleteHandler(roleDelete, roleListAsync);
  const handleDelete = (role) => {
    handleRoleDelete(role);
  };
  const onSubmitRole = async (values) => {
    setLoading(true);
    try {
      let res;
      if (singleRole?.id) {
        res = await roleEdit(values);
        dispatch(openSnackbar("Successfully Updated", true));
      } else {
        res = await roleCreate(values);
        dispatch(openSnackbar("Successfully Created", true));
      }
      setDuplicateError(null);
      handleCloseModal();
      roleListAsync();
    } catch (error) {
      setLoading(false);

      console.error(error);
      if (error.status === 422) {
        setDuplicateError(
          error?.data?.errors?.name && error?.data?.errors?.name[0]
        );
      } else {
        dispatch(openSnackbar("server error", false));
      }
    }
  };
  const formik = useFormik({
    initialValues: { name: "" },
    onSubmit: onSubmitRole,
    validateOnChange: true,
    validationSchema: createRoleSchema,
  });
  const privilegeFormik = useFormik({
    initialValues: { privilege_ids: [] },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await assignPrivilege(values, selectedRole?.id);
        dispatch(openSnackbar("Successfully Assigned Privilege", true));
        roleListAsync();
        handleClosePrivilegeModal();
      } catch (error) {
        dispatch(openSnackbar("server error", false));
      }
      setLoading(false);
    },
    validateOnChange: true,
    validationSchema: assignPrivilegeSchema,
  });
  return (
      <DefaultLayout>

        {loading && <Loader />}
        <div className="container mx-auto">
          <div className="text-center mt-4">
            <div className="text-2xl font-semibold">Role List</div>
          </div>

          <div className="flex flex-wrap pt-3">
            <div className="w-full md:w-2/3"></div>
            <div className="w-full md:w-1/3 flex justify-end">
              {hasPermission?.includes(privilegesEnum.RoleCreate) && (
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center"
                  onClick={() => setModalShow(true)}
                >
                  Create New Role
                </button>
              )}
            </div>
          </div>

          <div className="mt-3">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="text-center bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2">#</th>
                    <th className="border border-gray-300 px-4 py-2">Name</th>
                    <th className="border border-gray-300 px-4 py-2">Slug</th>
                    <th className="border border-gray-300 px-4 py-2">Privileges</th>
                    <th className="border border-gray-300 px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles?.length > 0 ? (
                    roles.map((role, index) => (
                      <tr key={role.id} className="text-center">
                        <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                        <td className="border border-gray-300 px-4 py-2">{role.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{role.slug}</td>
                        <td className="border border-gray-300 px-4 py-2 max-w-xs">
                          {role?.privileges?.map((prvlg, i) => (
                            <span
                              key={i}
                              className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded mr-1 mb-1 inline-block"
                            >
                              {prvlg?.name}
                            </span>
                          ))}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {hasPermission?.includes(privilegesEnum.AssignPrivilege) && (
                            <button
                              className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 mr-2"
                              onClick={() => handleAssignPrivilege(role)}
                            > Assign Privilege
                            </button>
                          )}
                          {hasPermission?.includes(privilegesEnum.RoleUpdate) && 
                              (role.slug !== 'admin' && role.slug !== 'user') && (
                                <button
                                  className="bg-yellow-500 text-white py-1 px-1 rounded hover:bg-yellow-600 mr-2"
                                  onClick={() => handleEdit(role)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M16.5 3.5l4 4L7 21H3v-4L16.5 3.5z"
                                    />
                                  </svg>
                                </button>
                            )}
                          {hasPermission?.includes(privilegesEnum.RoleDelete) &&
                            (role.slug !== 'admin' && role.slug !== 'user') && (
                            <button
                              className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                              onClick={() => handleDelete(role)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center p-4">
                        {!loading && "No Data Found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <CommonModal
          modalShow={modalShow}
          handleCloseModal={handleCloseModal}
          title={`${singleRole?.id ? "Update Role" : "Create New Role"}`}
        >
          <form onSubmit={formik.handleSubmit}>
            {duplicateError && (
              <div className="text-red-500 text-center mb-2">
                <i className="bi bi-x-octagon-fill pe-2"></i>
                {duplicateError}
              </div>
            )}
            <div className="mb-3 flex items-center">
              <label className="w-1/4 text-right pr-3">Name</label>
              <div className="w-3/4">
                <InputField
                  formik={formik}
                  fieldName={"name"}
                  placeholder={"Role Name"}
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
                text={`${singleRole?.id ? "Update" : "Create"}`}
                color="primary"
                disabled={formik.errors.name || loading}
              />
            </div>
          </form>
        </CommonModal>

        <CommonModal
          modalShow={privilegeModalShow}
          handleCloseModal={handleClosePrivilegeModal}
          title={`Assign Privilege to ${selectedRole?.name}`}
        >
          <form onSubmit={privilegeFormik.handleSubmit}>
            <div className="mb-3 flex items-center">
              <label className="w-1/4 text-right pr-3">Privileges</label>
              <div className="w-3/4">
                <DropdownField
                  formik={privilegeFormik}
                  fieldName="privilege_ids"
                  placeholder="Select an option"
                  options={privilege}
                  isMulti={true}
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 mr-2"
                onClick={handleClosePrivilegeModal}
              >
                Cancel
              </button>
              <Button
                buttonType="submit"
                text={`Assign`}
                color="primary"
                disabled={privilegeFormik.errors.privilege_ids || loading}
              />
            </div>
          </form>
        </CommonModal>

      </DefaultLayout>
    
  );
}
