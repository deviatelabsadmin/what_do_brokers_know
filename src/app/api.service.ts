import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private url: string = "https://vojet6tvl9.execute-api.us-east-1.amazonaws.com/dev/terminal";
  
  constructor(private http: HttpClient) { }

  async requestByEmail(email: string, isDummy?: boolean) {
    const body: any = {"email": email};

    if (isDummy) {
      body['isDummy'] = true;
    }

    const res = await firstValueFrom(this.http.post(this.url, body));
    return res;
  }
}
