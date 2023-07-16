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
  errorMsg : any = '';
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
      name:['',[Validators.required]],
      email:['',[Validators.required]],
      password:['',[Validators.required]]
    })
  }

  async signUp(){
    console.log(this.signUpForm);
    this.signUpForm.markAllAsTouched();
    if(this.signUpForm.invalid){
      return;
    }
    let data = {
      displayName: this.signUpForm.get('name')?.value,
      email: this.signUpForm.get('email')?.value,
      password: this.signUpForm.get('password')?.value
    }
    let y = await this.auth.getRequest(data,'signup');
    if(y.code==200){
      this.router.navigate(['mafia/dashboard']);
    } else{
      this.errorMsg = y.data
    }
  }

}
