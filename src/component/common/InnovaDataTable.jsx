import { useSelector } from "react-redux";
import sortIcon from "../../assets/sort.svg";
import sortDownIcon from "../../assets/sortdown.svg";
import sortUPIcon from "../../assets/sortup.svg";
import Pagination from "./Pagination";

const InnovaDataTable = ({
  loading,
  data,
  columns,
  actions,
  pageCount,
  setPage,
  tableId,
  handleView,
  viewPermissions,
  fetchData,
  sortConfig,
  setSortConfig,
  currentPage
}) => {
  const hasPermission = useSelector(
    (state) => state?.authToken?.user?.privileges
  );

  const getSortIcon = (column) => {
    if (sortConfig?.key === column?.field) {
      return sortConfig?.direction === "asc" ? sortUPIcon : sortDownIcon;
    }
    return sortIcon;
  };
  const handleSort = (column) => {
    if (column.sortable) {
      const direction =
        sortConfig.key === column.field && sortConfig.direction === "asc"
          ? "desc"
          : "asc";
      setSortConfig({ key: column.field, direction });
    }
  };
  return (
    <>
      <div className="table-responsive px-3">
        <table className="table table-bordered table-border-color" id={tableId}>
          <thead>
            <tr className="text-center">
              {columns &&
                !loading &&
                columns?.map((column, index) => (
                  <th
                    key={index}
                    className={`table-header-background ${
                      column?.sortable && "cursor-pointer"
                    } `}
                    scope="col"
                    onClick={() => handleSort(column)}
                  >
                    <span className="table-header-text-style">
                      {column?.header}{" "}
                      {column?.sortable && (
                        <img src={getSortIcon(column)} alt="Sort Icon" />
                      )}
                    </span>
                  </th>
                ))}
              {!loading && actions && (
                <th className="table-header-background" scope="col">
                  <span className="table-header-text-style">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          {!loading && (
            <tbody>
              {data?.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index} className="text-center">
                    {columns?.map((column, idx) => (
                      <td
                        key={column.field}
                        onClick={() =>
                          viewPermissions && idx === 0 && handleView(item)
                        }
                      >
                        <span
                          className={`table-cell-text-style  ${
                            viewPermissions && idx === 0 && "table-cell-hover"
                          }`}
                          {...(viewPermissions && idx === 0
                            ? { title: "click to view details" }
                            : {})}
                        >
                          {column.field.includes(".")
                            ? column.field
                                .split(".")
                                .reduce(
                                  (obj, key) => (obj && obj[key]) || "",
                                  item
                                )
                            : item[column.field]}
                        </span>
                      </td>
                    ))}

                    {actions && (
                      <td
                        className={`text-center ${
                          actions?.length === 2 ? "width-200" : "width-130"
                        }`}
                      >
                        {actions?.map((action, idx) =>
                          hasPermission?.includes(action.roleName) &&
                          (!action.condition || action.condition(item)) ? (
                            <button
                              key={idx}
                              className={`${action.className} me-3 mt-1`}
                              onClick={() => action.onClick(item)}
                            >
                              <i className={action?.icon}></i>
                            </button>
                          ) : (
                            ""
                          )
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + 1 + (actions ? 1 : 0)}
                    className="text-center"
                  >
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>
      {!loading && data?.length > 0 && pageCount && (
        <div className="d-flex justify-content-end ">
          <Pagination pageCount={pageCount} setPage={setPage} currentPage={currentPage} />
        </div>
      )}
    </>
  );
};

export default InnovaDataTable;
