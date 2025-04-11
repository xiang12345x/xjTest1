import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppstoreComponent } from './appstore.component';
import { RouterModule, Routes } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';

const routes: Routes = [
    {
        path: '',
        component: AppstoreComponent,
    },
];

@NgModule({
    declarations: [AppstoreComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NzIconModule,
        NzInputModule,
        NzSelectModule,
        NzCardModule,
        NzButtonModule,
        NzSwitchModule,
        FormsModule,
        NzModalModule,
        NzFormModule,
        ReactiveFormsModule,
    ],
})
export class AppstoreModule {}
