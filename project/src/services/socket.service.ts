import { io, Socket } from 'socket.io-client';

export class SocketService {
  constructor(uri: string) {
    this.socket = io(uri);
  }

  private socket: Socket;

  async isConnect(): Promise<boolean> {
    return this.socket.connected;
  }

  async listen(event: string, callback: any): Promise<void> {
    this.socket.on(event, callback);
  }

  async emit(event: string, args: any | any[]): Promise<void> {
    this.socket.emit(event, args)
  }
}