import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-game-history',
  templateUrl: './game-history.component.html',
  styleUrls: ['./game-history.component.scss']
})
export class GameHistoryComponent implements OnInit {
  ngOnInit(): void {
  }

  constructor(private router : Router, private commonService: CommonService){
    commonService.pageName.next('gameHistory');
  }

  openNavBar(){
    document.getElementById('navBar')?.classList.remove('d-none');
  }

}
