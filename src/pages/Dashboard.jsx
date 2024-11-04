import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../component/common/Loader';
import DefaultLayout from '../component/layout/DefaultLayout';
import { openSnackbar } from '../redux/actions/snackbarAction';
import { dashboardCounts } from '../services/Dashboard';
import { ComplaintsByPriority, ComplaintsByStatus } from '../services/Report';

function Dashboard() {
  const [data, setData] = useState({ total_users: 0, total_complaints: 0 });
  const [statusReport, setStatusReport] = useState([]);
  const [priorityReport, setPriorityReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const auth = useSelector((state) => state?.auth?.user);
  
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

  const fetchComplaintsByStatus = async () => {
    setLoading(true);
    try {
      const res = await ComplaintsByStatus();
      if (res?.success) {
        setStatusReport(res?.data);
      }
    } catch (error) {
      dispatch(openSnackbar("Server error", false));
    }
    setLoading(false);
  };

  const fetchComplaintsByPriority = async () => {
    setLoading(true);
    try {
      const res = await ComplaintsByPriority();
      if (res?.success) {
        setPriorityReport(res?.data);
      }
    } catch (error) {
      dispatch(openSnackbar("Server error", false));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
    fetchComplaintsByStatus();
    fetchComplaintsByPriority();
  }, []);

  // Prepare data for bar chart (complaints by status)
  const statusCategories = statusReport.map(item => item.status);
  const statusSeriesData = statusReport.map(item => item.total);

  const statusOptions = {
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        endingShape: 'rounded'
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: statusCategories
    },
    yaxis: {
      title: {
        text: "Total Complaints"
      }
    },
    title: {
      text: "Complaints by Status",
      align: 'center'
    },
    colors: ["#008FFB", "#00E396", "#FEB019"]
  };

  const statusSeries = [
    {
      name: "Total Complaints",
      data: statusSeriesData
    }
  ];

  // Prepare data for pie chart (complaints by priority)
  const priorityLabels = priorityReport.map(item => item.priority);
  const prioritySeriesData = priorityReport.map(item => item.total);

  const priorityOptions = {
    chart: {
      type: 'pie'
    },
    labels: priorityLabels,
    title: {
      text: "Complaints by Priority",
      align: 'center'
    },
    colors: ["#26de81", "#f7b731", "#fa8231"],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  if (loading) {
    return <Loader />;
  }
  
  return (
    <DefaultLayout>
      <div className="min-h-screen p-6">
        
        <div className="grid grid-cols-1 gap-4 px-3 mt-8 sm:grid-cols-3 sm:px-6">
          <div className="flex items-center bg-white border rounded-sm overflow-hidden shadow">
              <div className="p-4 bg-green-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z">
                      </path>
                  </svg></div>
              <div className="px-4 text-gray-700">
                  <h3 className="text-sm tracking-wider">Total Users</h3>
                  <p className="text-3xl">{data.total_users}</p>
              </div>
          </div>
          <div className="flex items-center bg-white border rounded-sm overflow-hidden shadow">
              <div className="p-4 bg-blue-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2">
                      </path>
                  </svg></div>
              <div className="px-4 text-gray-700">
                  <h3 className="text-sm tracking-wider">Total Complaints</h3>
                  <p className="text-3xl">{data.total_complaints}</p>
              </div>
          </div>
          <div className="flex items-center bg-white border rounded-sm overflow-hidden shadow">
              <div className="p-4 bg-indigo-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z">
                      </path>
                  </svg></div>
              <div className="px-4 text-gray-700">
                  <h3 className="text-sm tracking-wider">Total Comment</h3>
                  <p className="text-3xl">{data.total_comments}</p>
              </div>
          </div>
        </div>

        {auth.roles[0].slug === 'admin' && (
            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Complaints by Status (Bar Chart) */}
              <div>
                <Chart
                  options={statusOptions}
                  series={statusSeries}
                  type="bar"
                  height={350}
                />
              </div>

              {/* Complaints by Priority (Donut Chart) */}
              <div>
                <Chart
                  options={priorityOptions}
                  series={prioritySeriesData}
                  type="donut"
                  height={350}
                />
              </div>
            </div>
        )}
      </div>
    </DefaultLayout>
  );
}

export default Dashboard;
