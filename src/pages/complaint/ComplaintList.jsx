import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../../component/common/Button";
import CommonModal from "../../component/common/CommonModal";
import DropdownField from "../../component/common/DropdownField";
import Loader from "../../component/common/Loader";
import Pagination from "../../component/common/Pagination";
import DefaultLayout from "../../component/layout/DefaultLayout";
import { openSnackbar } from "../../redux/actions/snackbarAction";
import { complaintList, complaintStatusUpdate } from "../../services/Complaint";
import { privilegesEnum } from "../../utils/Privileges";

export default function ComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [complaintId, setComplaintId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [limit, setLimit] = useState(5);
  const [pageCount, setPageCount] = useState(1); // Adjust to get correct count from API
  const [page, setPage] = useState(1); // Start from the first page
  const hasPermission = useSelector((state) => state?.auth?.privilege);
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    setModalShow(false);
    formik.resetForm();
  };

  const complaintListAsync = async () => {
    setLoading(true);
    try {
      const res = await complaintList("", { perPage: limit, page });
      if (res?.success) {
        setComplaints(res?.data);
        setPageCount(res?.total_pages || 1); // Set total pages dynamically from API
        if (res?.data?.length === 0 && page > 1) {
          setPage((prevPage) => prevPage - 1);
        }
      }
    } catch (error) {
      dispatch(openSnackbar("Server error", false));
    }
    setLoading(false);
  };

  useEffect(() => {
    complaintListAsync();
  }, [page]);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await complaintStatusUpdate(values, complaintId);
      dispatch(openSnackbar("Successfully Updated", true));
      handleCloseModal();
      complaintListAsync();
    } catch (error) {
      dispatch(openSnackbar("Server error", false));
    }
    setLoading(false);
  };

  const formik = useFormik({
    initialValues: { status: "" },
    onSubmit,
    validateOnChange: true,
  });

  const statuses = [
    { value: "Open", label: "Open" },
    { value: "In Progress", label: "In Progress" },
    { value: "Resolved", label: "Resolved" },
    { value: "Closed", label: "Closed" },
  ];

  const handleEdit = (complaint) => {
    formik.setValues({ status: complaint.status });
    setComplaintId(complaint.id);
    setModalShow(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage !== page) setPage(newPage);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <DefaultLayout>
      <div className="container">
        <div className="text-center mt-4">
          <h2 className="text-2xl font-semibold">Complaint List</h2>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex-grow text-end">
            {hasPermission?.includes(privilegesEnum.ComplaintCreate) && (
              <Link to={`/complaints/create`}>
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
                  Create Complaint
                </button>
              </Link>
            )}
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr className="text-center">
                <th className="border border-gray-300 px-4 py-2">#</th>
                <th className="border border-gray-300 px-4 py-2">Title</th>
                <th className="border border-gray-300 px-4 py-2">User Name</th>
                <th className="border border-gray-300 px-4 py-2">Category</th>
                <th className="border border-gray-300 px-4 py-2">Priority</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Attachment</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint, key) => (
                <tr key={complaint.id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{key + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{complaint.title}</td>
                  <td className="border border-gray-300 px-4 py-2">{complaint.user.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{complaint.category.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{complaint.priority}</td>
                  <td className="border border-gray-300 px-4 py-2">{complaint.status}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <img src={`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/storage/${complaint.attachment}`} alt="" className="h-10 w-24" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {hasPermission?.includes(privilegesEnum.ComplaintShow) && (
                      <Link to={`/complaints/details/${complaint.id}`} className="text-green-500 mx-2">
                        View
                      </Link>
                    )}
                    {hasPermission?.includes(privilegesEnum.ComplaintStatusUpdate) && (
                      <button
                        className="text-blue-500 mx-2"
                        onClick={() => handleEdit(complaint)}
                      >
                        Update
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && complaints.length > 0 && pageCount > 1 && (
          <div className="flex justify-end mt-4">
            <Pagination pageCount={pageCount} setPage={handlePageChange} currentPage={page} />
          </div>
        )}

        <CommonModal modalShow={modalShow} handleCloseModal={handleCloseModal} title="Update Status">
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label>Status</label>
              <DropdownField
                formik={formik}
                fieldName="status"
                placeholder="Select an option"
                options={statuses}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="bg-gray-200 text-gray-700 py-2 px-4 rounded"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <Button
                buttonType="submit"
                text="Update"
                color="primary"
                disabled={loading || Object.keys(formik.errors).length > 0}
              />
            </div>
          </form>
        </CommonModal>
      </div>
    </DefaultLayout>
  );
}
