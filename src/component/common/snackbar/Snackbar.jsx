import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeSnackbar } from "../../../redux/actions/snackbarAction";

const Snackbar = () => {
  const message = useSelector((state) => state.snackBar.message);
  const status = useSelector((state) => state.snackBar.status);
  const isOpen = useSelector((state) => state.snackBar.isOpen);

  const dispatch = useDispatch();
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        dispatch(closeSnackbar());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, dispatch]);
  return (
    <div
      className={`snackbar ${isOpen ? "show" : "none"}`}
      style={{ backgroundColor: `#${status ? "4CAF50" : "F44336"}` }}
    >
      {isOpen && (
        <div className="snackbar-content d-flex align-items-center justify-content-between">
          <span>
            {!status ? (
              <i className="bi bi-shield-x me-2"></i>
            ) : (
              <i className="bi bi-check2-circle me-2"></i>
            )}
            {message}
          </span>
        </div>
      )}
    </div>
  );
};

export default Snackbar;
