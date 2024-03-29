import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  displayName = sessionStorage.getItem('displayName') || '';
  gameHistory: any;
  gameMafia!: number;
  gamePlayed!: number;
  gameVillager!: number;
  gameWin!: number;
  gameLoose!: number;
  gameCodeForm!: FormGroup;

  constructor(
    private router: Router,
    private commonService: CommonService,
    private fb: FormBuilder
  ) {
    commonService.pageName.next('dashboard');
  }

  async ngOnInit(): Promise<void> {
    this.createForm();
    await this.loadData();
  }

  createForm() {
    this.gameCodeForm = this.fb.group({
      gameCode: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
    });
  }

  async loadData() {
    let data = {
      uid: sessionStorage.getItem('uId'),
    };
    let res = await this.commonService.getRequest(
      data,
      'usergamehistory?uid=' + data.uid
    );
    if (res.code == 200) {
      this.gameHistory = res.data.data.gameHistory;
      this.gameMafia = res.data.data.gameMafia;
      this.gamePlayed = res.data.data.gamePlayed;
      this.gameVillager = res.data.data.gameVillager;
      this.gameWin = res.data.data.gameWin;
      this.gameLoose = res.data.data.gameLoose;
    }
  }

  async createGame() {
    let data = {
      uid: sessionStorage.getItem('uId'),
    };
    let res = await this.commonService.getRequest(
      data,
      'createGame?uid=' + data.uid
    );
    if (res.code == 200) {
      let gameID = JSON.stringify(res.data.gameID);
      Swal.fire({
        icon: 'success',
        title: 'Game created successfully',
        html: 'Game Code : ' + gameID + '</br> Share Code With your Friends',
        confirmButtonText: 'Share Code',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['mafia/game']);
        }
      });
      sessionStorage.setItem('gameCode', gameID);
      await this.commonService.createModGame(
        sessionStorage.getItem('uId'),
        gameID
      );
      await this.commonService.createPlayerGame(
        sessionStorage.getItem('uId'),
        gameID
      );
    }
  }

  async joinGame() {
    this.gameCodeForm.markAllAsTouched();
    if(this.gameCodeForm.invalid){
      return;
    }
    if(this.commonService.startGame == 1){
      Swal.fire({
        icon: 'error',
        title: 'Game already started',
      })
      return;
    }
    let data = {
      uid: sessionStorage.getItem('uId'),
      gameCode: this.gameCodeForm.get('gameCode')?.value,
    };
    
    let res = await this.commonService.postRequest(data, 'joinGame');
    if (res.code == 200) {
      sessionStorage.setItem(
        'gameCode',
        this.gameCodeForm.get('gameCode')?.value
      );
      await this.commonService.joinGame();
      this.router.navigate(['mafia/game']);
    } if(res.code == 201){
      Swal.fire({
        icon: 'error',
        title: 'Already in the game',
      })
    }
  }

  async gameDetails(i: any) {
    let res = await this.commonService.postRequest(
      {
        gameCode: sessionStorage.getItem('gameHistoryCode'),
        uid: sessionStorage.getItem('uId'),
      },
      'getgame'
    );
    sessionStorage.setItem('gameHistoryCode',this.gameHistory[i].gameCode)
    this.router.navigate(['mafia/gamehistory']);
  }

  openNavBar() {
    this.commonService.showHideNavBar = true;
    document.getElementById('navBar')?.classList.remove('d-none');
  }
}
