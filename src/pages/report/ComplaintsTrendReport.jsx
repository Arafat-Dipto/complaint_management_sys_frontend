import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Loader from '../../component/common/Loader';
import DefaultLayout from '../../component/layout/DefaultLayout';
import { openSnackbar } from '../../redux/actions/snackbarAction';
import { ComplaintsTrend } from '../../services/Report';

function ComplaintsTrendReport() {
    const [trendData, setTrendData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const dispatch = useDispatch();

    const fetchComplaintsTrend = async () => {
        setLoading(true);
        try {
            const params = {};
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;

            const res = await ComplaintsTrend("", params);
            if (res?.success) {
                setTrendData(res?.data);
            } else {
                dispatch(openSnackbar("Failed to retrieve trend data", false));
            }
        } catch (error) {
            console.error("Error fetching complaints trend:", error);
            dispatch(openSnackbar("Server error", false));
        }
        setLoading(false);
    };

    const handleFilter = () => {
        fetchComplaintsTrend();
    };

    useEffect(() => {
        fetchComplaintsTrend();
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <DefaultLayout>
            <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Complaints Trend Over Time</h2>
                
                <div className="mb-4 flex space-x-4">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="px-4 py-2 border rounded-md"
                        placeholder="Start Date"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="px-4 py-2 border rounded-md"
                        placeholder="End Date"
                    />
                    <button
                        onClick={handleFilter}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Filter
                    </button>
                </div>

                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border">Date</th>
                            <th className="px-4 py-2 border">Total Submitted</th>
                            <th className="px-4 py-2 border">Total Resolved</th>
                            <th className="px-4 py-2 border">Total Closed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trendData.length > 0 ? (
                            trendData.map((item, index) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2 text-center">{item.date}</td>
                                    <td className="border px-4 py-2 text-center">{item.total_submitted}</td>
                                    <td className="border px-4 py-2 text-center">{item.total_resolved}</td>
                                    <td className="border px-4 py-2 text-center">{item.total_closed}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="border px-4 py-2 text-center">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </DefaultLayout>
    );
}

export default ComplaintsTrendReport;
