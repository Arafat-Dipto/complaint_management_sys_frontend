// ComplaintsByStatusReport.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Loader from '../../component/common/Loader';
import DefaultLayout from '../../component/layout/DefaultLayout';
import { openSnackbar } from '../../redux/actions/snackbarAction';
import { ComplaintsByStatus } from "../../services/Report";

function ComplaintsByStatusReport() {
    const [statusReport, setStatusReport] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const complaintsByStatusReportAsync = async () => {
        setLoading(true);
        try {
            const res = await ComplaintsByStatus();
            if (res?.success) {
                setStatusReport(res?.data);
            }
        } catch (error) {
            dispatch(openSnackbar("server error", false));
        }
        setLoading(false);
    };

    useEffect(() => {
        complaintsByStatusReportAsync();
    }, []);

    if (loading) {
        return <Loader />;
    }
    return (
        <DefaultLayout>
            <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Complaints by Status</h2>
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border">Status</th>
                            <th className="px-4 py-2 border">Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {statusReport.map((status, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2 text-center">{status.status}</td>
                                <td className="border px-4 py-2 text-center">{status.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DefaultLayout>
    );
}

export default ComplaintsByStatusReport;
