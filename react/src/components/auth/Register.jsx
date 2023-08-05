import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { request } from "../../utils/axios-utils";
import { InputField } from "./InputField";

const Register = () => {
  const [errors, setErrors] = useState("");
  const { register, handleSubmit } = useForm();

  const navigate = useNavigate();

  const { mutate: signup } = useMutation(
    (user) => {
      return request({ url: "/api/auth/register", method: "post", data: user });
    },
    {
      onSuccess: (data) => {
        if (data?.response?.status === 400) {
          setErrors(data.response.data);
        } else if (data?.status === 200) {
          localStorage.setItem("user", JSON.stringify(data.data));
          alert("User Seccessfuly Registered");
          navigate("/skills");
        }
      },
    }
  );

  const onSubmit = (data) => {
    let formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("password_confirmation", data.password_confirmation);
    formData.append("profile_image", data.profile_image[0]);

    signup(formData);
  };

  return (
    <div>
      <div>
        <div
          style={{ height: "calc(100vh - 88px)" }}
          className="flex flex-col items-center pt-6 sm:justify-center sm:pt-0 bg-gray-50"
        >
          <div>
            <h3 className="text-4xl font-bold text-purple-600 tracking-wider">
              Register
            </h3>
          </div>
          <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-md sm:rounded-lg">
            <form onSubmit={handleSubmit(onSubmit)}>
              <InputField {...register("name")} name="name" type="text" />
              <div className="text-red-600 text-xs -mt-4 mb-5">
                {errors.name}
              </div>
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
              <InputField
                {...register("password_confirmation")}
                name="password_confirmation"
                type="password"
              />
              <div className="text-red-600 text-xs -mt-4 mb-5">
                {errors.password_confirmation}
              </div>

              <InputField
                {...register("profile_image")}
                name="profile_image"
                type="file"
              />
              <div className="text-red-600 text-xs -mt-4 mb-5">
                {errors.profile_image}
              </div>

              <div className="flex items-center justify-end mt-4">
                <Link
                  className="text-sm text-gray-600 underline hover:text-gray-900"
                  to="/login"
                >
                  Already registered?
                </Link>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 ml-4 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-gray-900 border border-transparent rounded-md active:bg-gray-900 false"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
