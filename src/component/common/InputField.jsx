import { getIn } from "formik";
import React, { useEffect, useState } from "react";

const InputField = ({
  type,
  formik,
  fieldName,
  placeholder,
  icon,
  readOnly,
}) => {
  const [isDateSelected, setIsDateSelected] = useState(false);

  const fieldError = getIn(formik.errors, fieldName);
  const fieldTouched = getIn(formik.touched, fieldName);
  const fieldValue = getIn(formik.values, fieldName);

  useEffect(() => {
    if (type === "date") {
      setIsDateSelected(!!fieldValue);
    }
  }, [fieldValue, type]);

  return (
    <div className="min-w-full">
      <div className="flex items-center border rounded-md shadow-sm">
        {icon && (
          <span
            className={`px-3 ${fieldTouched && fieldError ? "border-red-500" : "border-gray-300"} bg-gray-50 text-gray-500`}
          >
            <i className={icon}></i>
          </span>
        )}
        <input
          type={type || "text"}
          placeholder={placeholder}
          className={`w-full p-2 text-sm border-none rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${fieldTouched && fieldError
            ? "ring-red-500 ring-offset-red-100"
            : "ring-gray-300"
          } ${type === "date" && isDateSelected ? "bg-gray-100" : ""}`}
          {...formik.getFieldProps(fieldName)}
          disabled={readOnly}
          min={type === "number" ? 0 : ""}
          step={type === "number" ? "0.00001" : undefined}
        />
      </div>
      <div className="mt-1">
        {fieldTouched && fieldError && (
          <div className="text-xs text-red-500">{fieldError}</div>
        )}
      </div>
    </div>
  );
};

export default InputField;
