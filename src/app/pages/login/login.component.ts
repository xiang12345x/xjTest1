import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser'; // Import Title fro
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private titleService: Title,
        private message: NzMessageService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
        });
    }

    /**等待框显示 */
    loading = false;

    /**等待框显示文字 */
    loadingText = '登录中...';

    onSubmit() {
        this.loading = true; // 显示等待框
        setTimeout(() => {
            this.loading = false; // 隐藏等待框
            if (this.loginForm.valid) {
                const userInfo = this.loginForm.getRawValue();
                if (userInfo.username === 'XiangJie' && userInfo.password === '123') {
                    this.message.success('登录成功');
                    localStorage.setItem('userInfo', JSON.stringify(userInfo));
                    localStorage.setItem('isLogin', 'true'); // 存储登录状态
                    this.router.navigate(['/welcome']);
                } else {
                    this.message.error('用户名或密码错误');
                }
            }
        }, 2000);
    }

    ngOnInit(): void {
        this.titleService.setTitle('登录页面-欢迎访问'); // 设置页面标题为'登录页面'
    }
}
