import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { request } from "../../utils/axios-utils";
import { InputField } from "./InputField";

const Login = () => {
  const [errors, setErrors] = useState("");
  const [error401, setErrors401] = useState("");
  const { register, handleSubmit } = useForm();

  const navigate = useNavigate();

  const { mutate: login } = useMutation(
    (user) => {
      return request({ url: "/api/auth/login", method: "post", data: user });
    },
    {
      onSuccess: (data) => {
        if (data?.response?.status === 422) {
          setErrors401("");
          setErrors(data.response.data);
        } else if (data?.response?.status === 401) {
          setErrors("");
          setErrors401(data?.response?.data?.error);
        } else if (data?.status === 200) {
          setErrors401("");
          setErrors("");
          alert("User Seccessfuly Login");
          localStorage.setItem("user", JSON.stringify(data.data));
          navigate("/skills");
        }
      },
    }
  );

  const onSubmit = (data) => {
    login(data);
  };

  return (
    <div>
      <div>
        <div
          style={{ height: "calc(100vh - 88px)" }}
          className={`flex flex-col items-center pt-6 sm:justify-center sm:pt-0 bg-gray-50`}
        >
          <div>
            <h3 className="text-4xl text-center font-bold text-purple-600 tracking-wider">
              LogIn
            </h3>
            <div className="mt-4 text-center text-red-600 text-2xl font-bold tracking-wider">
              {error401}
            </div>
          </div>
          <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-md sm:rounded-lg">
            <form onSubmit={handleSubmit(onSubmit)}>
              <InputField {...register("email")} name="email" type="email" />
              <div className="text-red-600 text-xs -mt-4 mb-5">
                {errors.email}
              </div>
              <InputField
                {...register("password")}
                name="password"
                type="password"
              />
              <div className="text-red-600 text-xs -mt-4 mb-5">
                {errors.password}
              </div>

              <div className="flex items-center justify-end mt-4">
                <Link
                  className="text-sm text-gray-600 underline hover:text-gray-900"
                  to="/register"
                >
                  Don't Have an Account?
                </Link>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 ml-4 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-gray-900 border border-transparent rounded-md active:bg-gray-900 false"
                >
                  login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
