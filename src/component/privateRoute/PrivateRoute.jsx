import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getTokenFromCookies } from "../../utils/common";

const PrivateRoute = ({ children, requiredPermission }) => {
  const auth = getTokenFromCookies();
  const hasPermission = useSelector(
    (state) => state?.auth?.privilege
  );

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission?.includes(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;
