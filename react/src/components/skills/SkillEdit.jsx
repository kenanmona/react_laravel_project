import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation /* useQueryClient */ } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { request } from "../../utils/axios-utils";
import { InputField } from "../auth/InputField";
import { useRecoilState } from "recoil";
import { tokenValue } from "../../App";

const SkillEdit = () => {
  const [, setToken] = useRecoilState(tokenValue);
  const [errors, setErrors] = useState("");
  let { id } = useParams();
  // const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    const fetchSkill = async () => {
      const res = await request({ url: `/api/skills/${id}` });
      if (res.status === 200) {
        setValue("name", res?.data.name);
        setValue("slug", res?.data.slug);
      } else {
        setToken(false);
        navigate("/login");
      }
    };
    fetchSkill();
  }, [setValue]);

  const { mutate: editSkill } = useMutation({
    mutationFn: (skill) => {
      return request({
        url: `/api/skills/${id}`,
        method: "PUT",
        data: skill,
      });
    },
    /* onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      navigate("/skills");
    }, */
    onSuccess: (data) => {
      if (data?.response?.status === 422) {
        setErrors(data.response.data.errors);
      } else if (data?.status === 200) {
        navigate("/skills");
      }
    },
  });

  const handleEditSkillData = (data) => {
    editSkill(data);
  };

  return (
    <div>
      <div className="mt-12">
        <form
          onSubmit={handleSubmit(handleEditSkillData)}
          className="max-w-md mx-auto p-4 bg-white shadow-md rounded-sm"
        >
          <div className="space-y-6">
            <div className="mb-4">
              <InputField {...register("name")} name="name" type="text" />
              {errors.name}
            </div>
            <div className="mb-4">
              <InputField {...register("slug")} name="slug" type="text" />
              {errors.slug}
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
      </div>
    </div>
  );
};

export default SkillEdit;
