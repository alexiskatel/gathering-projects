import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QueryDataFromApiService{
  constructor(private http: HttpClient) { }

  postDataFromApi(url: string, body: any): Observable<any>{
    return this.http.post(url, body)
  }
  getDataFromApi(url: string): Observable<any> {
    return this.http.get(url);
  }
}
