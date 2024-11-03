import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import PrivateRoute from "./component/privateRoute/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleList from "./pages/RoleList";
import UserList from "./pages/UserList";
import CategoryList from "./pages/category/CategoryList";
import ComplaintCreate from "./pages/complaint/ComplaintCreate";
import ComplaintList from "./pages/complaint/ComplaintList";
import ComplaintViewPage from "./pages/complaint/ComplaintView";
import AverageResolutionTimeReport from "./pages/report/AverageResolutionTimeReport";
import ComplaintsByPriorityReport from "./pages/report/ComplaintsByPriorityReport";
import ComplaintsByStatusReport from "./pages/report/ComplaintsByStatusReport";
import ComplaintsTrendReport from "./pages/report/ComplaintsTrendReport";
import { privilegesEnum } from "./utils/Privileges";
import { getTokenFromCookies } from "./utils/common";

function App() {
  const auth = getTokenFromCookies();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if already authenticated and trying to access login
    if (auth && (location.pathname === "/login" || location.pathname === "/register")) {
      // console.log('object',auth)
      navigate("/");
    }
  }, [auth, location.pathname, navigate]);

  return (
    <Routes>
      {!auth && location.pathname === "/login" && (
        <Route path="/login" element={<Login />} />
      )}
      {!auth && location.pathname === "/register" && (
        <Route path="/register" element={<Register />} />
      )}
      <Route 
        path="/" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/roles" 
        element={
          <PrivateRoute requiredPermission={privilegesEnum.Role}>
            <RoleList />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/users" 
        element={
          <PrivateRoute requiredPermission={privilegesEnum.User}>
            <UserList />
          </PrivateRoute>
        } 
      />
       <Route 
        path="/categories" 
        element={
          <PrivateRoute requiredPermission={privilegesEnum.Category}>
            <CategoryList />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/complaints" 
        element={
          <PrivateRoute requiredPermission={privilegesEnum.Complaint}>
            <ComplaintList />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/complaints/create" 
        element={
          <PrivateRoute requiredPermission={privilegesEnum.ComplaintCreate}>
            <ComplaintCreate />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/complaints/details/:id" 
        element={
          <PrivateRoute requiredPermission={privilegesEnum.ComplaintShow}>
            <ComplaintViewPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/report/complaint-by-status" 
        element={
          <PrivateRoute requiredPermission={privilegesEnum.ComplaintsByStatusReport}>
            <ComplaintsByStatusReport />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/report/complaint-by-priority" 
        element={
          <PrivateRoute requiredPermission={privilegesEnum.ComplaintsByPriorityReport}>
            <ComplaintsByPriorityReport />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/report/average-resolution-time" 
        element={
          <PrivateRoute requiredPermission={privilegesEnum.AverageResolutionTimeReport}>
            <AverageResolutionTimeReport />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/report/complaint-trend-report" 
        element={
          <PrivateRoute requiredPermission={privilegesEnum.ComplaintsTrendReport}>
            <ComplaintsTrendReport />
          </PrivateRoute>
        } 
      />
      
    </Routes>
  );
}

export default App;
