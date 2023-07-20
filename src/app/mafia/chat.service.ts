import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { WebSocketChat } from './web-socket-chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  socket!: Socket;

  constructor() { }

  connect(): void {
    this.socket = io('https://mafia-backend.onrender.com/');
    
  }

  sendMessage(message: any): void {
    this.socket.emit('chat-message', message);
  }

  onMessage(): Observable<string> {
    return new Observable<string>(observer => {
      this.socket.on('chat-message', (message: any) => {
        observer.next(message);
      });
    });
  }
}
