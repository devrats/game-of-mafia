import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router){}

  ngOnInit(): void {
  }

  createGame(){
    console.log("hello");
    Swal.fire({
      icon: 'success',
      title: 'Game created successfully',
      html: 'Game Code : 123456 </br> Share Code With your Friends',
      confirmButtonText: 'Share Code'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['mafia/game']);
      }
    })
  }

  gameDetails(){
    this.router.navigate(['mafia/gamehistory']);
  }

}
