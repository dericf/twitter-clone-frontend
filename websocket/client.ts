import { MittEmitter } from "next/dist/next-server/lib/mitt";
import { WSMessage } from "../schema/WebSockets";

class WebSocketClient {
  static instance: WebSocketClient = null;
  socketRef: WebSocket = null;
  userId: number = null;
  mittRef: MittEmitter = null;
  callbacks = {};

  static getInstance() {
    if (!WebSocketClient.instance)
      WebSocketClient.instance = new WebSocketClient();
    return WebSocketClient.instance;
  }

  constructor() {
    this.socketRef = null;
  }

  addCallbacks = (...callbacks) => (this.callbacks = { ...callbacks });

  connect = (userId: number, mitt: MittEmitter) => {
    this.userId = userId;
    this.mittRef = mitt;
    if (!userId) return;
    const path = `${process.env.NEXT_PUBLIC_API_WS_URL}/${userId}`;
    this.socketRef = new WebSocket(path);
    this.socketRef.onopen = () => {
      console.log("WebSocket open");
    };

    this.socketRef.onmessage = (e: MessageEvent) => {
      // this.socketNewMessage(e.data);
      console.log("Got a new message. It was: ");

      const data: WSMessage<any> =
        e.data && typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      console.log(data);
      this.mittRef.emit(data.action, data);
    };

    this.socketRef.onerror = (e: ErrorEvent) => {
      console.log(e.message);
    };

    this.socketRef.onclose = () => {
      console.log("WebSocket closed let's reopen");
      this.connect(this.userId, this.mittRef);
    };
  };

  state = () => this.socketRef.readyState;

  waitForSocketConnection = (callback) => {
    const socket = this.socketRef;
    const recursion = this.waitForSocketConnection;
    setTimeout(() => {
      if (socket.readyState === 1) {
        console.log("Connection is made");
        if (callback != null) {
          callback();
        }
        return;
      } else {
        console.log("wait for connection...");
        recursion(callback);
      }
    }, 1);
  };
}

export default WebSocketClient.getInstance();
