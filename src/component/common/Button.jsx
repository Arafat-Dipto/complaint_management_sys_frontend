export default function Button({ buttonType, text, color, disabled }) {
  return (
    <>
      <button
        type={buttonType}
        disabled={disabled}
        className={`btn btn-primary custom-${color}-button`}
      >
        {text}{" "}
      </button>
    </>
  );
}
