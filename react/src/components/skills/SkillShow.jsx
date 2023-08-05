import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { request } from "../../utils/axios-utils";

const SkillShow = () => {
  let { id } = useParams();
  const { data } = useQuery("skill", () => {
    return request({ url: `/api/skills/${id}` });
  });
  return (
    <div className="mx-auto text-center py-3">
      <div className="mb-3 font-bold">Name: {data?.data?.name}</div>
      <div className=" font-bold">Slug: {data?.data?.slug}</div>
    </div>
  );
};
export default SkillShow;
