import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class InfoService {
    constructor(private http: HttpClient) {}

    /**更新用户信息 */
    updateUser(data: any) {
        const api = 'http://localhost:3000/api/updateUser';
        return this.http.post(api, data);
    }
}
