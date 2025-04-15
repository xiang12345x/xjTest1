import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
    IdcardTwoTone,
    AccountBookTwoTone,
    AppstoreTwoTone,
    AudioTwoTone,
    BookTwoTone,
    CameraTwoTone,
    UserOutline,
    LockOutline,
    SafetyOutline,
    MailOutline,
    AppstoreOutline,
    BulbOutline,
    CustomerServiceTwoTone,
    MenuOutline,
} from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';
import { ResponseInterceptor } from './services/response.interceptor';

registerLocaleData(zh);

const icons: IconDefinition[] = [
    IdcardTwoTone,
    AccountBookTwoTone,
    AppstoreTwoTone,
    AudioTwoTone,
    BookTwoTone,
    CameraTwoTone,
    UserOutline,
    LockOutline,
    SafetyOutline,
    MailOutline,
    AppstoreOutline,
    BulbOutline,
    CustomerServiceTwoTone,
    MenuOutline,
];

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        NzMessageModule,
        NzModalModule,
        NzNotificationModule,
        NzIconModule.forRoot(icons),
    ],
    providers: [
        { provide: NZ_I18N, useValue: zh_CN },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ResponseInterceptor,
            multi: true,
        },
        Title,
        NzMessageService,
        NzModalService,
        NzNotificationService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
