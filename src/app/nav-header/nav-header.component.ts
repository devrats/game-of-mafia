import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.scss']
})
export class NavHeaderComponent implements OnInit {

  isShowSideBar: boolean = false;

  ngOnInit(): void {
  }

  constructor(private commonService : CommonService, private router : Router){
    commonService.pageName.subscribe(x => {
      if(x=='signIn' || x=='logIn'){
        this.isShowSideBar = false;
      } else{
        this.isShowSideBar = true;
      }
    })
  }

  navigateTosignUp(){
    this.router.navigate(['signup']);
  }

  navigateToLogin(){
    this.router.navigate(['login']);
  }
}
