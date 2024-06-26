import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";

const BASE_URL = "http://localhost:5000";

const Register = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState({});

  const handelInput = (e) => {
    setInputData({
      ...inputData,
      [e.target.id]: e.target.value,
    });
  };

  const selectGender = (selectGender) => {
    setInputData((prev) => ({
      ...prev,
      gender: selectGender === inputData.gender ? "" : selectGender,
    }));
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (inputData.password !== inputData.confpassword.toLowerCase()) {
      setLoading(false);
      return toast.error("Password Dosen't match");
    }
    try {
      const register = await axios.post(
        `${BASE_URL}/api/auth/register`,
        inputData
      );
      const data = register.data;
      if (data.success === false) {
        setLoading(false);
        toast.error(data.message);
        console.log(data.message);
      }
      toast.success(data?.message);
      localStorage.setItem("chatapp", JSON.stringify(data));
      setAuthUser(data);
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Card color="transparent" className="max-h-screen" shadow={false}>
      <Typography variant="h4" color="blue-gray">
        Signup
      </Typography>
      <Typography color="gray" className="mt-1 font-normal text-white">
        Nice to meet you! Enter your details to register.
      </Typography>
      <form
        onSubmit={handelSubmit}
        className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
      >
        <div className="mb-1 flex flex-col gap-6">
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Your Full Name
          </Typography>
          <Input
            size="lg"
            placeholder="name"
            id="fullname"
            type="text"
            onChange={handelInput}
            required
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900 bg-white"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Your UserName
          </Typography>
          <Input
            size="lg"
            placeholder="username"
            id="username"
            type="text"
            onChange={handelInput}
            required
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900 bg-white"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Your Email
          </Typography>
          <Input
            size="lg"
            placeholder="name@mail.com"
            id="email"
            type="email"
            required
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900 bg-white"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
            onChange={handelInput}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Password
          </Typography>
          <Input
            id="password"
            required
            type="password"
            size="lg"
            placeholder="********"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900 bg-white"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
            onChange={handelInput}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Confirm Password
          </Typography>
          <Input
            id="confpassword"
            type="text"
            onChange={handelInput}
            size="lg"
            placeholder="********"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900 bg-white"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
        </div>
        <div id="gender" className="flex gap-2">
          {" "}
          <label className="cursor-pointer label flex gap-2">
            {" "}
            <span className="label-text font-semibold text-gray-950">
              male{" "}
            </span>
            <input
              onChange={() => selectGender("male")}
              checked={inputData.gender === "male"}
              type="checkbox"
              className="checkbox checkbox-info"
            />
          </label>
          <label className="cursor-pointer label flex gap-2">
            <span className="label-text font-semibold text-gray-950">
              female
            </span>
            <input
              checked={inputData.gender === "female"}
              onChange={() => selectGender("female")}
              type="checkbox"
              className="checkbox checkbox-info"
            />
          </label>
        </div>
        <Checkbox
          label={
            <Typography
              variant="small"
              color="gray"
              className="flex items-center text-slate-600 font-normal"
            >
              I agree the
              <a
                className="font-medium transition-colors hover:text-gray-900"
              >
                &nbsp;Terms and Conditions
              </a>
            </Typography>
          }
          containerProps={{ className: "-ml-2.5" }}
        />
        <Button className="mt-6" fullWidth type="submit">
          {loading ? "loading.." : "Signup"}
        </Button>
        <Typography color="gray" className="mt-4 text-center font-normal">
          Already have an account?{" "}
          <Link to={"/login"} className="font-medium text-gray-900">
            Login
          </Link>
        </Typography>
      </form>
    </Card>
  );
};

export default Register;
