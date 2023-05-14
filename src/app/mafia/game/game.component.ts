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
  mafia: boolean = true;
  timeLeft: number = 60;
  interval: any;
  isMod!: boolean;
  players: any = [];
  playerCount = 0;
  gameCode = sessionStorage.getItem('gameCode');
  role = ''
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
            this.getPlayerData(val.uid, key);
          }
          this.playerCount++;
        }
      }
    });
    this.commonService.currStatus.subscribe(async (x) => {
      if (x == 'whoAmI' && !this.isMod) {
        let res = await this.commonService.postRequest(
          { uid: sessionStorage.getItem('uId'), gameCode: this.gameCode },
          'whoami'
        );
        if (res.code == 200) {
          console.log(res);
          this.role = res.data.role
          Swal.fire({
            icon: 'success',
            title: 'You are a ' + res.data.role + ' enjoy your game',
            confirmButtonText: 'OK',
          });
        }
      }
    });
  }

  async getPlayerData(uid: any, key: any) {
    let data = { uid: uid };
    let res = await this.commonService.postRequest(data, 'getplayerdata');
    if (res.code == 200) {
      console.log(res);
      let player = {
        name: res.data.displayName,
        dp: '../../assets/img/' + res.data.photo + '.jpg',
        key: key,
        role: '',
        status: 'In',
        vote: 0,
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
      await this.commonService.postRequest(data1, 'gameStarted');
      await this.commonService.gameStart(this.players);
    }
  }

  getRandom(n: any) {
    var result = new Array(n),
      len = this.players.length,
      taken = new Array(len),
      mafia = n - 2,
      doc = 1,
      police = 1;
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

  startTimer() {
    this.interval = setInterval(() => {
      console.log('hii');
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 60;
      }
    }, 1000);
  }

  isMafia() {
    // Swal.fire({
    //   icon: 'success',
    //   title: 'You Guessed it Right',
    // });
    Swal.fire({
      icon: 'error',
      title: 'You Missed The Chance',
    });
  }

  openNavBar() {
    document.getElementById('navBar')?.classList.remove('d-none');
  }
}
