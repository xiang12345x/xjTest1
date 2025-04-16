import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookComponent } from './book.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { LoadingModule } from '@src/app/components/loading/loading.module';

const routes: Routes = [
    {
        path: '',
        component: BookComponent,
    },
];

@NgModule({
    declarations: [BookComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        NzListModule,
        NzCardModule,
        NzSliderModule,
        NzButtonModule,
        LoadingModule,
    ],
})
export class BookModule {}
