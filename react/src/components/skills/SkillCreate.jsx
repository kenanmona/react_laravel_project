import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { request } from "../../utils/axios-utils";
import { InputField } from "../auth/InputField";

const SkillCreate = () => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");

  const { register, handleSubmit } = useForm();

  const navigate = useNavigate();

  const { mutate: addSkill } = useMutation(
    (skill) => {
      return request({ url: "/api/skills", method: "post", data: skill });
    },
    {
      onSuccess: (data) => {
        if (data?.response?.status === 422) {
          setError(data.response.data.errors);
        } else if (data?.status === 200) {
          navigate("/skills");
        }
      },
    }
  );

  const handleAddSkillData = (data) => {
    addSkill(data);
  };

  return (
    <div className="mt-12">
      <form
        onSubmit={handleSubmit(handleAddSkillData)}
        className="max-w-md mx-auto p-4 bg-white shadow-md rounded-sm"
      >
        <div className="space-y-6">
          <div className="mb-4">
            <InputField {...register("name")} name="name" type="text" />
            <div className="text-red-600 text-xs -mt-4 mb-5">{error.name}</div>
          </div>
          <div className="mb-4">
            <InputField {...register("slug")} name="slug" type="text" />
            <div className="text-red-600 text-xs -mt-4 mb-5">{error.slug}</div>
          </div>
        </div>
        <div className="my-4">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-700 text-white rounded-md"
          >
            Store
          </button>
        </div>
      </form>
    </div>
  );
};

export default SkillCreate;
