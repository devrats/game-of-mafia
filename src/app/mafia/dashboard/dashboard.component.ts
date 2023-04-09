import { Component, OnInit } from '@angular/core';
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

  constructor(private router: Router, private commonService: CommonService) {
    commonService.pageName.next('dashboard');
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData() {
    let data = {
      uid: sessionStorage.getItem('uId'),
    };
    let res = await this.commonService.getRequest(
      data,
      'usergamehistory?uid=' + data.uid
    );
    console.log(res);
    if (res.code == 200) {
      this.gameHistory = res.data.data.gameHistory;
      this.gameMafia = res.data.data.gameMafia;
      this.gamePlayed = res.data.data.gamePlayed;
      this.gameVillager = res.data.data.gameVillager;
      this.gameWin = res.data.data.gameWin;
      this.gameLoose = this.gamePlayed - this.gameWin;
    }
  }

  createGame() {
    console.log('hello');
    Swal.fire({
      icon: 'success',
      title: 'Game created successfully',
      html: 'Game Code : 123456 </br> Share Code With your Friends',
      confirmButtonText: 'Share Code',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['mafia/game']);
      }
    });
  }

  gameDetails() {
    this.router.navigate(['mafia/gamehistory']);
  }

  openNavBar() {
    document.getElementById('navBar')?.classList.remove('d-none');
  }
}
