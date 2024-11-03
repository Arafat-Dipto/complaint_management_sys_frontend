import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Loader from '../../component/common/Loader';
import DefaultLayout from '../../component/layout/DefaultLayout';
import { openSnackbar } from '../../redux/actions/snackbarAction';
import { ComplaintsByPriority } from "../../services/Report";

function ComplaintsByPriorityReport() {
    const [priorityReport, setPriorityReport] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const complaintsByPriorityReportAsync = async () => {
        setLoading(true);
        try {
            const res = await ComplaintsByPriority();
            if (res?.success) {
                setPriorityReport(res?.data);
            }
        } catch (error) {
            dispatch(openSnackbar("server error", false));
        }
        setLoading(false);
    };

    useEffect(() => {
        complaintsByPriorityReportAsync();
    }, []);

    if (loading) {
        return <Loader />;
    }
    return (
        <DefaultLayout>
            <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Complaints by Priority</h2>
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border">Priority</th>
                            <th className="px-4 py-2 border">Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {priorityReport.map((priority, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2 text-center">{priority.priority}</td>
                                <td className="border px-4 py-2 text-center">{priority.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DefaultLayout>
    );
}

export default ComplaintsByPriorityReport;
