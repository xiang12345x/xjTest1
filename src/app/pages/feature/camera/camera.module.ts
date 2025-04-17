import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CameraComponent } from './camera.component';
import { RouterModule, Routes } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';

const routes: Routes = [
    {
        path: '',
        component: CameraComponent,
    },
];

@NgModule({
    declarations: [CameraComponent],
    imports: [CommonModule, RouterModule.forChild(routes), NzButtonModule],
})
export class CameraModule {}
