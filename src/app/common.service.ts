import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Subject } from 'rxjs';
import { child, get, getDatabase, push, update } from 'firebase/database';
import { ref, set } from 'firebase/database';
import { AuthService } from './authentication/auth.service';
import { onValue } from 'firebase/database';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  principle: Subject<any> = new Subject<any>();
  player: Subject<any> = new Subject<any>();
  currStatus: Subject<any> = new Subject<any>();
  save: Subject<any> = new Subject<any>();
  dead: Subject<any> = new Subject<any>();
  starCountRef:any = ''
  startGame = 0;
  config = {
    headers: {
      'Content-Type': 'application/JSON',
    },
  };
  database = getDatabase(this.authServise.app);
  public pageName: BehaviorSubject<string> = new BehaviorSubject<string>('');
  constructor(private authServise: AuthService) {}
  async getRequest(data: any, url: string) {
    try {
      console.log(data);
      let res = await axios.get('http://localhost:3000/' + url, this.config);
      if (res.status == 200) {
        console.log(res.data);
        return { data: res.data, code: 200 };
      }
      if (res.status == 201) {
        console.log(res.data);
        return { data: res.data, code: 201 };
      }
    } catch (error: any) {
      console.log(error);
      return error;
    }
  }

  async postRequest(data: any, url: string) {
    try {
      console.log(data);
      let res = await axios.post(
        'http://localhost:3000/' + url,
        data,
        this.config
      );
      if (res.status == 200) {
        console.log(res.data);
        return { data: res.data, code: 200 };
      }
      if (res.status == 201) {
        console.log(res.data);
        return { data: res.data, code: 201 };
      }
    } catch (error: any) {
      console.log(error);
      return error;
    }
  }

  async createModGame(uid: any, gameCode: any) {
    const db = getDatabase();
    set(ref(db, 'modgame/' + gameCode), {
      uid: uid,
      gameCode: gameCode,
      player: [],
      gameStart: 0,
    });
  }

  async createPlayerGame(uid: any, gameCode: any) {
    const db = getDatabase();
    set(ref(db, 'playergame/' + gameCode), {
      uid: uid,
      gameCode: gameCode,
      players: [],
      gameStart: 0,
      currStatus : 'nothing',
      save : '',
      dead:''
    });
  }

  async getGame() {
    const db = getDatabase();
    console.log(sessionStorage.getItem('gameCode'));
    this.starCountRef = ref(
      db,
      'modgame/' + sessionStorage.getItem('gameCode')
    );
    onValue(this.starCountRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      if (data.uid == sessionStorage.getItem('uId')) {
        sessionStorage.setItem('isMod', 'true');
        this.player.next(data.players);
        this.currStatus.next(data.currStatus);
        this.save.next(data.save);
        this.dead.next(data.dead);
        this.startGame = data.gameStart;
      } else {
        sessionStorage.setItem('isMod', 'false');
        this.player.next(data.players);
        console.log(data.currStatus);
        this.currStatus.next(data.currStatus);
        this.save.next(data.save);
        this.dead.next(data.dead);
        this.startGame = data.gameStart;
      }
    });
  }

  async joinGame() {
    const db = getDatabase();
    console.log(sessionStorage.getItem('gameCode'));
    try {
      let dbRef = ref(
        db,
        'modgame/' + sessionStorage.getItem('gameCode') + '/players'
      );
      let newRef = push(dbRef);
      set(newRef, {
        uid: sessionStorage.getItem('uId'),
        key: newRef.key,
        status: 'In'
      });
      dbRef = ref(
        db,
        'playergame/' + sessionStorage.getItem('gameCode') + '/players'
      );
      newRef = push(dbRef);
      set(newRef, {
        uid: sessionStorage.getItem('uId'),
        key: newRef.key,
        status : 'In'
      });
    } catch (error) {
      console.log(error);
    }
  }

  async gameStart(players : any) {
    const db = getDatabase();
    debugger
    try {
      update(ref(db, 'playergame/' + sessionStorage.getItem('gameCode')), {
        gameStart: 1,
      });
      update(ref(db, 'modgame/' + sessionStorage.getItem('gameCode')), {
        gameStart: 1,
      });
      update(ref(db, 'modgame/' + sessionStorage.getItem('gameCode')), {
        players: players,
      });
      players.map((x:any)=>x.role = '')
      update(ref(db, 'playergame/' + sessionStorage.getItem('gameCode')), {
        players: players,
      });
      update(ref(db, 'playergame/' + sessionStorage.getItem('gameCode')), {
        currStatus: 'whoAmI',
      });
      update(ref(db, 'modgame/' + sessionStorage.getItem('gameCode')), {
        currStatus: 'whoAmI',
      });
    } catch (error) {
      console.log(error);
    }
  }

  async updateStatus(uid:any, status:any){
    const db = getDatabase();
    try{
      update(ref(db, 'playergame/' + sessionStorage.getItem('gameCode')), {
        currStatus: status,
      });
      update(ref(db, 'modgame/' + sessionStorage.getItem('gameCode')), {
        currStatus: status,
      });
    } catch(error){
      console.log(error);
    }
  }

  async updatePlayer(players:any){
    const db = getDatabase();
    try{
      update(ref(db, 'modgame/' + sessionStorage.getItem('gameCode')), {
        players: players,
      });
      players.map((x:any)=>x.role = '')
      update(ref(db, 'playergame/' + sessionStorage.getItem('gameCode')), {
        players: players,
      });
    } catch(error){
      console.log(error);
    }
  }

  async savePlayer(i:any){
    const db = getDatabase();
    try{
      update(ref(db, 'modgame/' + sessionStorage.getItem('gameCode')), {
        save: i,
      });
      update(ref(db, 'playergame/' + sessionStorage.getItem('gameCode')), {
        save: i,
      });
    } catch(error){
      console.log(error);
    }
  }

  detachListner(){
    this.starCountRef.off();
  }

  async updateUserGameHistory(){

  }

  async deadPlayer(i:any){
    const db = getDatabase();
    try{
      update(ref(db, 'modgame/' + sessionStorage.getItem('gameCode')), {
        dead: i,
      });
      update(ref(db, 'playergame/' + sessionStorage.getItem('gameCode')), {
        dead: i,
      });
    } catch(error){
      console.log(error);
    }
  }
}
