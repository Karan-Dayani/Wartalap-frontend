import { io } from "socket.io-client";
import { host } from "./app/api/apiRoutes";

const socket = io(host);

export default socket;
