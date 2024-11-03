import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Loader from '../../component/common/Loader';
import DefaultLayout from '../../component/layout/DefaultLayout';
import { openSnackbar } from '../../redux/actions/snackbarAction';
import { AverageResolutionTime } from '../../services/Report';

function AverageResolutionTimeReport() {
    const [averageTimes, setAverageTimes] = useState([]);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();
    const averageResolutionTimeReportAsync = async () => {
        setLoading(true);
        try {
            const res = await AverageResolutionTime();
            if (res?.success) {
                setAverageTimes(res?.data);
            }
        } catch (error) {
            dispatch(openSnackbar("server error", false));
        }
        setLoading(false);
    };

    useEffect(() => {
        averageResolutionTimeReportAsync();
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <DefaultLayout>
            <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Average Resolution Time by Category</h2>
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border">Category</th>
                            <th className="px-4 py-2 border">Average Resolution Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {averageTimes.length > 0 ? (
                            averageTimes.map((category, index) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2 text-center">{category.category}</td>
                                    <td className="border px-4 py-2 text-center">{category.average_resolution_time}</td>
                                </tr>
                            ))
                            ) : (
                            <p>No data available</p>
                        )}
                    </tbody>
                </table>
            </div>
        </DefaultLayout>
    );
}

export default AverageResolutionTimeReport;
