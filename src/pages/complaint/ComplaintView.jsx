import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import DefaultLayout from '../../component/layout/DefaultLayout';
import { commentCreate } from '../../services/Comment';
import { complaintShowById } from '../../services/Complaint';
import { privilegesEnum } from '../../utils/Privileges';

const ComplaintViewPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [complaintData, setComplaintData] = useState({});
  const [commentsData, setCommentsData] = useState([]);

  const hasPermission = useSelector(
    (state) => state?.auth?.privilege
  );
  const complaintViewAsync = async () => {
    setLoading(true);
    try {
      const res = await complaintShowById("", id);
      if (res?.success) {
        setComplaintData(res?.data);
        setCommentsData(res?.data?.comments);
      }
    } catch (error) {
      dispatch(openSnackbar("server error", false));
    }
    setLoading(false);
  };

  useEffect(() => {
    complaintViewAsync();
  }, []);

  const handleCommentSubmit = async (values, { resetForm }) => {
    if (values.comment.trim()) {
      // Call the comment submission function with Formik values
      commentCreate(values,complaintData.id);
      resetForm(); // Clear the comment input after submitting
      complaintViewAsync();
    }
  };

  const validationSchema = Yup.object({
    comment: Yup.string().required('Comment is required').min(2, 'Comment is too short'),
  });

  return (
    <DefaultLayout>
      <div className="container mx-auto p-6">
        {/* Complaint Details */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">{complaintData.title}</h2>
          <p className="text-gray-600 mb-4">{complaintData.description}</p>

          {/* Category */}
          <div className="mb-4">
            <span className="text-sm font-medium text-gray-500">Category: </span>
            <span className="text-sm text-gray-700">
              {complaintData.category?.name || "No category available"}
            </span>
          </div>

          {/* Priority */}
          <div className="mb-4">
            <span className="text-sm font-medium text-gray-500">Priority: </span>
            <span className={`inline-block px-2 py-1 text-sm font-medium rounded-full ${
              complaintData.priority === 'High' ? 'bg-red-100 text-red-700' : 
              complaintData.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
              'bg-green-100 text-green-700'
            }`}>
              {complaintData.priority || "No priority available"}
            </span>
          </div>
          
          {complaintData.attachment && 
          <div className="mt-4">
            <h3 className="font-medium text-gray-600">Attachment:</h3>
              <ul className=" pl-5 mt-2">
                  <li>
                      <img src={`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/storage/${complaintData.attachment}`} alt=""/>
                  </li>
              </ul>
          </div>
          }
        </div>

        {/* Comments Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Comments</h3>
          {/* Add Comment with Formik */}
          {hasPermission?.includes(privilegesEnum.CommentCreate) && (
            <Formik
              initialValues={{ comment: '' }}
              validationSchema={validationSchema}
              onSubmit={handleCommentSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="flex items-start space-x-4">
                  <div className="w-full">
                    <Field
                      as="textarea"
                      name="comment"
                      placeholder="Add a comment..."
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      rows="2"
                    />
                    <ErrorMessage
                      name="comment"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
                    disabled={isSubmitting}
                  >
                    Post
                  </button>
                </Form>
              )}
            </Formik>
          )}
          {/* Comment List */}
          <div className="mb-6">
            {commentsData && commentsData.length > 0 ? (
              <ul className="space-y-4">
                {commentsData.map((commentItem, index) => (
                  <li key={index} className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{commentItem.admin.name}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(commentItem.created_at).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',    
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true
                        })}
                      </span>
                    </div>
                    <p className="text-gray-600">{commentItem.comment}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>

          
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ComplaintViewPage;
