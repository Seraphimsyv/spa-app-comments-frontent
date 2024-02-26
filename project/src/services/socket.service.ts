import { io, Socket } from 'socket.io-client';

export class SocketService {
  constructor(uri: string) {
    this.socket = io(uri);
    this.subscribers = {};
  }

  private subscribers: Record<string, any[]>;

  private socket: Socket;

  async isConnect(): Promise<boolean> {
    return this.socket.connected;
  }

  async listen(event: string, callback: any): Promise<void> {
    this.socket.on(event, callback);

    if (Object.keys(this.subscribers).includes(event)) {
      for (const cb in this.subscribers[event]) {
        this.subscribers[event][cb]();
      }
    }
  }

  async subscribe(event: string, callback: Function): Promise<void> {
    if (Object.keys(this.subscribers).includes(event)) {
      this.subscribers[event].push(callback);
    } else {
      this.subscribers[event] = [callback];
    }
  }

  async emit(event: string, args: any | any[]): Promise<void> {
    this.socket.emit(event, args)
  }
}