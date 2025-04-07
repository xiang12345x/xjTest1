import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class AccountService {
    constructor(private http: HttpClient) {}

    /**保存 */
    save(data: { amount: number; category: string; description: string; date: string }) {
        const api = 'http://localhost:3000/api/account/save';
        return this.http.post(api, data);
    }

    /**获取记录 */
    getList(date?: { startDate?: string; endDate?: string }) {
        let api = 'http://localhost:3000/api/account/getList';
        if (date?.startDate || date?.endDate) {
            const params = new URLSearchParams();
            if (date.startDate) params.append('startDate', date.startDate);
            if (date.endDate) params.append('endDate', date.endDate);
            api += '?' + params.toString();
        }

        return this.http.get(api);
    }

    /**删除 */
    delete(id: number) {
        const api = `http://localhost:3000/api/account/delete/${id}`;
        return this.http.delete(api);
    }
}
