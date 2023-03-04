import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.scss']
})
export class NavHeaderComponent implements OnInit {

  isShowSideBar: boolean = false;

  ngOnInit(): void {
  }

  constructor(private commonService : CommonService){
    commonService.pageName.subscribe(x => {
      console.log(x);
      if(x=='signIn' || x=='logIn'){
        this.isShowSideBar = false;
      } else{
        this.isShowSideBar = true;
      }
    })
  }
}
