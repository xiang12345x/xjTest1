import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from './account.service';
import { DatePipe } from '@angular/common';

type RecordCategory = 'food' | 'transport' | 'shopping' | 'other';

interface AccountRecord {
    amount: number;
    category: RecordCategory;
    description: string;
    date: string;
}

@Component({
    selector: 'xj-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
    providers: [DatePipe],
})
export class AccountComponent implements OnInit {
    records: AccountRecord[] = [];
    newRecord: Omit<AccountRecord, 'date'> = {
        amount: 0,
        category: 'food',
        description: '',
    };

    constructor(private service: AccountService, private datePipe: DatePipe) {}

    ngOnInit(): void {
        this.getList();
    }

    date: Date | null = null;

    /**日期改变 */
    dateChange(date: any): void {
        const params: any = {
            startDate: this.datePipe.transform(date[0], 'yyyy-MM-dd'),
            endDate: this.datePipe.transform(date[1], 'yyyy-MM-dd'),
        };
        this.getList(params);
    }

    /**格式化日期 */
    formatDate(date: Date): string {
        return this.datePipe.transform(date, 'yyyy-MM-dd HH:mm') || '';
    }

    /**获取记录 */
    getList(params?: any): void {
        this.service.getList(params).subscribe((res: any) => {
            this.records = res.data.map((item: any) => {
                return {
                    ...item,
                    date: this.formatDate(new Date(item.date)),
                };
            });
        });
    }

    /**添加记录 */
    addRecord(): void {
        this.service
            .save({ ...this.newRecord, date: this.formatDate(new Date()) })
            .subscribe((res: any) => {
                if (res) {
                    this.records.unshift({
                        ...this.newRecord,
                        date: this.formatDate(new Date()),
                    });
                    // 重置表单
                    this.newRecord = {
                        amount: 0,
                        category: 'food',
                        description: '',
                    };
                }
            });
    }

    /**删除记录 */
    deleteRecord(record: any): void {
        this.service.delete(record._id).subscribe((res: any) => {
            this.records = this.records.filter(item => item !== record);
        });
    }
}
