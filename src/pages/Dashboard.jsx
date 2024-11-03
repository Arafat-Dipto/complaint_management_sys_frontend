import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Loader from '../component/common/Loader';
import DefaultLayout from '../component/layout/DefaultLayout';
import { openSnackbar } from '../redux/actions/snackbarAction';
import { dashboardCounts } from '../services/Dashboard';

function Dashboard() {
  const [data, setData] = useState({ total_users: 0, total_complaints: 0 });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await dashboardCounts();
      if (res?.success) {
        setData(res?.data);
      }
    } catch (error) {
      dispatch(openSnackbar("Server error", false));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loader />;
  }
  
  return (
    <DefaultLayout>
      <div className=" min-h-screen p-6">
        <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
          {/* Total Users Card */}
          <div className="relative flex-1 bg-blue-100 shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105 duration-300 ease-in-out">
            <svg
              className="absolute inset-0 w-full h-full opacity-20"
              viewBox="0 0 200 200"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern id="pattern1" patternUnits="userSpaceOnUse" width="100" height="100">
                  <circle cx="50" cy="50" r="50" fill="rgba(59, 130, 246, 0.1)" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pattern1)" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
            <p className="text-2xl font-bold text-blue-600 mt-2">{data.total_users}</p>
            <svg
              className="h-8 w-8 text-blue-500 mt-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 12c2.67 0 4-1.33 4-4s-1.33-4-4-4-4 1.33-4 4 1.33 4 4 4zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z" fill="currentColor"/>
            </svg>
          </div>

          {/* Total Complaints Card */}
          <div className="relative flex-1 bg-red-100 shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105 duration-300 ease-in-out">
            <svg
              className="absolute inset-0 w-full h-full opacity-20"
              viewBox="0 0 200 200"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern id="pattern2" patternUnits="userSpaceOnUse" width="100" height="100">
                  <circle cx="50" cy="50" r="50" fill="rgba(239, 68, 68, 0.1)" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pattern2)" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-700">Total Complaints</h2>
            <p className="text-2xl font-bold text-red-600 mt-2">{data.total_complaints}</p>
            <svg
              className="h-8 w-8 text-red-500 mt-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 4h-4l-2-2H8L6 4H2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 18H2V6h18v16z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default Dashboard;
