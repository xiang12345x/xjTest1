import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppstoreComponent } from './appstore.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: AppstoreComponent,
    },
];

@NgModule({
    declarations: [AppstoreComponent],
    imports: [CommonModule, RouterModule.forChild(routes)],
})
export class AppstoreModule {}
