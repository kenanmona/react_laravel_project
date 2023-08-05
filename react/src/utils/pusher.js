import Echo from "laravel-echo";
window.Pusher = require("pusher-js");

window.Echo = new Echo({
  broadcaster: "pusher",
  Key: "833051954bb9155b8814",
  cluster: "ap1",
  forceTLS: true,
});

window.Echo.channel("messages").listen("UserRegistered", (event) => {
  console.log(event);
});

// import Echo from "laravel-echo";
// import Pusher from "pusher-js";

// // window.Pusher = require("pusher-js");
// export const pusher = () => {
//   const tokenLocal = JSON.parse(localStorage.getItem("user"));
//   // window.Pusher = Pusher;

//   const echo = new Echo({
//     broadcaster: "pusher",
//     key: "833051954bb9155b8814",
//     cluster: "ap1",
//     forceTLS: true,
//     authEndpoint: "http://127.0.0.1:8000/broadcasting/auth",
//     auth: {
//       headers: {
//         Authorization: `Bearer ${tokenLocal.access_token}`,
//         Accept: "application/json",
//       },
//     },
//   });

//   echo.channel("messages").listen("UserRegistered", function (event) {
//     console.log("listen to event");
//     console.log(event);
//   });
// };
// /* channelAuthorization: {
//       endpoint: "http://127.0.0.1:8000/broadcasting/auth",
//       headers: {
//         Accept: "application/json",
//         Authorization: `Bearer ${tokenLocal.access_token}`,
//       },
//     }, */
