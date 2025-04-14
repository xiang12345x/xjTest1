import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioComponent } from './audio.component';
import { RouterModule, Routes } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';

const routes: Routes = [
    {
        path: '',
        component: AudioComponent,
    },
];

@NgModule({
    declarations: [AudioComponent],
    imports: [CommonModule, RouterModule.forChild(routes), NzButtonModule],
})
export class AudioModule {}
