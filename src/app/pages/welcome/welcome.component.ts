import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Title } from '@angular/platform-browser';
import { Person } from './type';
import * as echarts from 'echarts';
import { WelcomeService } from './welcome.service';
import { query } from '@angular/animations';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit, AfterViewInit {
    constructor(
        private router: Router,
        private message: NzMessageService,
        private modal: NzModalService,
        private notify: NzNotificationService,
        private titleService: Title,
        private service: WelcomeService
    ) {}
    isCollapsed = false;

    /**用户信息 */
    userInfo = <any>{};
    /**头像URL */
    avatarUrl = 'assets/background/7.jpeg';

    /**当前时间 */
    time = new Date();
    /**当前时间对应欢迎语 */
    welcome = this.formatDate(this.time);

    menuOpen = false;

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
    }

    /**表格 */
    tableIfy = {
        selectPerson: <Person>{},
        data: <Person[]>[
            {
                key: '1',
                name: 'John Brown',
                age: 32,
                address: 'New York No. 1 Lake Park',
            },
            {
                key: '2',
                name: 'Jim Green',
                age: 42,
                address: 'London No. 1 Lake Park',
            },
            {
                key: '3',
                name: 'Joe Black',
                age: 32,
                address: 'Sidney No. 1 Lake Park',
            },
        ],
        selectRow: (data: Person) => {
            this.tableIfy.selectPerson = data;
        },
    };

    /**
     * 功能区
     */
    featureIfy = {
        data: <any>[
            {
                icon: 'idcard',
                name: '个人信息',
                router: '/info',
            },
            {
                icon: 'account-book',
                name: '记账本',
                router: '/account',
            },
            {
                icon: 'appstore',
                name: '应用商店',
                router: '/appstore',
            },
            {
                icon: 'customer-service',
                name: '音乐',
                router: '/audio',
            },
            {
                icon: 'book',
                name: '书架',
                router: '/book',
            },
            {
                icon: 'camera',
                name: '照相',
                router: '/camera',
            },
        ],
        skip: (data: any) => {
            this.router.navigate(['/feature' + data.router], {
                queryParams: {
                    name: data.name,
                },
            });
        },
    };
    /**
     * 获取echarts挂载的dom
     */
    @ViewChild('chart') chartRef!: ElementRef;

    /**
     * 获取用户信息方法
     */
    getUserInfo() {
        this.service.getUserInfo().subscribe((res: any) => {
            this.userInfo = res.data;
            this.avatarUrl = this.userInfo.avatarUrl || 'assets/images/default.jpeg'; // 默认头像pat
            // 将用户信息缓存到本地
            localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
            this.hint(); // 欢迎信息
        });
    }

    ngOnInit() {
        /**设置页面标题 */
        this.titleService.setTitle('首页-欢迎访问');
        const isGuest = localStorage.getItem('isGuest');
        if (isGuest) {
            this.userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        } else {
            /**获取用户信息 */
            this.getUserInfo();
        }
    }

    ngAfterViewInit(): void {
        // 注册中国地图GeoJSON数据
        fetch('assets/data/sichuan.json')
            .then(response => response.json())
            .then(sichuanJson => {
                // 确保数据格式正确后再注册
                if (sichuanJson && sichuanJson.features && sichuanJson.features.length > 0) {
                    echarts.registerMap('sichuan', sichuanJson);
                    // 初始化图表
                    this.initChart();
                } else {
                    console.error('Invalid GeoJSON data format');
                }
            })
            .catch(error => {
                console.error('Failed to load map data:', error);
            });
    }

    /**
     * 初始化图表
     */
    initChart() {
        const chartDom = this.chartRef.nativeElement;
        // 设置图表容器初始尺寸
        chartDom.style.width = '100%';
        const myChart = echarts.init(chartDom);

        // 四川各地级市/州数据示例
        const sichuanData = [
            { name: '成都市', value: 1000 },
            { name: '绵阳市', value: 800 },
            { name: '德阳市', value: 700 },
            { name: '宜宾市', value: 600 },
            { name: '南充市', value: 500 },
            { name: '泸州市', value: 450 },
            { name: '达州市', value: 400 },
            { name: '乐山市', value: 350 },
            { name: '眉山市', value: 300 },
            { name: '自贡市', value: 250 },
            { name: '广安市', value: 200 },
            { name: '遂宁市', value: 180 },
            { name: '内江市', value: 150 },
            { name: '攀枝花市', value: 120 },
            { name: '广元市', value: 100 },
            { name: '雅安市', value: 80 },
            { name: '巴中市', value: 60 },
            { name: '资阳市', value: 50 },
            { name: '阿坝藏族羌族自治州', value: 30 },
            { name: '甘孜藏族自治州', value: 20 },
            { name: '凉山彝族自治州', value: 10 },
        ];

        // 指定图标的配置项和数据
        const option = {
            title: {
                text: '四川省人数分布',
                textStyle: {
                    color: '#6973b8',
                    fontWeight: 'bold',
                    fontSize: 16,
                    fontFamily: 'sans-serif',
                },
                left: 'center',
            },
            tooltip: {
                trigger: 'item',
                formatter: (data: any) => {
                    console.log(data);
                    return `${data.name}的人数为: ${data.value}万人`;
                },
            },
            visualMap: {
                min: 0,
                max: 1000,
                text: ['高', '低'],
                textStyle: {
                    color: '#fde047', // 设置文字颜色为黄色
                    fontSize: 12, // 设置文字大小
                    fontWeight: 'bold', // 设置文字粗细
                },
                realtime: false,
                calculable: true,
                inRange: {
                    color: ['#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'],
                },
            },
            series: [
                {
                    name: '四川地图',
                    type: 'map',
                    map: 'sichuan',
                    roam: true,
                    label: {
                        show: true,
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 'bold',
                        formatter: '{b}',
                    },
                    itemStyle: {
                        borderColor: '#fff',
                        borderWidth: 1,
                        areaColor: '#6973b8',
                    },
                    emphasis: {
                        // 高亮状态下的样式
                        label: {
                            color: '#fff',
                        },
                        itemStyle: {
                            areaColor: '#6973b8',
                        },
                    },
                    data: sichuanData,
                },
            ],
        };

        // 使用刚指定的配置项和数据显示图表
        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        // 响应式调整大小
        window.addEventListener('resize', function () {
            myChart.resize();
        });

        // 初始调整大小
        myChart.resize();
    }

    /**
     * 欢迎信息
     */
    hint() {
        this.notify.blank(`欢迎您,${this.userInfo.username} ${this.welcome}!`, '欢迎使用本系统', {
            // 修正为符合 NzNotificationPlacement 类型的值
            nzPlacement: 'bottomRight',
        });
    }

    /**
     * 处理时间函数
     */
    formatDate(date: Date) {
        const hours = date.getHours();
        if (hours >= 6 && hours < 12) {
            return '早上好';
        } else if (hours >= 12 && hours < 18) {
            return '下午好';
        } else if (hours >= 18 && hours < 24) {
            return '晚上好';
        } else {
            return '凌晨好';
        }
    }

    /**
     * 退出登录
     */
    loginOut() {
        this.modal.confirm({
            nzTitle: '提示',
            nzContent: '是否退出登录？',
            nzOkText: '退出',
            nzCancelText: '取消',
            nzOnOk: () => {
                this.router.navigate(['/login']);
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
                localStorage.removeItem('isGuest');
                this.message.success('退出成功');
            },
        });
    }
}
