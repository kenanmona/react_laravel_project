/* import { useRecoilValue } from "recoil";
import { tokenValue } from "../App";
import { useEffect, useState } from "react";
import { request } from "../utils/axios-utils"; */

const Home = ({ notifications }) => {
  return (
    <div className="break-words">
      {notifications &&
        notifications?.map((note) => {
          return (
            <div key={note.id} className="leading-loose">
              {note.id} {" => "} {note.message}
            </div>
          );
        })}
    </div>
  );
};

export default Home;
