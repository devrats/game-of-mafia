import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public pageName: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() { }
}
