import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpResponse,
    HttpErrorResponse,
} from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
    constructor(private message: NzMessageService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            tap({
                next: event => {
                    if (event instanceof HttpResponse) {
                        // 在这里处理成功响应
                        if (event.body?.message) {
                            this.message.success(event.body.message);
                        }
                    }
                },
                error: (err: HttpErrorResponse) => {
                    // 在这里处理错误响应
                    if (err.error?.message) {
                        this.message.error(err.error.message);
                    } else {
                        this.message.error('请求失败，请稍后重试');
                    }
                },
            })
        );
    }
}
