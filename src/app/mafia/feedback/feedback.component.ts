import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  note: string = '';
  star: number = 1;
  rating!: FormGroup;
  category = 'three'
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
      star: [5, [Validators.required]],
      comments: ['']
    });
  }

  submit(){
    console.log(this.rating);
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
    console.log(this.note);

  }

  changeCategory(event:any){
    let val = event.target.value;
    if(val == 'Suggestion'){
      this.category = 'one'
    } else if(val == 'Compliment'){
      this.category = 'three'
    } else{
      this.category = 'two'
    }
  }
}
