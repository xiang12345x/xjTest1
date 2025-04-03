import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { LoadingComponent } from '@src/app/components/loading/loading.component';
import { NzModalModule } from 'ng-zorro-antd/modal';

const routes: Routes = [{ path: '', component: LoginComponent }];

@NgModule({
    declarations: [LoginComponent, LoadingComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzLayoutModule,
        NzModalModule,
    ],
})
export class LoginModule {}
