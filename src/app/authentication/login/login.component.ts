import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  ngOnInit(): void {}

  constructor(private router : Router, private commonService: CommonService, private auth : AuthService){
    commonService.pageName.next('logIn');
  }

  login(){
    this.router.navigate(['mafia/dashboard'])
  }

  loginThroughGoogle(){
    this.auth.signInWithGoogle();
    this.router.navigate(['mafia/dashboard'])
  }

}
