import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  private dataPromise!: any
  
  sendData(data: any){
    this.dataPromise = data
  }

  getData(){
    return Promise.resolve(this.dataPromise)
  }
}
