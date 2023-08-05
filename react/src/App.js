import React, { useEffect, useState } from "react";
import { atom, useRecoilState } from "recoil";
import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { Link, Route, Routes, useNavigate } from "react-router-dom";

import Home from "./components/Home";
import SkillCreate from "./components/skills/SkillCreate";
import SkillEdit from "./components/skills/SkillEdit";
import SkillIndex from "./components/skills/SkillIndex";
import SkillShow from "./components/skills/SkillShow";
import { ReactQueryDevtools } from "react-query/devtools";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import axios from "axios";
import { request } from "./utils/axios-utils";
import UserProfile from "./components/auth/UserProfile";
import Pusher from "pusher-js";

export const tokenValue = atom({
  key: "tokenValue",
  default: false,
});

const App = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const [token, setToken] = useRecoilState(tokenValue);

  useEffect(() => {
    if (token) {
      const pusher = new Pusher("833051954bb9155b8814", {
        cluster: "ap1",
      });
      const channel = pusher.subscribe("messages");

      channel.bind("App\\Events\\UserRegistered", (event) => {
        setNotifications((notifications) => {
          return [...notifications, event.message];
        });
      });
    }
  }, [token, setNotifications]);

  useEffect(() => {
    request({ url: "/api/notifications" }).then((data) => {
      setNotifications([...data?.data]);
    });
  }, [setNotifications]);

  useEffect(() => {
    const fetch = async () => {
      const url = "http://127.0.0.1:8000/api/me";
      const token = JSON.parse(localStorage.getItem("user"));
      if (!token) {
        console.log("Token not found");
        navigate("/login");
      } else {
        await axios
          .get(url, {
            headers: {
              Authorization: `Bearer ${token.access_token}`,
            },
          })
          .then((res) => {
            console.log("token not expired");
          })
          .catch((err) => {
            localStorage.removeItem("user");
            setToken(false);
            navigate("/login");
          });
      }
    };
    const interval = setInterval(() => {
      fetch();
    }, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, []);

  // useEffect to listen recoil state (token in localStorage)
  useEffect(() => {
    const fetch = async () => {
      const url = "http://127.0.0.1:8000/api/me";
      const tokenLocal = JSON.parse(localStorage.getItem("user"));
      if (!tokenLocal) {
        setToken(false);
        navigate("/login");
      } else {
        await axios
          .get(url, {
            headers: {
              Authorization: `Bearer ${tokenLocal?.access_token}`,
            },
          })
          .then((res) => {
            setToken(true);
          })
          .catch((err) => {
            setToken(false);
            navigate("/login");
          });
      }
    };
    fetch();
  }, [token]);

  // First solution
  /* useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("user");
      if (token) {
        const decodedToken = JSON.parse(token);
        if (decodedToken.expires_in < Date.now() / 1000) {
          console.log(Date.now() / 1000);
          localStorage.removeItem("user");
          navigate("/login");
        }
      } else {
        // localStorage.removeItem("user");
        navigate("/login");
      }
    }, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, []); */

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnmount: false,
        refetchOnReconnect: false,
        retry: 1,
        staleTime: 5 * 1000,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-slate-200">
        <div className="max-w-7xl mx-auto min-h-screen">
          <nav>
            <ul className="flex justify-between">
              {token ? (
                <div className="flex">
                  {JSON.parse(localStorage.getItem("user")).user.roles[0] ===
                    "admin" && (
                    <li className="m-2 p-2 bg-indigo-500 hover:bg-indigo-700 text-white rounded-md">
                      <Link to="/">Home</Link>
                    </li>
                  )}

                  <li className="m-2 p-2 bg-indigo-500 hover:bg-indigo-700 text-white rounded-md">
                    <Link to="/skills">Skills</Link>
                  </li>
                </div>
              ) : (
                <div></div>
              )}
              {!token ? (
                <div>
                  <li className="m-2 p-2 bg-indigo-500 hover:bg-indigo-700 text-white rounded-md">
                    <Link to="/login">Login</Link>
                  </li>
                </div>
              ) : (
                <div className="flex">
                  <li className="m-2 p-2 bg-indigo-500 hover:bg-indigo-700 text-white rounded-md">
                    <Link to="/profile">Profile</Link>
                  </li>
                  <li className="m-2 p-2 bg-indigo-500 hover:bg-indigo-700 text-white rounded-md">
                    <button
                      onClick={() => {
                        request({
                          url: "/api/auth/logout",
                          method: "post",
                        }).then(() => setToken(false));
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </div>
              )}
            </ul>
          </nav>
          <Routes>
            <Route path="/" element={<Home notifications={notifications} />} />
            <Route path="/skills" element={<SkillIndex />} />
            <Route path="/skills/:id" element={<SkillShow />} />
            <Route path="/skills/create" element={<SkillCreate />} />
            <Route path="/skills/:id/edit" element={<SkillEdit />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
};
export default App;

/* 
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      firstName: "kenan",
      lastName: "",
      age: 0,
    },
  });

  register("firstName", {
    validate: () => {},
  });
{/* <div className="max-w-md mx-auto p-4">
      <form
        onSubmit={handleSubmit((data) => {
          console.log(data);
        })}
      >
        <input
          type="text"
          name="firstName"
          {...register("firstName", {
            required: { value: true, message: "This Field Is Required!" },
            minLength: { value: 4, message: "min length 4" },
          })}
          placeholder="First Name"
          className="border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-2"
        />
        {errors?.firstName?.message}
        <input
          type="text"
          {...register("lastName", {
            required: "This Field Is Required!",
            minLength: { value: 4, message: "min length 4" },
          })}
          placeholder="Last Name"
          className="border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-2 my-2"
        />
        {errors?.lastName?.message}
        <input
          type="number"
          {...register("age", { valueAsNumber: true })}
          placeholder="Age"
          className="border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-2 my-2"
        />
        {errors?.age?.message}
        <input
          type="submit"
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-700 text-white rounded-md block"
        />
      </form>
    </div> */

/* //// crud api with laravel

import { QueryClient, QueryClientProvider } from 'react-query';
import { Link, Route, Routes } from 'react-router-dom';

import Home from './components/Home';
import SkillCreate from './components/skills/SkillCreate';
import SkillEdit from './components/skills/SkillEdit';
import SkillIndex from './components/skills/SkillIndex';
import SkillShow from './components/skills/SkillShow';
import { ReactQueryDevtools} from "react-query/devtools"

const queryClient = new QueryClient();

return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-slate-200" >
         <div className='max-w-7xl mx-auto min-h-screen'>
            <nav>
               <ul className='flex'>
                  <li className='m-2 p-2 bg-indigo-500 hover:bg-indigo-700 text-white rounded-md'>
                     <Link to="/">Home</Link>
                  </li>
                  <li className='m-2 p-2 bg-indigo-500 hover:bg-indigo-700 text-white rounded-md'>
                     <Link to="/skills">Skills</Link>
                  </li>
               </ul>
            </nav>
            <Routes>
               <Route path='/' element={<Home />} />
               <Route path='/skills' element={<SkillIndex />} />
               <Route path='/skills/:id' element={<SkillShow />} />
               <Route path='/skills/create' element={<SkillCreate />} />
               <Route path='/skills/:id/edit' element={<SkillEdit />} />
            </Routes>
         </div>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
 );
*/
