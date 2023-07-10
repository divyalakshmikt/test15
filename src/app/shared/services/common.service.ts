import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
 //Local Access
  // public bmrServerURL = 'http://localhost:3000/api';  // Accendon production backend base url
  // public bmrServerURL = 'http://52.66.15.137:3000/api';  // client Production backend base url
  // public bmrServerURL = 'https://13.234.32.235:3000/api';  // Accendon dev backend base url
  public bmrServerURL ='https://13.232.171.175:3000/api'

  constructor() { }

  getBmrServerURL(): string {
    return this.bmrServerURL;
  }
}
