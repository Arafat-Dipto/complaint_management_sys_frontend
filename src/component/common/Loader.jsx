// OverlaySpinner.jsx
import React from "react";
import loader from "../../assets/loader.gif";
import DefaultLayout from "../layout/DefaultLayout";
const Loader = ({ isLoading }) => {
  return (
    <DefaultLayout>
      <div className="overlay-spinner-container ml-3">
        <div className="overlay-spinner-content">
          <img src={loader} alt="Loading..." />
          <p>Processing, please wait...</p>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Loader;
