import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  ngOnInit(): void {}

  constructor(
    private router: Router,
    private commonService: CommonService,
    private auth: AuthService,
    private fb : FormBuilder
  ) {
    commonService.pageName.next('logIn');
    this.initForm();
    auth.principle.subscribe(async x=>{
      let y = await auth.getRequest(x,'login');
      if(y.status == 200){
        router.navigate(['mafia/dashboard']);
      }
    })
  }

  initForm(){
    this.loginForm = this.fb.group({
      email:['',[Validators.required]],
      password:['',[Validators.required]]
    })
  }

  login() {
    this.router.navigate(['mafia/dashboard']);
  }

  async loginThroughGoogle() {
    this.auth.signInWithGoogle();
  }
}
