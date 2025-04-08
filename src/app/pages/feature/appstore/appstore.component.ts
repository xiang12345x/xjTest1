import { Component } from '@angular/core';

interface App {
    name: string;
    description: string;
}

@Component({
    selector: 'xj-appstore',
    templateUrl: './appstore.component.html',
    styleUrls: ['./appstore.component.scss'],
})
export class AppstoreComponent {
    isEditMode = false;
    newApp: App = { name: '', description: '' };
    showAddDialog = false;
    apps: App[] = [
        { name: '应用1', description: '这是一个示例应用' },
        { name: '应用2', description: '这是另一个示例应用' },
    ];

    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
    }

    editApp(app: App) {
        // 编辑应用逻辑
        console.log('编辑应用:', app);
    }

    deleteApp(app: App) {
        // 删除应用逻辑
        this.apps = this.apps.filter(a => a !== app);
    }

    openAddDialog() {
        this.newApp = { name: '', description: '' };
        this.showAddDialog = true;
    }

    addApp() {
        if (this.newApp.name && this.newApp.description) {
            this.apps.push({ ...this.newApp });
            this.showAddDialog = false;
        }
    }

    cancelAdd() {
        this.showAddDialog = false;
    }
}
