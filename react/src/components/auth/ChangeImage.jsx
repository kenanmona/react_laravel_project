import React, { useState } from "react";
import { InputField } from "./InputField";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { request } from "../../utils/axios-utils";

const ChangeImage = ({ userData, statePopup, refetch }) => {
  const [errors, setErrors] = useState("");
  const { register, handleSubmit } = useForm();

  const { mutate: changeImage } = useMutation({
    mutationFn: (image) => {
      return request({
        url: `/api/change-image`,
        method: "post",
        data: image,
      });
    },
    onSuccess: (data) => {
      if (data?.response?.status === 422) {
        setErrors(data.response.data);
      } else if (data?.status === 200) {
        setErrors("");
        statePopup(false);
        refetch();
      }
    },
  });

  const handleChangeImage = (data) => {
    let formData = new FormData();
    formData.append("profile_image", data.profile_image[0]);
    changeImage(formData);
  };

  return (
    <>
      <div className="fixed z-0 bg-black w-screen h-screen left-0 top-0 opacity-30"></div>
      <form
        onSubmit={handleSubmit(handleChangeImage)}
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
          <InputField
            {...register("profile_image")}
            name="profile_image"
            type="file"
          />
          <div className="text-red-600 text-xs -mt-4 mb-5">
            {errors.profile_image}
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

export default ChangeImage;
