import {PlayerState, PlayerStateUpdate} from './types';

const API_PORT = 8000;
let connection: LiveConnection | null = null;

const getSubscriptionUrl = ():
    string => {
      // @ts-ignore
      if (process.env.NODE_ENV === 'development')
        return `ws://localhost:${API_PORT}/api/subscribe`;
      let url = 'ws:';
      const location = window.location;
      if (location.protocol === 'https:') url = 'wss:';
      url += `//${location.host}:${API_PORT}/api/subscribe`;
      return url;
    }

const websocketsSupported = (): boolean => {
  return 'WebSocket' in window || 'MozWebSocket' in window;
};

type PromisePair = {
  resolve: (val: object) => void; reject: () => void;
};

export class LiveConnection {
  updateCb: (update: PlayerStateUpdate) => void;
  refreshCb: (refresh: PlayerState) => void;
  socket?: WebSocket;
  connectionRetries: number;
  inFlightRequests: Map<number, PromisePair>;
  requestNumber: number;
  poller?: NodeJS.Timeout;

  private constructor(
      updateCb: (update: PlayerStateUpdate) => void,
      refreshCb: (refresh: PlayerState) => void
  ) {
    if (connection) {
      throw Error('Duplicate connection created');
    }

    this.refreshCb = refreshCb;
    this.updateCb = updateCb;
    this.connectionRetries = 0;
    this.inFlightRequests = new Map<number, PromisePair>();
    this.requestNumber = 0;

    if (websocketsSupported()) {
      this.setupSocket();
    } else {
      this.startPolling();
    }
  }

  public static getOrCreate(
    updateCb: (update: PlayerStateUpdate) => void,
    refreshCb: (refresh: PlayerState) => void
  ): LiveConnection {
    if (connection) {
      return connection;
    }
    connection = new LiveConnection(updateCb, refreshCb);
    return connection;
  }

  async sendRequest(req: object, endpoint: string): Promise<object> {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
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
    } else {
      const response = await fetch(
          `${window.location.pathname}:${API_PORT}/api/${endpoint}`, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(req)
          });
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
    this.socket.onopen = () => this.connectionRetries = 0;
    this.socket.onmessage = (event: any) =>
        this.processMessage(JSON.parse(event.data));
  }

  private retrySocket() {
    // cancel all in-flight requests
    this.inFlightRequests.forEach((val: PromisePair, key: number, _) => {
      val.reject();
    });
    this.inFlightRequests.clear();

    // perform retry
    this.connectionRetries += 1;
    if (this.connectionRetries > 2) {
      console.log('Hit retry limit, falling back to polling');
      this.startPolling();
      this.socket = undefined;
    } else {
      console.log('Socket connection failed, retrying');
      this.setupSocket();
    }
  }

  private startPolling() {
    if (!this.poller) {
      this.poller = setTimeout(() => this.onPoll(), 5000);
    }
  }

  private async onPoll() {
    this.poller = undefined;
    try {
      const status = this.sendRequest({}, 'poll_status');
      this.handleUpdateMessage(status);
    } finally {
      this.startPolling();
    }
  }

  private handleUpdateMessage(message: any): boolean {
    let handled = false;
    if ('update' in message) {
      const update = message['update'] as PlayerStateUpdate;
      this.updateCb(update);
      handled = true;
    }
    if ('refresh' in message) {
      const refresh = message['refresh'] as PlayerState;
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
      } else {
        if (!this.handleUpdateMessage(payload)) {
          throw Error(`Received message for unknown request id: ${reqId}`);
        }
      }
    } catch (err) {
      console.log(`Got bad message. Error: ${err}. Message: ${data}`);
    }
  }
}
