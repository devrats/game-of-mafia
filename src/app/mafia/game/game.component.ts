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
  constructor(private router : Router, private commonService: CommonService){
    commonService.pageName.next('game');
  }

  ngOnInit(): void {
    this.startTimer();
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
    })
  }

  openNavBar(){
    document.getElementById('navBar')?.classList.remove('d-none');
  }
}
