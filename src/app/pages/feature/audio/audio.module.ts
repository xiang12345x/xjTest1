import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioComponent } from './audio.component';
import { RouterModule, Routes } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@src/app/pipes/shared/shared.module';

const routes: Routes = [
    {
        path: '',
        component: AudioComponent,
    },
];

@NgModule({
    declarations: [AudioComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NzButtonModule,
        NzSliderModule,
        FormsModule,
        SharedModule,
    ],
})
export class AudioModule {}
