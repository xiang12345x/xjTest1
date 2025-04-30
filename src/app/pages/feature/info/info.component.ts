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

    c1!: HTMLCanvasElement;
    ctx!: CanvasRenderingContext2D;

    render() {
        this.ctx.clearRect(0, 0, 400, 300);
        // 存档，保存当前坐标位置和上下文对象状态
        this.ctx.save();
        this.ctx.translate(200, 150);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.save();
        for (let i = 0; i < 12; i++) {
            this.ctx.rotate((2 * Math.PI) / 12);
            this.ctx.beginPath();
            this.ctx.moveTo(85, 0);
            this.ctx.lineTo(95, 0);
            this.ctx.lineWidth = 8;
            this.ctx.strokeStyle = 'gray';
            this.ctx.stroke();
            this.ctx.closePath();
        }
        this.ctx.restore();
        this.ctx.save();
        for (let i = 0; i < 60; i++) {
            this.ctx.rotate((2 * Math.PI) / 60);
            this.ctx.beginPath();
            this.ctx.moveTo(90, 0);
            this.ctx.lineTo(95, 0);
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = 'gray';
            this.ctx.stroke();
            this.ctx.closePath();
        }
        this.ctx.restore();
        this.ctx.save();

        // 获取当前时间
        let time = new Date();
        let hour = time.getHours();
        let min = time.getMinutes();
        let sec = time.getSeconds();
        hour = hour > 12 ? hour - 12 : hour;

        // 绘制秒针
        this.ctx.rotate(((2 * Math.PI) / 60) * sec);
        this.ctx.beginPath();
        this.ctx.moveTo(-15, 0);
        this.ctx.lineTo(95, 0);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = 'red';
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
        this.ctx.save();
        // 绘制分针
        this.ctx.rotate(((2 * Math.PI) / 60) * min + ((2 * Math.PI) / 3600) * sec);
        this.ctx.beginPath();
        this.ctx.moveTo(-10, 0);
        this.ctx.lineTo(65, 0);
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = '#888';
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
        this.ctx.save();
        // 绘制分针
        this.ctx.rotate(
            ((2 * Math.PI) / 12) * hour +
                ((2 * Math.PI) / 720) * min +
                ((2 * Math.PI) / 3600 / 12) * sec
        );
        this.ctx.beginPath();
        this.ctx.moveTo(-7.5, 0);
        this.ctx.lineTo(55, 0);
        this.ctx.lineWidth = 8;
        this.ctx.strokeStyle = '#333';
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
        this.ctx.restore();
        requestAnimationFrame(() => this.render());
    }

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

    ngAfterViewInit() {
        this.c1 = document.getElementById('c1') as HTMLCanvasElement;
        this.ctx = this.c1.getContext('2d')!;
        this.render();
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
