import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser'; // Import Title fro
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { AbstractControl } from '@angular/forms';

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
        private router: Router,
        private loginService: LoginService
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

    /**密码校验 */
    passwordMatchValidator(control: AbstractControl) {
        const password = control.parent?.get('password')?.value;
        const confirmPassword = control.value;
        return password === confirmPassword ? null : { notSame: true };
    }
    /**
     * 注册弹框
     */
    registerIfy = {
        visible: false, // 控制弹框的显示与隐藏
        title: '用户注册', // 弹框标题
        // 在组件类中添加
        registerForm: this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            confirmPassword: ['', [Validators.required, this.passwordMatchValidator]],
        }),
        open: () => {
            this.registerIfy.visible = true; // 显示弹框
            this.loadingText = '注册中...'; // 设置等待框文字
            this.registerIfy.registerForm.reset({});
        },
        close: () => {
            this.loadingText = '登录中...';
            this.registerIfy.visible = false; // 隐藏弹框
        },
        /**注册 */
        save: () => {
            if (this.registerIfy.registerForm.valid) {
                // 调用注册API
                this.loading = true; // 显示等待框
                const { username, password } = this.registerIfy.registerForm.value;
                this.loginService.register({ username, password }).subscribe((res: any) => {
                    this.loading = false; // 隐藏等待框
                    if (res.success) {
                        this.message.success(res.message); // 注册成功提示
                        this.registerIfy.close(); // 关闭弹框
                    } else {
                        this.message.error(res.message); // 注册失败提示
                    }
                });
            }
        },
    };

    onSubmit() {
        this.loading = true; // 显示等待框
        if (this.loginForm.valid) {
            const userInfo = this.loginForm.getRawValue();
            this.loginService.login(userInfo).subscribe((res: any) => {
                this.loading = false; // 隐藏等待框
                if (res.success) {
                    this.message.success(res.message); // 登录成功提示
                    localStorage.setItem('token', res.token);
                    this.router.navigate(['/welcome']).then(success => {
                        if (!success) {
                            console.error('导航到/welcome失败');
                        }
                    });
                } else {
                    this.message.error(res.message); // 登录失败提示
                }
            });
        }
    }

    ngOnInit(): void {
        this.titleService.setTitle('登录页面-欢迎访问'); // 设置页面标题为'登录页面'
    }
}
