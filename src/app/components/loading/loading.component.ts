import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'xj-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
    constructor() {}

    @Input() loading: boolean = false;
    @Input() loadingText: string = '拼命加载中...';

    ngOnInit(): void {}
}
