import { NgModule } from '@angular/core';
import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        WelcomeRoutingModule,
        NzLayoutModule,
        NzMenuModule,
        NzIconModule,
        NzButtonModule,
        NzTableModule,
        NzDividerModule,
        CommonModule,
    ],
    declarations: [WelcomeComponent],
    exports: [WelcomeComponent],
})
export class WelcomeModule {}
