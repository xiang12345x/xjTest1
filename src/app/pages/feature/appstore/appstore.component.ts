import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OnInit } from '@angular/core';

interface App {
    name: string;
    description: string;
    url?: string;
}

@Component({
    selector: 'xj-appstore',
    templateUrl: './appstore.component.html',
    styleUrls: ['./appstore.component.scss'],
})
export class AppstoreComponent implements OnInit {
    constructor(private message: NzMessageService) {}
    isEditMode = false;
    newApp: App = { name: '', description: '' };
    showAddDialog = false;
    apps: App[] = [
        { name: '应用1', description: '这是一个示例应用', url: 'assets/background/7.jpeg' },
        { name: '应用2', description: '这是另一个示例应用', url: 'assets/background/bg1.jpg' },
    ];

    /**添加、编辑应用弹框 */
    addAppModalIfy = {
        visible: false,
        title: '添加应用',
        // 添加应用表单
        addForm: new FormGroup({
            name: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
        }),
        edit: false,
        // 打开添加应用弹框
        open: (data?: any) => {
            if (data) {
                this.addAppModalIfy.title = '编辑应用';
                this.addAppModalIfy.edit = true;
                this.addAppModalIfy.addForm.patchValue(data);
            } else {
                this.addAppModalIfy.title = '添加应用';
                this.addAppModalIfy.edit = false;
                this.addAppModalIfy.addForm.reset();
            }
            this.addAppModalIfy.visible = true;
        },
        handleOk: () => {
            if (this.addAppModalIfy.addForm.invalid) {
                this.message.error('表单未填写完整，请检查！');
                return;
            }
            const data = this.addAppModalIfy.addForm.value;
            if (this.addAppModalIfy.edit) {
                this.apps = this.apps.map(app =>
                    app.name === data.name ? { ...app, ...data } : app
                );
            } else {
                this.apps.push({ ...data });
            }
            this.addAppModalIfy.visible = false;
        },
        handleCancel: () => {
            this.addAppModalIfy.visible = false;
        },
    };

    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
    }

    deleteApp(app: App) {
        // 删除应用逻辑
        this.apps = this.apps.filter(a => a !== app);
    }

    downLoad(app: App) {
        // 下载应用逻辑
        console.log(`下载应用：${app.name}`);
        if (!app.url) {
            this.message.error('文件路径无效');
            return;
        }

        // 创建隐藏的a标签触发下载
        const link = document.createElement('a');
        link.href = app.url;
        link.download = app.name + this.getFileExtension(app.url);
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // 获取文件扩展名
    private getFileExtension(url: string): string {
        return url.substring(url.lastIndexOf('.'));
    }

    ngOnInit(): void {
        // 初始化逻辑
    }
}
