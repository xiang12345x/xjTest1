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
    smsLoginForm: FormGroup;
    countdown = 0; // 验证码倒计时
    countdownInterval: any; // 倒计时定时器
    loginType = 'account'; // 登录类型，默认为账号密码登录

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
        this.smsLoginForm = this.fb.group({
            phone: ['', [Validators.required, Validators.pattern(/^1[3-9]\d{9}$/)]],
            smsCode: ['', Validators.required],
        });
    }

    /**
     * 发送短信验证码
     */
    sendSmsCode() {
        const phone =
            this.loginType === 'sms'
                ? this.smsLoginForm.get('phone')?.value
                : this.loginForm.get('phone')?.value;

        if (!phone) {
            this.message.error('请输入手机号');
            return;
        }

        // 调用发送验证码API
        this.loginService.sendSmsCode(phone).subscribe({
            next: res => {
                if (res.success) {
                    this.startCountdown();
                } else {
                    this.message.error(res.message || '验证码发送失败');
                }
            },
            error: err => {
                this.message.error('验证码发送失败');
            },
        });
    }

    /**
     * 短信验证码登录提交
     */
    onSmsSubmit() {
        if (this.smsLoginForm.invalid) {
            return;
        }

        const { phone, smsCode } = this.smsLoginForm.value;
        this.loading = true;

        this.loginService.loginWithSms({ phone, code: smsCode }).subscribe({
            next: res => {
                this.loading = false;
                if (res.success) {
                    // 登录成功处理
                    localStorage.setItem('token', res.token);
                    this.router.navigate(['/welcome']).then(success => {
                        if (!success) {
                            console.error('导航到/welcome失败');
                        }
                    });
                } else {
                    this.message.error(res.message || '登录失败');
                }
            },
            error: err => {
                this.loading = false;
                this.message.error('登录失败');
            },
        });
    }

    /**
     * 开始倒计时
     */
    startCountdown() {
        this.countdown = 60;
        this.countdownInterval = setInterval(() => {
            this.countdown--;
            if (this.countdown <= 0) {
                clearInterval(this.countdownInterval);
            }
        }, 1000);
    }

    ngOnDestroy() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
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
            phone: ['', [Validators.required, Validators.pattern(/^1[3-9]\d{9}$/)]],
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
                const { username, password, phone } = this.registerIfy.registerForm.value;
                this.loginService.register({ username, password, phone }).subscribe((res: any) => {
                    this.loading = false; // 隐藏等待框
                    if (res.success) {
                        // this.message.success(res.message); // 注册成功提示
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

    guestLogin() {
        this.loading = true;
        this.loadingText = '正在进入游客模式...';
        localStorage.setItem('token', 'guest'); // 模拟游客模式，设置token为guest
        localStorage.setItem('userInfo', JSON.stringify({ username: '游客', role: 'guest' })); // 模拟游客模式，设置userInfo为guest dat
        localStorage.setItem('isGuest', 'true'); // 模拟游客模式，设置isGuest为true
        this.router.navigate(['/welcome']);
    }

    ngOnInit(): void {
        this.titleService.setTitle('登录页面-欢迎访问'); // 设置页面标题为'登录页面'
    }
}
