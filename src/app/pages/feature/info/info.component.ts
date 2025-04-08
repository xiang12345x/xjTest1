import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { InfoService } from './info.service';
import { Router } from '@angular/router';

@Component({
    selector: 'xj-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
    constructor(
        private message: NzMessageService,
        private service: InfoService,
        private router: Router
    ) {}

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
        console.log(this.userInfo);
        this.userInfoForm.patchValue(this.userInfo);
        if (!this.edit) {
            this.userInfoForm.disable();
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
