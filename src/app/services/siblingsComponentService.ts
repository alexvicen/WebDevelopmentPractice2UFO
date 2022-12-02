import { Observable, BehaviorSubject } from 'rxjs';


export class SibligsService {
  private data = new BehaviorSubject("")
  currentData = this.data.asObservable();

  constructor() { }

  setData(data: any) {
    this.data.next(data);
  }
}
