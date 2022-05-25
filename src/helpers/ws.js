import config from "../config";

export const socket = new WebSocket(config.SOCKET_URL)