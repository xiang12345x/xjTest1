import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from './info.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

const routes = [
    {
        path: '',
        component: InfoComponent,
    },
];

@NgModule({
    declarations: [InfoComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        NzFormModule,
        ReactiveFormsModule,
        NzInputModule,
        NzButtonModule,
        NzDatePickerModule,
    ],
})
export class InfoModule {}
