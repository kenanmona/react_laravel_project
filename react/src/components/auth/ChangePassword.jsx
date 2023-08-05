import React, { useState } from "react";
import { InputField } from "./InputField";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { request } from "../../utils/axios-utils";

const ChangePassword = ({ userData, statePopup, refetch }) => {
  const [errors, setErrors] = useState("");
  const { register, handleSubmit } = useForm();

  const { mutate: changePassword } = useMutation({
    mutationFn: (password) => {
      return request({
        url: `/api/change-password`,
        method: "post",
        data: password,
      });
    },
    onSuccess: (data) => {
      // console.log(data);
      if (data?.response?.status === 422) {
        setErrors(data.response.data);
      } else if (data?.status === 200) {
        setErrors("");
        statePopup(false);
        refetch();
      }
    },
  });

  const handleChangePassword = (data) => {
    changePassword(data);
  };

  return (
    <>
      <div className="fixed z-0 bg-black w-screen h-screen left-0 top-0 opacity-30"></div>
      {/* <div
        style={{ width: "500px", height: "400px" }}
        className="fixed z-20 m-auto rounded-md p-3 bg-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-md"
      > */}
      <form
        onSubmit={handleSubmit(handleChangePassword)}
        style={{ width: "500px" }}
        className="fixed z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md mx-auto p-4 bg-white shadow-md rounded-md"
      >
        <div
          onClick={() => statePopup(false)}
          className="fixed -top-6 -right-5 bg-red-600 rounded-full px-2 text-white font-bold cursor-pointer"
        >
          X
        </div>
        <div className="space-y-6">
          <div className="mb-4">
            <InputField
              {...register("current_password")}
              name="current_password"
              type="password"
              placeholder="Old Password"
            />
            <div className="text-red-600 text-xs -mt-4 mb-5">
              {errors.current_password}
            </div>
          </div>
          <div className="mb-4">
            <InputField
              {...register("new_password")}
              name="new_password"
              type="password"
              placeholder="New Password"
            />
            <div className="text-red-600 text-xs -mt-4 mb-5">
              {errors.new_password}
            </div>
          </div>
          <div className="mb-4">
            <InputField
              {...register("confirm_password")}
              name="confirm_password"
              type="password"
              placeholder="Confirm Password"
            />
            <div className="text-red-600 text-xs -mt-4 mb-5">
              {errors.confirm_password}
            </div>
          </div>
        </div>
        <div className="my-4">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-700 text-white rounded-md"
          >
            Update
          </button>
        </div>
      </form>
      {/* </div> */}
    </>
  );
};

export default ChangePassword;
