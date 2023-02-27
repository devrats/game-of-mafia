import { Component, OnInit } from '@angular/core';
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
  constructor() {}

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
    Swal.fire({
      icon: 'success',
      title: 'You Guessed it Right',
    });
    // Swal.fire({
    //   icon: 'error',
    //   title: 'You Missed The Chance',
    // })
  }
}
