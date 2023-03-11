import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common.service';
import { AuthService } from '../auth.service';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signUpForm!: FormGroup;
  ngOnInit(): void {}

  constructor(
    private router: Router,
    private commonService: CommonService,
    private auth: AuthService,
    private fb : FormBuilder
  ) {
    commonService.pageName.next('signIn');
    this.initForm();
  }

  initForm(){
    this.signUpForm = this.fb.group({
      email:['',[Validators.required]],
      password:['',[Validators.required]]
    })
  }

  async signUp(){
    console.log(this.signUpForm);
    let res = await this.auth.createAccount(this.signUpForm.get('email')?.value ,this.signUpForm.get('password')?.value);
    
  }

}
