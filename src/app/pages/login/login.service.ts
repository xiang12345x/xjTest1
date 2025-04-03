import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    constructor(private http: HttpClient) {}

    /**登录 */
    login(data: { username: string; password: string }) {
        const api = 'http://localhost:3000/api/login';
        return this.http.post(api, data);
    }

    /**注册 */
    register(data: { username: string; password: string }) {
        const api = 'http://localhost:3000/api/register';
        return this.http.post(api, data);
    }
}
