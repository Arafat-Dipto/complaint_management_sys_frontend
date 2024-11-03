import { useFormik } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { setUser } from '../redux/actions/authTokenAction';
import { openSnackbar } from "../redux/actions/snackbarAction";
import { setAuthUser, setPrivilege } from '../redux/reducers/authSlice';
import { handleLogin } from '../services/Auth';
import { setTokenToCookies } from '../utils/common';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(4, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
  // Formik setup with Yup validation
  const dispatch = useDispatch();

  // const handleSubmit = async (values, { setSubmitting, setFieldError, resetForm }) => {
  //   try {
  //     const response = await handleLogin(values);

  //     const token = response.data.token;

  //     // Dispatch the token to the Redux store
  //     // dispatch(setToken(token));
  //     setTokenToCookies(res?.data?.token, 1);
  //       dispatch(openSnackbar("Login Successfully", true));
  //       dispatch(setUser(res?.data))

  //     // Reset the form fields after successful submission
  //     resetForm();

  //     // Optional: redirect the user to a protected route
  //     window.location.href = '/';
  //   } catch (err) {
  //     setFieldError('general', 'Invalid email or password.');
  //     console.error('Login error:', err);
  //   }
  //   setSubmitting(false);
  // };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(4, 'Password must be at least 4 characters').required('Required'),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError, resetForm }) => {
      try {
      const response = await handleLogin(values);

      const token = response.data.token;

      // Dispatch the token to the Redux store
        // dispatch(setToken(token));
        console.log(response)
      setTokenToCookies(response?.data?.token, 1);
        dispatch(openSnackbar("Login Successfully", true));
        dispatch(setUser(response?.data))
        dispatch(setAuthUser(response?.data));
        dispatch(setPrivilege(response?.data.privileges))

      // Reset the form fields after successful submission
      resetForm();

      // Optional: redirect the user to a protected route
      window.location.href = '/';
    } catch (err) {
      setFieldError('general', 'Invalid email or password.');
      console.error('Login error:', err);
    }
    setSubmitting(false);
      // Handle form submission here
    },
  });

  return (
    <>
      {/* <Breadcrumb pageName="Sign In" /> */}

      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md px-8 py-10 bg-white shadow-lg rounded-lg">
          <div className="mb-8 text-center">
            <Link className="inline-block" to="/">
              <h2 className='text-2xl font-bold'>
                Complaint Management System
              </h2>
              {/* <img className="dark:hidden w-40 mx-auto" src={LogoDark} alt="Logo" />
              <img className="hidden dark:block w-40 mx-auto" src={Logo} alt="Logo" /> */}
            </Link>
            <h2 className="text-2xl font-bold mt-4">Sign In to Your Account</h2>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
              ) : null}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password ? (
                <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
              ) : null}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                {/* <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </Link> */}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Sign In
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm">
                Don’t have an account?
                <Link to="/register" className="text-blue-600 hover:text-blue-500">
                  Sign up here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
