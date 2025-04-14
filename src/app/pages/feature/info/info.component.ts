import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { InfoService } from './info.service';

@Component({
    selector: 'xj-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
    /**头像URL */
    avatarUrl = '';

    constructor(private message: NzMessageService, private service: InfoService) {}

    /**标题 */
    title = '个人信息查看';
    /**用户信息 */
    userInfo = <any>{};
    /**是否编辑 */
    edit = false;
    /**用户信息表单 */
    userInfoForm = new FormGroup({
        username: new FormControl('', [Validators.required]),
        date: new FormControl('', [Validators.required]),
        address: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
    });

    editForm() {
        this.edit = true;
        this.title = '个人信息编辑';
        this.userInfoForm.enable();
    }

    ngOnInit(): void {
        this.userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        this.avatarUrl = this.userInfo.avatarUrl;
        this.userInfoForm.patchValue(this.userInfo);
        if (!this.edit) {
            this.userInfoForm.disable();
        }
    }

    /**处理头像上传 */
    uploadAvator(event: Event): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            // 上传图片
            const formData = new FormData();
            formData.append('avatar', file);
            this.service.uploadAvatar(formData).subscribe((res: any) => {
                if (res) {
                    this.userInfo = res.data.user;
                    this.avatarUrl = res.data.avatarUrl; // 使用服务器返回的URL
                    localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
                }
            });
        }
    }

    onSubmit() {
        if (this.userInfoForm.invalid) {
            this.message.error('请填写完整信息');
            return;
        }
        let data = this.userInfoForm.value;
        data = { ...this.userInfo, ...data };
        this.service.updateUser(data).subscribe((res: any) => {
            if (res) {
                localStorage.setItem('userInfo', JSON.stringify(res.data));
                this.edit = false;
                this.title = '个人信息查看';
                this.userInfoForm.disable();
            }
        });
    }
}
