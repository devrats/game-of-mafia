import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public pageName: BehaviorSubject<string> = new BehaviorSubject<string>('');
  config = {
    headers: {
      'Content-Type': 'application/JSON',
    },
  };

  constructor() { }

  async getRequest(data: any, url: string) {
    try {
      console.log(data);
      let res = await axios.get(
        'http://localhost:3000/' + url,
        this.config
      );
      if (res.status == 200) {
        console.log(res.data);
        return { data: res.data, code: 200 };
      }
      if (res.status == 201) {
        console.log(res.data);
        return { data: res.data, code: 201 };
      }
    } catch (error: any) {
      console.log(error);
      return error;
    }
  }

  async postRequest(data: any, url: string) {
    try {
      console.log(data);
      let res = await axios.post(
        'http://localhost:3000/' + url,
        data,
        this.config
      );
      if (res.status == 200) {
        console.log(res.data);
        return { data: res.data, code: 200 };
      }
      if (res.status == 201) {
        console.log(res.data);
        return { data: res.data, code: 201 };
      }
    } catch (error: any) {
      console.log(error);
      return error;
    }
  }
}
