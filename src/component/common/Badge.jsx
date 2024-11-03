export default function Badge({ color, text, count }) {
  return (
    <div className="badges m-auto ">
      <span
        className="badge-section-line"
        style={{ color: color, backgroundColor: color }}
      ></span>
      <span className="badge-text ps-3">{text}</span>
      <span className="badge-number ps-5">{count}</span>
    </div>
  );
}
