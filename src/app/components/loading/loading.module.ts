import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading.component'; // 引入组件

@NgModule({
    declarations: [LoadingComponent], // 声明组件
    imports: [CommonModule],
    exports: [LoadingComponent], // 导出组件
})
export class LoadingModule {}
