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
  errorMsg : any = "";
  ngOnInit(): void {}

  constructor(
    private router: Router,
    private commonService: CommonService,
    private auth: AuthService,
    private fb: FormBuilder
  ) {
    commonService.pageName.next('logIn');
    this.initForm();
    auth.principle.subscribe(async (x) => {
      let y = await auth.getRequest(x, 'login');
      if(y.code==200){
        this.router.navigate(['mafia/dashboard']);
      } else{
        this.errorMsg = y.data
      }
    });
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  async login() {
    console.log(this.loginForm);
    let data = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };
    let y = await this.auth.getRequest(data, 'signin');
    console.log(y);
    if(y.code==200){
      this.router.navigate(['mafia/dashboard']);
    } else{
      this.errorMsg = y.data
    }
  }

  async loginThroughGoogle() {
    this.auth.signInWithGoogle();
  }
}
