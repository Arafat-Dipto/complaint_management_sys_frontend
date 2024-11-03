import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDateRange = ({
  startDate,
  endDate,
  setDateRange,
  customStyle = "",
  popperClassName = "",
  showMonthYearPicker = false, // Add this prop to control the calendar view
}) => {
  return (
    <>
      <DatePicker
        showIcon
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          setDateRange(update);
        }}
        minDate={startDate}
        isClearable={true}
        className={`form-control date-picker-input custom-width ${customStyle}`}
        placeholderText="Select Date Range"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        popperClassName={popperClassName}
        onKeyDown={(e) => {
          e.preventDefault();
        }}
        dateFormat={showMonthYearPicker ? "MMM yyyy" : "MM/dd/yyyy"} // Format date according to the view
        showMonthYearPicker={showMonthYearPicker} // Show only month and year if the prop is true
      />
    </>
  );
};

export default CustomDateRange;
