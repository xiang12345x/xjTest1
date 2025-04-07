import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioComponent } from './audio.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: AudioComponent,
    },
];

@NgModule({
    declarations: [AudioComponent],
    imports: [CommonModule, RouterModule.forChild(routes)],
})
export class AudioModule {}
