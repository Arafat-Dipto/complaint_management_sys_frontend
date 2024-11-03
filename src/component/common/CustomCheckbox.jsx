import React from "react";

const CustomCheckbox = ({ id, name, formik }) => {
  const checkedValue = formik.values[name];
  const onChange = formik.setFieldValue;

  const handleChange = (e) => {
    const newValue = e.target.checked ? 1 : 0;
    onChange(name, newValue);
  };

  return (
    <>
      <input
        className="form-check-input me-2"
        type="checkbox"
        id={id}
        name={name}
        checked={checkedValue === 1}
        onChange={handleChange}
      />
      {formik.touched[name] && formik.errors[name] && (
        <div className="text-danger text-start mt-1 small">
          {formik.errors[name]}
        </div>
      )}
    </>
  );
};

export default CustomCheckbox;
