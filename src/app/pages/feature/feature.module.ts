import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureComponent } from './feature.component';
import { RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

const routes = [
    {
        path: '',
        component: FeatureComponent,
        children: [
            {
                path: 'info',
                loadChildren: () => import('./info/info.module').then(m => m.InfoModule),
            },
            {
                path: 'account',
                loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
            },
            {
                path: 'appstore',
                loadChildren: () =>
                    import('./appstore/appstore.module').then(m => m.AppstoreModule),
            },
            {
                path: 'audio',
                loadChildren: () => import('./audio/audio.module').then(m => m.AudioModule),
            },
            {
                path: 'book',
                loadChildren: () => import('./book/book.module').then(m => m.BookModule),
            },
            {
                path: 'camera',
                loadChildren: () => import('./camera/camera.module').then(m => m.CameraModule),
            },
        ],
    },
];

@NgModule({
    declarations: [FeatureComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NzLayoutModule,
        NzBreadCrumbModule,
        NzButtonModule,
        NzIconModule,
    ],
})
export class FeatureModule {}
