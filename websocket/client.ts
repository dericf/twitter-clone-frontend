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
      let data: WSMessage<any> = null;
      try {
        data = JSON.parse(e.data);
      } catch (error) {
        data = e.data;
      }
      try {
        //try and parse the body...
        data.body = JSON.parse(data.body);
      } catch (error) {
        // console.log("Error; can't parse");
      }

      if (process.env.NODE_ENV == "development") {
        // console.log("Got a new websocket message. It was: ");
        // console.log(data);
      }
      // Forward the message (this is probably the wrong way)
      this.mittRef.emit(data.action, data);
    };

    this.socketRef.onerror = (e: ErrorEvent) => {
      // console.log(e.message);
    };

    this.socketRef.onclose = () => {
      // console.log("WebSocket closed let's reopen");
      this.connect(this.userId, this.mittRef);
    };
  };

  state = () => this.socketRef.readyState;

  isAlreadyConnected = (): boolean => {
    if (!this.socketRef) return false;
    return this.socketRef.readyState === this.socketRef.OPEN;
  };

  waitForSocketConnection = (callback) => {
    const socket = this.socketRef;
    const recursion = this.waitForSocketConnection;
    setTimeout(() => {
      if (socket.readyState === 1) {
        // console.log("Connection is made");
        if (callback != null) {
          callback();
        }
        return;
      } else {
        // console.log("wait for connection...");
        recursion(callback);
      }
    }, 1);
  };
}

export default WebSocketClient.getInstance();
