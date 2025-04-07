import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureComponent } from './feature.component';
import { RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

const routes = [
    {
        path: '',
        component: FeatureComponent,
        children: [
            {
                path: 'info',
                loadChildren: () => import('./info/info.module').then(m => m.InfoModule),
            },
        ],
    },
];

@NgModule({
    declarations: [FeatureComponent],
    imports: [CommonModule, RouterModule.forChild(routes), NzLayoutModule, NzBreadCrumbModule],
})
export class FeatureModule {}
