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
  isMod: any;
  players: any = [];
  playerCount = 0;
  gameCode = sessionStorage.getItem('gameCode');
  constructor(private router: Router, private commonService: CommonService) {
    commonService.pageName.next('game');
  }

  async ngOnInit(): Promise<void> {
    // this.startTimer();
    await this.commonService.getGame();
    this.isMod = sessionStorage.getItem('isMod');
    console.log(this.isMod);
    this.commonService.player.subscribe((x) => {
      console.log(x);
      for (var key in x) {
        for (let i = 0; i < this.playerCount; i++) {
          continue;
        }
        if (Object.prototype.hasOwnProperty.call(x, key)) {
          var val = x[key];
          console.log(val);
          this.getPlayerData(val.uid);
        }
        this.playerCount++;
      }
    });
  }

  async getPlayerData(uid: any) {
    let data = { uid: uid };
    let res = await this.commonService.postRequest(data, 'getplayerdata');
    if (res.code == 200) {
      console.log(res);
      let player = {
        name: res.data.displayName,
        dp: '../../assets/img/' + res.data.photo + '.jpg',
      };
      this.players = [];
      this.players.push(player);
      console.log(this.players);
    }
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
