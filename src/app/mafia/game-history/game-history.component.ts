import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-game-history',
  templateUrl: './game-history.component.html',
  styleUrls: ['./game-history.component.scss']
})
export class GameHistoryComponent implements OnInit {
  gameCode:any = sessionStorage.getItem('gameHistoryCode')
  players:any = []
  round:any = []
  displayName = sessionStorage.getItem('displayName')
  result = ''
  async ngOnInit(): Promise<void> {
    debugger
    let res = await this.commonService.postRequest(
      {
        gameCode: sessionStorage.getItem('gameHistoryCode'),
        uid: sessionStorage.getItem('uId'),
      },
      'getgame'
    );
    if(res.code==200){
      this.players = res.data.game.players
      this.round = res.data.game.round
      this.result = res.data.game.result
    }
  }

  constructor(private router : Router, private commonService: CommonService){
    commonService.pageName.next('gameHistory');
  }

  openNavBar(){
    document.getElementById('navBar')?.classList.remove('d-none');
  }

}
