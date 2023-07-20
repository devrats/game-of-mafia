import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  note: string = '';
  star: number = 1;
  rating!: FormGroup;
  category = 'Suggestion'
  ngOnInit(): void {}

  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder
  ) {
    commonService.pageName.next('feedback');
    this.buildForm();
  }

  buildForm() {
    this.rating = this.formBuilder.group({
      star: ['', [Validators.required]],
      comments: [''],
      type: ['Suggestion']
    });
  }

  async submit(){
    this.rating.markAllAsTouched();
    if(this.rating.invalid){
      return;
    }
    let data = {
      star: this.rating.get('star')?.value,
      comments : this.rating.get('comments')?.value,
      type: this.rating.get('type')?.value,
      uid: sessionStorage.getItem('uId')
    }
    let res = await this.commonService.postRequest(data, 'feedback');
    if(res.code==200){
      Swal.fire({
        icon: 'success',
        title: 'Thanks For Your Feedback',
      })
    }
  }

  change(event :any){
    let val = event.target.value;
    switch(val) {
      case '1': this.note = "Hate it"
      break;
      case '2': this.note = "Its bad!!"
      break;
      case '3': this.note = "This is somehow ok!!"
      break;
      case '4': this.note = "Liked it!!"
      break;
      case '5': this.note = "Loved it!!"
      break;
    }

  }

  changeCategory(event:any){
    let val = event.target.value;
    if(val == 'Suggestion'){
      this.category = 'Suggestion'
    } else if(val == 'Compliment'){
      this.category = 'Compliment'
    } else{
      this.category = 'Issue'
    }
    this.rating.get('type')?.setValue(this.category);
  }

  openNavBar(){
    this.commonService.showHideNavBar = true;
    document.getElementById('navBar')?.classList.remove('d-none');
  }
}
