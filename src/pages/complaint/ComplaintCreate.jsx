import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import DropdownField from '../../component/common/DropdownField';
import FileAttachmentField from '../../component/common/FileAttachmentField';
import DefaultLayout from '../../component/layout/DefaultLayout';
import { openSnackbar } from '../../redux/actions/snackbarAction';
import { categoryList } from '../../services/Category';
import { complaintCreate } from '../../services/Complaint';
import { createOptionsReactSelect } from "../../utils/MakeOptionsSelect.js";

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  category_id: Yup.number().required('Category is required'),
  priority: Yup.string().required('Priority is required'),
  attachment: Yup.mixed().nullable(), // Add required validation for attachment
  bill_attachments: Yup.array(),
});

const ComplaintCreate = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
  ]);
const [singleFileAttachment, setSingleFileAttachment] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
const [mergeFile, setMergeFile] = useState([]);
  const categoryListAsync = async () => {
    setLoading(true);
    try {
      const res = await categoryList();
      if (res?.success) {
        const categoryOptions = createOptionsReactSelect(res?.data, "id", "name");
        setCategories(categoryOptions);
      }
    } catch (error) {
      console.error(error);
      dispatch(openSnackbar("Server error", false));
    }
    setLoading(false);
  };

  useEffect(() => {
    categoryListAsync();
  }, []);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      category_id: '',
      priority: '',
      attachment: [],
      // bill_attachments: [],
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      console.log('object',selectedFiles)
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("category_id", values.category_id);
      formData.append("priority", values.priority);
      if(selectedFiles.length > 0) {

        formData.append("attachment", selectedFiles[0]);
      }

      try {
        const response = await complaintCreate(formData);
        dispatch(openSnackbar("Complaint Created Successfully", true));
        resetForm();
        window.location.href = '/complaints'; // Uncomment this if you want to redirect after submission
      } catch (err) {
        console.error('Complaint error:', err);
      }
      setSubmitting(false);
    },
  });

  return (
    <DefaultLayout>
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Complaint</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4" encType="multipart/form-data">
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              {...formik.getFieldProps('title')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              {...formik.getFieldProps('description')}
              rows="4"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            ></textarea>
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.description}</p>
            )}
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Category</label>
              <DropdownField
                formik={formik}
                fieldName="category_id"
                placeholder="Select a category"
                options={categories}
                isMulti={false}
              />
              {formik.touched.category_id && formik.errors.category_id && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.category_id}</p>
              )}
            </div>

            <div className="w-1/2">
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
              <DropdownField
                formik={formik}
                fieldName="priority"
                placeholder="Select priority"
                options={priorities}
                isMulti={false}
              />
              {formik.touched.priority && formik.errors.priority && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.priority}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="attachment" className="block text-sm font-medium text-gray-700">Attachment</label>
            <FileAttachmentField
                    fileAttachment={singleFileAttachment}
                    formik={formik}
                    fieldName="attachment"
                    placeholder="Upload Attachments"
                    setMergeFile={setMergeFile}
                    mergeFile={mergeFile}
                    selectedFiles={selectedFiles}
                    setSelectedFiles={setSelectedFiles}
                  />
            {formik.touched.attachment && formik.errors.attachment && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.attachment}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => formik.resetForm()}
              className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default ComplaintCreate;
