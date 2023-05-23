import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  isMod!: boolean;
  players: any = [];
  playerCount = 0;
  gameCode = sessionStorage.getItem('gameCode');
  name = sessionStorage.getItem('displayName');
  role = '';
  mafiaVote = false;
  allVote = false;
  policeChoose = false;
  docSave = false;
  currStatus = '';
  dead!: number;
  save!: number;
  chance = 1;
  gameStarted = false;
  votes: any = null;
  votesKills = null;
  status: any = null;
  constructor(private router: Router, private commonService: CommonService) {
    commonService.pageName.next('game');
  }

  async ngOnInit(): Promise<void> {
    // this.startTimer();
    await this.commonService.getGame();
    this.isMod = JSON.parse(sessionStorage.getItem('isMod') || 'false');
    console.log(this.isMod);
    this.commonService.player.subscribe((x) => {
      if (this.commonService.startGame == 0) {
        this.players = [];
        for (var key in x) {
          if (Object.prototype.hasOwnProperty.call(x, key)) {
            var val = x[key];
            console.log(val);
            this.getPlayerData(val.uid, key, val.status, val.role, val.vote);
            if (val.uid == sessionStorage.getItem('uId')) {
              this.status = val.status;
            }
          }
          this.playerCount++;
        }
      }
      if (
        this.currStatus == 'mafiaVote' ||
        this.currStatus == 'allVote' ||
        this.currStatus == 'policeChoose' ||
        this.currStatus == 'doctorSave'
      ) {
        this.players = x;
        this.gameStarted = true;
        this.players.map((x: any) => {
          if (x.uid == sessionStorage.getItem('uId')) {
            this.status = x.status;
          }
        });
        console.log(this.players);
      }
    });
    this.commonService.save.subscribe((x) => {
      this.save = x;
    });
    this.commonService.dead.subscribe((x) => {
      this.dead = x;
    });
    this.commonService.currStatus.subscribe(async (x) => {
      this.players.map((x: any) => {
        if (x.uid == sessionStorage.getItem('uId')) {
          this.status = x.status;
        }
      });
      this.currStatus = x;
      if (x == 'whoAmI' && !this.isMod) {
        this.chance = 1;
        let res = await this.commonService.postRequest(
          { uid: sessionStorage.getItem('uId'), gameCode: this.gameCode },
          'whoami'
        );
        if (res.code == 200) {
          console.log(res);
          this.role = res.data.role;
          Swal.fire({
            icon: 'success',
            title: 'You are a ' + res.data.role + ' enjoy your game',
            confirmButtonText: 'OK',
          });
        }
        let response = await this.commonService.postRequest(
          {
            uid: sessionStorage.getItem('uId'),
            gameCode: this.gameCode,
            role: this.role,
          },
          'updateusergamehistory'
        );
        console.log(response);
      } else if (x == 'mafiaVote') {
        this.chance = 1;
        this.votes = null;
        this.mafiaVote = true;
        this.allVote = false;
        this.policeChoose = false;
        this.docSave = false;
      } else if (x == 'policeChoose') {
        this.chance = 1;
        this.votesKills = null;
        this.mafiaVote = false;
        this.allVote = false;
        this.policeChoose = true;
        this.docSave = false;
      } else if (x == 'doctorSave') {
        this.chance = 1;
        this.mafiaVote = false;
        this.allVote = false;
        this.policeChoose = false;
        this.docSave = true;
      } else if (x == 'allVote') {
        this.chance = 1;
        this.mafiaVote = false;
        this.allVote = true;
        this.policeChoose = false;
        this.docSave = false;
      } else if ((x as string).includes('udered last night')) {
        this.chance = 1;
        Swal.fire({
          icon: 'success',
          title: x,
        });
      } else if ((x as string).includes('Wins')) {
        let res = await this.commonService.postRequest(
          {
            uid: sessionStorage.getItem('uId'),
            gameCode: this.gameCode,
            role: this.role,
            result: x,
          },
          'updatetesults'
        );
        Swal.fire({
          icon: 'success',
          title: x,
          confirmButtonText: 'Ok',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            sessionStorage.removeItem('gameCode');
            sessionStorage.removeItem('isMod');
            this.commonService.player.unsubscribe();
            this.commonService.save.unsubscribe();
            this.commonService.currStatus.unsubscribe();
            this.router.navigate(['mafia/dashboard']);
          }
        });
      }
    });
    if (sessionStorage.getItem('gameCode')) {
      let res = await this.commonService.postRequest(
        { uid: sessionStorage.getItem('uId'), gameCode: this.gameCode },
        'whoami'
      );
      if (res.code == 200) {
        console.log(res);
        this.role = res.data.role;
      }
    }
  }

  async getPlayerData(uid: any, key: any, status: any, role: any, vote: any) {
    let data = { uid: uid };
    let res = await this.commonService.postRequest(data, 'getplayerdata');
    if (res.code == 200) {
      console.log(res);
      let player = {
        name: res.data.displayName,
        dp: '../../assets/img/' + res.data.photo + '.jpg',
        key: key,
        role: role ? role : '',
        status: status,
        vote: vote ? vote : 0,
        uid: uid,
      };
      this.players.push(player);
      console.log(this.players);
    }
  }

  async startGame() {
    let data = { gameCode: this.gameCode };
    let res = await this.commonService.getRequest(
      data,
      'startGame?gameCode=' + this.gameCode
    );
    if (res.code == 200) {
      let mafiaRes = this.getRandom(4);
      console.log(mafiaRes);
      this.players.map((x: any) => {
        if (x.role == '') {
          x.role = 'Villager';
        }
      });
      console.log(this.players);
      let data1 = {
        gameCode: this.gameCode,
        players: this.players,
      };
      this.gameStarted = true;
      await this.commonService.postRequest(data1, 'gameStarted');
      await this.commonService.gameStart(this.players);
      this.chance = 1;
      await this.commonService.updateStatus(
        sessionStorage.getItem('uId'),
        'mafiaVote'
      );
    }
  }

  getRandom(n: any) {
    var result = new Array(n),
      len = this.players.length,
      taken = new Array(len);
    if (n > len)
      throw new RangeError('getRandom: more elements taken than available');
    while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = this.players[x in taken ? taken[x] : x].key;
      if (n == 1) {
        this.players[x in taken ? taken[x] : x].role = 'Doctor';
      } else if (n == 2) {
        this.players[x in taken ? taken[x] : x].role = 'Police Man';
      } else {
        this.players[x in taken ? taken[x] : x].role = 'Mafia';
      }
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }

  async voteKill(i: any) {
    if (this.votesKills != null) {
      this.players[i].vote = this.players[i].vote + 1;
      this.players[this.votesKills].vote =
        this.players[this.votesKills].vote - 1;
    } else if (this.votesKills == i) {
    } else {
      this.players[i].vote = this.players[i].vote + 1;
    }
    this.votesKills = i;
    await this.commonService.updatePlayer(this.players);
  }

  async vote(i: any) {
    if (this.votes != null) {
      this.players[i].vote = this.players[i].vote + 1;
      this.players[this.votes].vote = this.players[this.votes].vote - 1;
    } else if (this.votes == i) {
    } else {
      this.players[i].vote = this.players[i].vote + 1;
    }
    this.votes = i;
    await this.commonService.updatePlayer(this.players);
  }

  async mafiaDone() {
    let max = 0;
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].vote > max) {
        max = this.players[i].vote;
        this.dead = this.players[i].uid;
      }
      this.players[i].vote = 0;
    }
    this.chance = 1;
    await this.commonService.deadPlayer(this.dead);
    await this.commonService.updatePlayer(this.players);
    this.chance = 1;
    await this.commonService.updateStatus(
      sessionStorage.getItem('uId'),
      'policeChoose'
    );
  }

  async safe(i: any) {
    if (this.chance == 1) {
      this.save = i;
      Swal.fire({
        icon: 'success',
        title: 'Response Recorded',
        confirmButtonText: 'OK',
      });
    }
    await this.commonService.savePlayer(this.players[i].uid);
    this.chance--;
  }

  async isMafia(i: any) {
    if (this.chance == 1) {
      let data = {
        uid: this.players[i].uid,
        gameCode: this.gameCode,
      };
      let res = await this.commonService.postRequest(data, 'ismafia');
      if (res.code == 200) {
        console.log(res);
        if (res.data.role) {
          Swal.fire({
            icon: 'success',
            title: 'You Guessed it Right',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'You Missed The Chance',
          });
        }
      }
      this.chance--;
    }
  }

  async policeDone() {
    this.chance = 1;
    await this.commonService.updateStatus(
      sessionStorage.getItem('uId'),
      'doctorSave'
    );
  }

  async doctorDone() {
    if (this.isMod && this.dead != this.save) {
      let i;
      for (i = 0; i < this.players.length; i++) {
        if (this.players[i].uid == this.dead) {
          break;
        }
      }
      this.players[i].status = 'Out';
      await this.commonService.updatePlayer(this.players);
      this.chance = 1;
      await this.commonService.updateStatus(
        sessionStorage.getItem('uId'),
        this.players[i].name + ' was mudered last night'
      );
    } else if (this.isMod && this.dead == this.save) {
      this.chance = 1;
      await this.commonService.updateStatus(
        sessionStorage.getItem('uId'),
        'No one mudered last night'
      );
    }
    await this.commonService.deadPlayer(null);
    await this.commonService.savePlayer(null);
    this.chance = 1;
    await this.commonService.updateStatus(
      sessionStorage.getItem('uId'),
      'allVote'
    );
  }

  async allDone() {
    debugger
    let players;
    let res = await this.commonService.getRequest(
      {},
      'players?gameCode=' + this.gameCode
    );
    if (res.code == 200) {
      players = res.data.players;
    }
    let max = 0;
    let dead = 0;
    let mafia = 0;
    let others = 0;
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].role = players[i].role;
      if (this.players[i].vote > max) {
        max = this.players[i].vote;
        dead = i;
      }
    }
    this.players[dead].status = 'Out';
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].vote = 0;
      if (this.players[i].role == 'Mafia' && this.players[i].status == 'In') {
        mafia++;
      } else if (
        this.players[i].role != 'Mafia' &&
        this.players[i].status == 'In'
      ) {
        others++;
      }
    }
    let data = {
      uid: sessionStorage.getItem('uId'),
      gameCode: this.gameCode,
      players: this.players,
    };
    await this.commonService.postRequest(data, 'syncplayer');
    await this.commonService.updatePlayer(this.players);
    if (mafia >= others) {
      this.chance = 1;
      await this.commonService.updateStatus(
        sessionStorage.getItem('uId'),
        'Mafia Wins'
      );
    } else if (mafia == 0) {
      this.chance = 1;
      await this.commonService.updateStatus(
        sessionStorage.getItem('uId'),
        'Villagers Wins'
      );
    } else {
      // let data1 = {
      //   uid: sessionStorage.getItem('uId'),
      //   gameCode: this.gameCode,
      //   data: {
      //     one: 'Mafia kills Jai Singh',
      //     two: 'Doctor saved Devvrat',
      //     three: 'Police guessed John as Mafia',
      //     four: 'Villagers voted out Danial',
      //   },
      // };
      this.chance = 1;
      await this.commonService.updateStatus(
        sessionStorage.getItem('uId'),
        'mafiaVote'
      );
    }
  }

  openNavBar() {
    document.getElementById('navBar')?.classList.remove('d-none');
  }
}
