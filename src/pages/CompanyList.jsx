import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import DefaultLayout from '../component/layout/DefaultLayout';
import { openSnackbar } from "../redux/actions/snackbarAction";
import { companyList } from '../services/COmpany';

function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const dispatch = useDispatch();

  const companyListAsync = async () => {
    try {
      const res = await companyList();
      if (res?.success) {
        setCompanies(res?.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(openSnackbar("Server error", false));
    }
  };

  useEffect(() => {
    companyListAsync();
  }, []);

  return (
    <DefaultLayout>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Company List
        </h4>

        {/* Table for displaying company data */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 dark:bg-meta-4">
                <th className="p-2.5 xl:p-5 text-left text-sm font-medium uppercase xsm:text-base">
                  Name
                </th>
                <th className="p-2.5 xl:p-5 text-left text-sm font-medium uppercase xsm:text-base">
                  Slug
                </th>
                <th className="p-2.5 xl:p-5 text-left text-sm font-medium uppercase xsm:text-base">
                  Bill Count
                </th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company, key) => (
                <tr
                  key={key}
                  className={`${
                    key % 2 === 0
                      ? 'bg-white dark:bg-boxdark'
                      : 'bg-gray-50 dark:bg-meta-4'
                  } border-b border-stroke dark:border-strokedark`}
                >
                  <td className="p-2.5 xl:p-5 text-black dark:text-white">
                    {company.name}
                  </td>
                  <td className="p-2.5 xl:p-5 text-meta-3">
                    {company.slug}
                  </td>
                  <td className="p-2.5 xl:p-5 text-black dark:text-white">
                    {company.bill_count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default CompanyList;
