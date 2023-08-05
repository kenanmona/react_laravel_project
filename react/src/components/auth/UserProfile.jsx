import React, { useState } from "react";
import { useQuery } from "react-query";
import { request } from "../../utils/axios-utils";
import UpdateUserForm from "./UpdateUserForm";
import ChangePassword from "./ChangePassword";
import ChangeImage from "./ChangeImage";

const UserProfile = () => {
  const [popupProfile, setPopupProfile] = useState(false);
  const [popupPassword, setPopupPassword] = useState(false);
  const [popupImage, setPopupImage] = useState(false);

  const { data, refetch } = useQuery("user-profile", () => {
    return request({ url: "/api/auth/user-profile" });
  });

  return (
    <div
      style={{ borderWidth: "1px" }}
      className="max-w-2xl mx-auto py-4  border-solid border-slate-300"
    >
      <h1 className="text-5xl mb-10 text-center">Your Profile</h1>
      <div className="mx-3 font-bold relative">
        <div className="text-center mb-6">
          <img
            className="w-24 h-24 p-1 mx-auto mb-2 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
            src={`${data?.data?.profile_image}`}
            alt=""
          />
          <button
            onClick={() => setPopupImage(true)}
            className="px-4 py-2 mx-auto bg-indigo-500 hover:bg-indigo-700 text-white rounded-md"
          >
            Edit Your Image
          </button>
        </div>

        <div className="">Your Name: {data?.data?.name}</div>
        <div className="mb-5">Your Email: {data?.data?.email}</div>
        <button
          onClick={() => setPopupProfile(true)}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-700 text-white rounded-md"
        >
          Edit Profile
        </button>
        <button
          onClick={() => setPopupPassword(true)}
          className="px-4 py-2 ml-5 bg-indigo-500 hover:bg-indigo-700 text-white rounded-md"
        >
          Change Your Password
        </button>
      </div>
      {popupProfile && (
        <UpdateUserForm
          userData={data?.data}
          statePopup={setPopupProfile}
          refetch={refetch}
        />
      )}
      {popupPassword && (
        <ChangePassword
          userData={data?.data}
          statePopup={setPopupPassword}
          refetch={refetch}
        />
      )}
      {popupImage && (
        <ChangeImage
          userData={data?.data}
          statePopup={setPopupImage}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default UserProfile;
