import React, { useEffect, useState } from "react";
import { InputField } from "./InputField";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { request } from "../../utils/axios-utils";

const UpdateUserForm = ({ userData, statePopup, refetch }) => {
  const [errors, setErrors] = useState("");
  const [error500, setError500] = useState("");
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    setValue("name", userData?.name);
    setValue("email", userData?.email);
  }, [setValue]);

  const { mutate: editProfile } = useMutation({
    mutationFn: (profile) => {
      return request({
        url: `/api/update-profile/${userData?.id}`,
        method: "post",
        data: profile,
      });
    },

    onSuccess: (data) => {
      if (data?.response?.status === 400) {
        setError500("");
        setErrors(data.response.data);
      } else if (data?.response?.status === 500) {
        setError500("The email has already been taken.");
        setErrors("");
      } else if (data?.status === 200) {
        setErrors("");
        setError500("");
        statePopup(false);
        refetch();
      }
    },
  });

  const handleEditProfile = (data) => {
    editProfile(data);
  };

  return (
    <>
      <div className="fixed z-0 bg-black w-screen h-screen left-0 top-0 opacity-30"></div>
      {/* <div
        style={{ width: "500px", height: "400px" }}
        className="fixed z-20 m-auto rounded-md p-3 bg-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-md"
      > */}
      <form
        onSubmit={handleSubmit(handleEditProfile)}
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
            <InputField {...register("name")} name="name" type="text" />
            <div className="text-red-600 text-xs -mt-4 mb-5">{errors.name}</div>
          </div>
          <div className="mb-4">
            <InputField {...register("email")} name="email" type="text" />
            <div className="text-red-600 text-xs -mt-4 mb-5">
              {errors.email || error500}
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

export default UpdateUserForm;
