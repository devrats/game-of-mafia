import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../authentication/auth.service';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-nav-sidebar',
  templateUrl: './nav-sidebar.component.html',
  styleUrls: ['./nav-sidebar.component.scss']
})
export class NavSidebarComponent implements OnInit {


  isShowSideBar: boolean = true;
  pageName:string = 'dashboard'

  ngOnInit(): void {
  }

  constructor(private commonService : CommonService, private auth: AuthService, private router : Router){
    commonService.pageName.subscribe(x => {
      console.log(x);
      this.pageName = x;
      if(x=='signIn' || x=='logIn'){
        this.isShowSideBar = false;
      } else{
        this.isShowSideBar = true;
      }
    })
  }

  closeNavBar(){
    document.getElementById('navBar')?.classList.add('d-none');
  }

  logOut(){
    this.auth.signOut();
    this.router.navigate(['login']);
  }
}
