import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'xj-feature',
    templateUrl: './feature.component.html',
    styleUrls: ['./feature.component.scss'],
})
export class FeatureComponent implements OnInit {
    constructor(private route: ActivatedRoute, private title: Title) {}

    /**
     * 功能名称
     */
    featureName = '';

    isDarkMode = false;
    /**切换主题 */
    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        if (this.isDarkMode) {
            document.body.setAttribute('data-theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
        }
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.featureName = params['name'];
        });
        this.title.setTitle('功能区-' + this.featureName);
    }
}
