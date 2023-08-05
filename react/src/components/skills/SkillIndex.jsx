import { useMutation, useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { request } from "../../utils/axios-utils";
import { useRecoilState } from "recoil";
import { tokenValue } from "../../App";

const SkillIndex = () => {
  const [, setToken] = useRecoilState(tokenValue);
  const navigate = useNavigate();

  const { isLoading, data, refetch } = useQuery(
    "skills",
    async () => {
      return request({ url: "/api/skills" });
    },
    {
      onSuccess: (res) => {
        if (res.status === 200) {
          setToken(true);
        } else {
          setToken(false);
        }
      },
    }
  );

  const { mutate: deleteSkill } = useMutation({
    mutationFn: (ide) => {
      return request({
        url: `/api/skills/${ide}`,
        method: "delete",
      });
    },
    onSuccess: () => {
      refetch();
    },
  });

  if (isLoading) {
    return <h2>Loading ....</h2>;
  }
  // console.log(data);

  return (
    <div className="mt-12">
      <div className="flex justify-end m-2 p-2">
        {(JSON.parse(localStorage.getItem("user")).user.roles[0] === "admin" ||
          JSON.parse(localStorage.getItem("user")).user.email ===
            "kenanmona90@gmail.com") && (
          <Link
            to="/skills/create"
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-700 text-white rounded-md"
          >
            New Skill
          </Link>
        )}
      </div>
      <div className="overflow-x-auto relative" bis_skin_checked="1">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                Name
              </th>
              <th scope="col" className="py-3 px-6">
                Slug
              </th>
              <th scope="col" className="py-3 px-6"></th>
            </tr>
          </thead>
          <tbody>
            {data?.data.length > 0 ? (
              data?.data?.map((skill) => {
                return (
                  <tr
                    key={skill.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td
                      className="py-4 px-6 cursor-pointer"
                      onClick={() => navigate(`/skills/${skill.id}`)}
                    >
                      {skill.name}
                    </td>
                    <td className="py-4 px-6">{skill.slug}</td>

                    <td className="py-4 px-6">
                      {(JSON.parse(localStorage.getItem("user")).user
                        .roles[0] === "admin" ||
                        JSON.parse(localStorage.getItem("user")).user.email ===
                          "kenanmona90@gmail.com") && (
                        <>
                          <Link
                            to={`/skills/${skill.id}/edit`}
                            className="mr-1 px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded-md"
                          >
                            Edit
                          </Link>
                          <Link
                            to={``}
                            className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded-md"
                            onClick={() => deleteSkill(skill.id)}
                          >
                            Delete
                          </Link>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="3">
                  <p className="text-2xl font-bold text-center mt-10 text-red-600 tracking-wider">
                    There Are No Skills
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SkillIndex;
