import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Subject } from 'rxjs';
import { child, get, getDatabase, push, update } from 'firebase/database';
import { ref, set } from 'firebase/database';
import { AuthService } from './authentication/auth.service';
import { onValue } from 'firebase/database';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  principle: Subject<any> = new Subject<any>();
  player: Subject<any> = new Subject<any>();
  currStatus: Subject<any> = new Subject<any>();
  save: Subject<any> = new Subject<any>();
  dead: Subject<any> = new Subject<any>();
  docChance: Subject<any> = new Subject<any>();
  polChance: Subject<any> = new Subject<any>();
  starCountRef: any = '';
  startGame = 0;
  showHideNavBar: boolean = false;
  config = {
    headers: {
      'Content-Type': 'application/JSON',
    },
  };
  database = getDatabase(this.authServise.app);
  public pageName: BehaviorSubject<string> = new BehaviorSubject<string>('');
  constructor(private authServise: AuthService, private spinner : NgxSpinnerService) {}
  async getRequest(data: any, url: string) {
    this.spinner.show()
    try {
      let res = await axios.get('https://mafia-backend.onrender.com/' + url, this.config);
      if (res.status == 200) {
        this.spinner.hide()
        return { data: res.data, code: 200 };
      }
      if (res.status == 201) {
        this.spinner.hide()
        return { data: res.data, code: 201 };
      }
    } catch (error: any) {
      console.log(error);
      this.spinner.hide()
      return error;
    }
    this.spinner.hide()
  }

  async postRequest(data: any, url: string) {
    this.spinner.show()
    try {
      let res = await axios.post(
        'https://mafia-backend.onrender.com/' + url,
        data,
        this.config
      );
      if (res.status == 200) {
        this.spinner.hide()
        return { data: res.data, code: 200 };
      }
      if (res.status == 201) {
        this.spinner.hide()
        return { data: res.data, code: 201 };
      }
    } catch (error: any) {
      console.log(error);
      this.spinner.hide()
      return error;
    }
    this.spinner.hide()
  }

  async createModGame(uid: any, gameCode: any) {
    const db = getDatabase();
    set(ref(db, 'modgame/' + gameCode), {
      uid: uid,
      gameCode: gameCode,
      player: [],
      gameStart: 0,
      currStatus: 'nothing',
      save: '',
      dead: '',
      round: [],
      docChance: 1,
      polChance :1
    });
  }

  async createPlayerGame(uid: any, gameCode: any) {
    const db = getDatabase();
    set(ref(db, 'playergame/' + gameCode), {
      uid: uid,
      gameCode: gameCode,
      players: [],
      gameStart: 0,
      currStatus: 'nothing',
      save: '',
      dead: '',
      round: [],
      docChance: 1,
      polChance :1
    });
  }

  async getGame() {
    const db = getDatabase();
    this.starCountRef = ref(
      db,
      'modgame/' + sessionStorage.getItem('gameCode')
    );
    await onValue(this.starCountRef, async (snapshot) => {
      const data = snapshot.val();
      if (data.uid == sessionStorage.getItem('uId')) {
        sessionStorage.setItem('isMod', 'true');
        this.player.next(data.players);
        this.currStatus.next(data.currStatus);
        this.save.next(data.save);
        this.dead.next(data.dead);
        this.docChance.next(data.docChance);
        this.polChance.next(data.polChance);
        this.startGame = data.gameStart;
      } else {
        sessionStorage.setItem('isMod', 'false');
        this.player.next(data.players);
        this.currStatus.next(data.currStatus);
        this.save.next(data.save);
        this.dead.next(data.dead);
        this.docChance.next(data.docChance);
        this.polChance.next(data.polChance);
        this.startGame = data.gameStart;
      }
    });
  }

  async joinGame() {
    const db = getDatabase();
    try {
      let dbRef = ref(
        db,
        'modgame/' + sessionStorage.getItem('gameCode') + '/players'
      );
      let newRef = push(dbRef);
      set(newRef, {
        uid: sessionStorage.getItem('uId'),
        key: newRef.key,
        status: 'In',
      });
      dbRef = ref(
        db,
        'playergame/' + sessionStorage.getItem('gameCode') + '/players'
      );
      newRef = push(dbRef);
      set(newRef, {
        uid: sessionStorage.getItem('uId'),
        key: newRef.key,
        status: 'In',
      });
    } catch (error) {
      console.log(error);
    }
  }

  async gameStart(players: any) {
    const db = getDatabase();
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
      players.map((x: any) => (x.role = ''));
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

  async updateStatus(uid: any, status: any) {
    const db = getDatabase();
    try {
      update(ref(db, 'playergame/' + sessionStorage.getItem('gameCode')), {
        currStatus: status,
      });
      update(ref(db, 'modgame/' + sessionStorage.getItem('gameCode')), {
        currStatus: status,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async updatePlayer(players: any) {
    const db = getDatabase();
    try {
      update(ref(db, 'modgame/' + sessionStorage.getItem('gameCode')), {
        players: players,
      });
      players.map((x: any) => (x.role = ''));
      update(ref(db, 'playergame/' + sessionStorage.getItem('gameCode')), {
        players: players,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async savePlayer(i: any) {
    const db = getDatabase();
    try {
      update(ref(db, 'modgame/' + sessionStorage.getItem('gameCode')), {
        save: i,
      });
      update(ref(db, 'playergame/' + sessionStorage.getItem('gameCode')), {
        save: i,
      });
    } catch (error) {
      console.log(error);
    }
  }

  detachListner() {
    this.starCountRef.off();
  }

  async updateUserGameHistory() {}

  async deadPlayer(i: any) {
    const db = getDatabase();
    try {
      update(ref(db, 'modgame/' + sessionStorage.getItem('gameCode')), {
        dead: i,
      });
      update(ref(db, 'playergame/' + sessionStorage.getItem('gameCode')), {
        dead: i,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async round(msg: any) {
    const db = getDatabase();
    try {
      let dbRef = ref(
        db,
        'modgame/' + sessionStorage.getItem('gameCode') + '/round'
      );
      let newRef = push(dbRef);
      set(newRef, {
        msg: msg,
        key: newRef.key,
      });
      dbRef = ref(
        db,
        'playergame/' + sessionStorage.getItem('gameCode') + '/round'
      );
      newRef = push(dbRef);
      set(newRef, {
        msg: msg,
        key: newRef.key,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getRoundData() {
    const dbRef = ref(getDatabase());
    const db = getDatabase();
    get(child(dbRef, `modgame/${sessionStorage.getItem('gameCode')}`))
      .then(async (snapshot) => {
        if (snapshot.exists()) {
          let round = { one: '', two: '', three: '', four: '' };
          let i = 0;
          for (var key in snapshot.val().round) {
            if (Object.prototype.hasOwnProperty.call(snapshot.val().round, key)) {
              var val = snapshot.val().round[key];
              if (i == 0) {
                round.one = val.msg;
              } else if (i == 1) {
                round.two = val.msg;
              } else if (i == 2) {
                round.three = val.msg;
              } else if (i == 3) {
                round.four = val.msg;
              }
            }
            i++;
          }
          update(ref(db, 'modgame/' + sessionStorage.getItem('gameCode')), {
            round: [],
          });
          update(ref(db, 'playergame/' + sessionStorage.getItem('gameCode')), {
            round: [],
          });
          let data ={
            round: round,
            gameCode: sessionStorage.getItem('gameCode')
          }
          await this.postRequest(data, 'updateround')
        } else {
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async docChanceUsed() {
    const db = getDatabase();
    try {
      update(ref(db, 'modgame/' + sessionStorage.getItem('gameCode')), {
        docChance: 0,
      });
      update(ref(db, 'playergame/' + sessionStorage.getItem('gameCode')), {
        docChance: 0,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async polChanceUsed() {
    const db = getDatabase();
    try {
      update(ref(db, 'modgame/' + sessionStorage.getItem('gameCode')), {
        polChance: 0,
      });
      update(ref(db, 'playergame/' + sessionStorage.getItem('gameCode')), {
        polChance: 0,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async updateChances() {
    const db = getDatabase();
    try {
      update(ref(db, 'modgame/' + sessionStorage.getItem('gameCode')), {
        docChance: 1,
        polChance: 1
      });
      update(ref(db, 'playergame/' + sessionStorage.getItem('gameCode')), {
        docChance: 1,
        polChance: 1
      });
    } catch (error) {
      console.log(error);
    }
  }
}
