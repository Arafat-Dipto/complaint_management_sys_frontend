import React from "react";
import ExportIcon from "../../assets/exportIcon.svg";

const CommonExportButton = ({ handleExcel, handleCSV, handlePDF }) => {
  return (
    <div>
      <div className="dropdown">
        <button
          className="create-button dropdown-toggle d-flex align-items-center"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img src={ExportIcon} alt="Icon" className="icon" />
          Export
        </button>
        <ul className="dropdown-menu min-width-120 bg-white text-start">
          <li>
            <span
              className="dropdown-item cursor-pointer"
              onClick={handleExcel}
            >
              Excel
            </span>
          </li>
          <li>
            <span className="dropdown-item cursor-pointer" onClick={handlePDF}>
              PDF
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CommonExportButton;
