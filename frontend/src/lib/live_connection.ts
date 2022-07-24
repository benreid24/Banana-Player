import {PlayInfo, PlayInfoUpdate} from './types';

const API_PORT = 8000;

const getSubscriptionUrl = (): string => {
  // @ts-ignore
  if (process.env.NODE_ENV === 'development')
    return `ws://localhost:${API_PORT}/api/subscribe`;
  let url = 'ws:';
  const location = window.location;
  if (location.protocol === 'https:')
    url = 'wss:';
  url += `//${location.host}:${API_PORT}/api/subscribe`;
  return url;
}

const websocketsSupported = (): boolean => {
  return 'WebSocket' in window || 'MozWebSocket' in window;
};

type PromisePair = {
  resolve: (val: object) => void;
  reject: () => void;
};

export class LiveConnection {
  updateCb: (update: PlayInfoUpdate) => void;
  refreshCb: (refresh: PlayInfo) => void;
  socket?: WebSocket;
  connectionRetries: number;
  inFlightRequests: Map<number, PromisePair>;
  requestNumber: number;

  constructor(
    updateCb: (update: PlayInfoUpdate) => void,
    refreshCb: (refresh: PlayInfo) => void
  ) {
    this.refreshCb = refreshCb;
    this.updateCb = updateCb;
    this.connectionRetries = 0;
    this.inFlightRequests = new Map<number, PromisePair>();
    this.requestNumber = 0;

    if (websocketsSupported()) {
      this.setupSocket();
    }
    else {
      this.startPolling();
    }
  }

  async sendRequest(req: object, endpoint: string): Promise<object> {
    if (this.socket) {
      const request = {
        requestId: this.requestNumber,
        endpoint: endpoint,
        payload: req
      };
      const promise = new Promise<object>((resolve, reject) => {
        this.inFlightRequests.set(this.requestNumber, {resolve, reject});
      });
      this.requestNumber += 1;
      this.socket.send(JSON.stringify(request));
      return promise;
    }
    else {
      const response = await fetch(
        `${window.location.pathname}:${API_PORT}/api/${endpoint}`,
        {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(req)
        }
      );
      const data = response.ok ? await response.json() : null;
      if (!data) {
        throw Error('Bad response');
      }
      return data;
    }
  }

  private setupSocket() {
    this.socket = new WebSocket(getSubscriptionUrl());
    this.socket.onclose = () => this.retrySocket();
    this.socket.onerror = () => this.retrySocket();
    this.socket.onmessage = (event: any) => this.processMessage(JSON.parse(event.data));
  }

  private retrySocket() {
    // cancel all in-flight requests
    this.inFlightRequests.forEach((val: PromisePair, key: number, _) => {
      val.reject();
    });
    this.inFlightRequests.clear();

    // perform retry
    this.connectionRetries += 1;
    if (this.connectionRetries >= 3) {
      console.log("Hit retry limit, falling back to polling");
      this.startPolling();
      this.socket = undefined;
    }
    else {
      console.log("Socket connection failed, retrying");
      this.setupSocket();
      if (this.socket?.readyState != WebSocket.OPEN && this.socket?.readyState != WebSocket.CONNECTING) {
        console.log("Connection failed, falling back to polling");
        this.startPolling();
      }
    }
  }

  private startPolling() {
    setTimeout(() => this.onPoll(), 500);
  }

  private async onPoll() {
    const status = this.sendRequest({}, 'poll_status');
    this.handleUpdateMessage(status);
    this.startPolling();
  }

  private handleUpdateMessage(message: any): boolean {
    let handled = false;
    if ('update' in message) {
      const update = message['update'] as PlayInfoUpdate;
      this.updateCb(update);
      handled = true;
    }
    if ('refresh' in message) {
      const refresh = message['refresh'] as PlayInfo;
      this.refreshCb(refresh);
      handled = true;
    }
    return handled;
  }

  private processMessage(data: any) {
    try {
      const obj = JSON.parse(data);
      const reqId: number = obj['requestId'];
      const payload = obj['payload'];
      const promise = this.inFlightRequests.get(reqId);
      if (promise) {
        promise.resolve(payload);
      }
      else {
        if (!this.handleUpdateMessage(payload)) {
          throw Error(`Received message for unknown request id: ${reqId}`);
        }
      }
    }
    catch (err) {
      console.log(`Got bad message. Error: ${err}. Message: ${data}`);
    }
  }
}
