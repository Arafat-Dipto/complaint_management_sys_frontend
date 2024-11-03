export default function TextareaField({
  type,
  formik,
  fieldName,
  placeholder,
  icon,
}) {
  return (
    <>
      <div className="input-group">
        {icon && (
          <span
            className={`input-group-text ${
              formik.touched[fieldName] && formik.errors[fieldName]
                ? "border-danger"
                : ""
            }`}
          >
            <i className={icon}></i>{" "}
          </span>
        )}
        <textarea
          type={type || fieldName}
          placeholder={placeholder}
          className={`form-control ${
            formik.touched[fieldName] && formik.errors[fieldName]
              ? "border-danger"
              : ""
          }`}
          {...formik.getFieldProps(fieldName)}
        />
      </div>
      {formik.touched[fieldName] && formik.errors[fieldName] && (
        <div className="text-danger text-start mt-1 small">
          {formik.errors[fieldName]}
        </div>
      )}
    </>
  );
}
