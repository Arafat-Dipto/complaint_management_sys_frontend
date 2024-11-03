import React from "react";
import Select from "react-select";

export default function DropdownField({
  formik,
  fieldName,
  placeholder,
  options,
  isMulti,
  isDisabled,
}) {
  return (
    <>
      <Select
        classNamePrefix="creatable-select"
        name={fieldName}
        options={options}
        isMulti={isMulti}
        value={
          isMulti
            ? options?.filter((option) =>
              formik?.values[fieldName]?.includes(option?.value)
            )
            : options?.find(
              (option) => option.value === formik.values[fieldName]
            )
        }
        onChange={(selectedOption) =>
          formik.setFieldValue(
            fieldName,
            selectedOption
              ? isMulti
                ? selectedOption.map((item) => item.value)
                : selectedOption.value
              : ""
          )
        }
        placeholder={placeholder}
        isDisabled={isDisabled}
      />
      {formik?.touched[fieldName] && formik?.errors[fieldName] && (
        <div className="text-danger text-start mt-1 small">
          {formik?.errors[fieldName]}
        </div>
      )}
    </>
  );
}
