import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router) {}
    canActivate(): boolean {
        if (localStorage.getItem('token')) {
            return true;
        } else {
            this.router.navigate(['/login']); // 重定向到登录页面
            return false; // 阻止路由继续进行，即用户未登录时无法访问受保护的路由
        }
    }
}
