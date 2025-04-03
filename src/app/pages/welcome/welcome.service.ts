import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class WelcomeService {
    constructor(private http: HttpClient) {}

    /**获取用户信息 */
    getUserInfo() {
        const api = 'http://localhost:3000/api/userInfo';
        return this.http.get(api);
    }
}
