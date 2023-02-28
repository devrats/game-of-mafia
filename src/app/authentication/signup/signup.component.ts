import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  ngOnInit(): void {}

  constructor(private router : Router){}

  login(){
    this.router.navigate(['mafia/dashboard'])
  }

  loginThroughGoogle(){
    this.router.navigate(['mafia/dashboard'])
  }

}
