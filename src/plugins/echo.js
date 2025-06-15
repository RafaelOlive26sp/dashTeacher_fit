import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "pusher",
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  wsHost: import.meta.env.VITE_PUSHER_APP_HOST,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  wsPort: import.meta.env.VITE_PUSHER_APP_PORT,
  wssPort: import.meta.env.VITE_PUSHER_APP_PORT_SSL,
  forceTLS: import.meta.env.VITE_PUSHER_USE_TLS,
  encrypted: true,
  disableStats: true,
  authEndpoint: "/broadcasting/auth",
  auth: {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
});
export default echo;