import { useFormik } from "formik";
import * as Yup from "yup";
import CreateAxiosInstance from "../../features/axios";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const instance = CreateAxiosInstance();

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      dob: "",
      phone: "",
      gender: "male",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      first_name: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Required"),
      last_name: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      phone: Yup.string().required("Required"),
      dob: Yup.date().required("Required"),
      password: Yup.string()
        .min(6, "Must be 6 characters or more")
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: (values) => {
      setLoading(true);
      instance
        .post("/register", values)
        .then((response) => {
          toast.success("Account created successfully");
          setLoading(false);
          navigate("/login");
        })
    },
  });
  return (
    <div>
      <Toaster />
      <div className="title my-[4vh] mt-[2vh] text-center sm:text-left">
        <span className="text-2xl text-[#12B536] sm:ml-10">
          <span className="text-[#2F4AD6]">Health</span>Connect
        </span>
        <h1 className="text-2xl mt-[2vh] text-center font-semibold text-[#404660]">
          Sign Up
        </h1>
        <p className="text-center text-[#40466088] mt-[4vh] sm:mt-0">
          Welcome to HealthConnect. Create an account to continue
        </p>
      </div>
      <form
        id="form"
        className="block mx-6 sm:mx-0 sm:flex gap-[14vw] justify-center text-[#404660]"
        onSubmit={formik.handleSubmit}
      >
        <div className="flex flex-col">
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            className="input-field"
            onChange={formik.handleChange}
            value={formik.values.first_name}
            placeholder="First Name"
          />
            {formik.touched.first_name && formik.errors.first_name ? (
            <div className="text-red-600 mt-[-8px]">{formik.errors.first_name}</div>
          ) : null}

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="input-field"
            onChange={formik.handleChange}
            value={formik.values.email}
            placeholder="email@example.com"
          />
                      {formik.touched.email && formik.errors.email ? (
            <div className="text-red-600 mt-[-8px]">{formik.errors.email}</div>
          ) : null}
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            className="input-field"
            placeholder="0788888888"
            onChange={formik.handleChange}
            value={formik.values.phone}
          />
                      {formik.touched.phone && formik.errors.phone ? (
            <div className="text-red-600 mt-[-8px]">{formik.errors.phone}</div>
          ) : null}
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="input-field"
            onChange={formik.handleChange}
            value={formik.values.password}
            placeholder="●●●●●●●●"
          />
                      {formik.touched.password && formik.errors.password ? (
            <div className="text-red-600 mt-[-8px]">{formik.errors.password}</div>
          ) : null}
        </div>
        <div className="flex flex-col">
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            className="input-field"
            onChange={formik.handleChange}
            value={formik.values.last_name}
            placeholder="Last Name"
          />
                      {formik.touched.last_name && formik.errors.last_name ? (
            <div className="text-red-600 mt-[-8px]">{formik.errors.last_name}</div>
          ) : null}
          <label htmlFor="dob">Date of Birth</label>
          <input
            type="date"
            name="dob"
            id="dob"
            className="input-field"
            onChange={formik.handleChange}
            value={formik.values.dob}
          />
                      {formik.touched.dob && formik.errors.dob ? (
            <div className="text-red-600 mt-[-8px]">{formik.errors.dob}</div>
          ) : null}

          <label htmlFor="gender">Gender</label>
          <select name="gender" id="gender" className="input-field" onChange={formik.handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {formik.touched.gender && formik.errors.gender ? (
            <div className="text-red-600 mt-[-8px]">{formik.errors.gender}</div>
          ) : null}
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="input-field"
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
            placeholder="●●●●●●●●"
          />
                      {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className="text-red-600 mt-[-8px]">{formik.errors.confirmPassword}</div>
          ) : null}
        </div>
      </form>
      <div className="terms text-center mt-[3vh]">
        <input required type="checkbox" name="agree" id="agree" className="" /> I
        agree to the{" "}
        <a className="text-[#2F4AD6]" href="/terms">
          Terms and Conditions.
        </a>
      </div>
      <button
        className="bg-[#2F4AD6] w-1/2 hover:bg-blue-900 transition duration-300 text-white font-semibold py-2 px-4 rounded rounded-md mx-auto block mt-[2vh] mb-[3vh]"
        type="submit"
        form="form"
      >
        {loading ? <AiOutlineLoading3Quarters className="animate-spin text-2xl mx-auto" /> : "Sign Up"}
      </button>
      <p className="text-center">
        Already have an account?{" "}
        <Link className="text-[#2F4AD6]" to="/login">
          Sign In
        </Link>
      </p>
    </div>
  );
}
