import io from "socket.io-client";
import welcome from "./events/welcome";

const socket = io();

welcome({ socket });
