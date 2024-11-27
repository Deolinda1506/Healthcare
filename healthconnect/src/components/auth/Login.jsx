import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/login";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false); // Add loading state
  const dispatch = useDispatch();
  const goto = useNavigate();
  const usersLogin = useSelector((state) => state.sharedData);
  console.log(usersLogin);

  useEffect(() => {
    if (Object.keys(usersLogin.usersLogin).length > 0) {
      goto("/dashboard");
    }
  }, [])

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true); // Set loading to true when form is submitting
      try {
        console.log(values)
        const resultAction = await dispatch(loginUser(values));
        if (loginUser.fulfilled.match(resultAction)) {
          goto("/dashboard");
        } else {
          toast.error("Unexpected error occurred. Please try again later.");
        }
      } catch (error) {
        toast.error("Unexpected error occurred. Please try again later.");
      } finally {
        setLoading(false); // Set loading to false after operation
      }
    },
  });

  return (
    <div>
      <Toaster />
      <div className="my-[4vh] mt-[2vh] text-center sm:text-left">
        <span className="text-2xl text-[#12B536] sm:ml-10">
          <span className="text-[#2F4AD6]">Health</span>Connect
        </span>
      </div>
      <div className="main sm:flex">
        <div className="left w-1/2 mx-auto">
          <img src="/HealthConnect landing image.png" alt="" />
        </div>
        <div className="right sm:w-1/2">
          <div className="title">
            <h1 className="text-2xl sm:mt-[14vh] text-center font-semibold text-[#404660]">
              Sign In
            </h1>
            <p className="text-center text-[#40466088]">
              Welcome back to HealthConnect.
            </p>
          </div>
          <form
            id="form"
            className="flex flex-col w-full items-center justify-center text-[#404660] mx-auto"
            onSubmit={formik.handleSubmit}
          >
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="input-field w-2/3"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            {formik.errors.email && formik.touched.email ? (
              <p className="text-red-600 mt-[-8px]">{formik.errors.email}</p>
            ) : null}
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              className="input-field w-2/3"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            {formik.errors.password && formik.touched.password ? (
              <p className="text-red-600 mt-[-8px]">{formik.errors.password}</p>
            ) : null}
          </form>
          <div className="terms text-center mt-[3vh]">
            <input
              type="checkbox"
              name="agree"
              id="agree"
              onClick={() => setRemember(!remember)}
              defaultChecked="true"
            />{" "}
            Remember me
          </div>
          <button
            className="bg-[#2F4AD6] w-2/3 hover:bg-blue-900 transition duration-300 text-white font-semibold py-2 px-4 rounded rounded-md mx-auto block mt-[2vh] mb-[3vh]"
            type="submit"
            form="form"
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : (
              "Sign In"
            )}
          </button>

          <p className="text-center">
            Don't have an account?{" "}
            <Link className="text-[#2F4AD6]" to="/register">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
