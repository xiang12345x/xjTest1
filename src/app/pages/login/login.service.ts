import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) {}

  /**
   * 发送短信验证码
   * @param phone 手机号码
   */
  sendSmsCode(phone: string): Observable<any> {
    return this.http.post('/api/sms/send', { phone });
  }

  /**
   * 短信验证码登录
   * @param params 登录参数(手机号+验证码)
   */
  loginWithSms(params: {phone: string, code: string}): Observable<any> {
    return this.http.post('/api/login/sms', params);
  }

  // 原有方法保持不变
  login(params: any): Observable<any> {
    return this.http.post('/api/login', params);
  }

  register(params: any): Observable<any> {
    return this.http.post('/api/register', params);
  }
}
