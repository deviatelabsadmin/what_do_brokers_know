import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

const GEO_API_URL = 'https://ipgeolocation.abstractapi.com/v1/?api_key=17005dce5a684b3aaa6a7aabcb728097&ip_address=';

@Injectable({
  providedIn: 'root'
})
export class GeolocateService {

  constructor(private http: HttpClient) { }

  async getIpAddress() {
    const res = await firstValueFrom(this.http.get('https://api.ipify.org?format=json'))
    return (res as any).ip;
  }

  async getLocationFromIp(ip: string) {
    const res = await firstValueFrom(this.http.get(GEO_API_URL + ip));
    return res;
  }

  isVpn(res: any): boolean {
    return res.security.is_vpn;
  }

  locationStr(res: any): string {
    return res.city + ", " + res.region;
  }
}
