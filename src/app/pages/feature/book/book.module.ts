import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookComponent } from './book.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: BookComponent,
    },
];

@NgModule({
    declarations: [BookComponent],
    imports: [CommonModule, RouterModule.forChild(routes)],
})
export class BookModule {}
