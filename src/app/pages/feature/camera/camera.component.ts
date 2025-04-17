import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { renderAsync } from 'docx-preview';

@Component({
    selector: 'xj-camera',
    templateUrl: './camera.component.html',
    styleUrls: ['./camera.component.scss'],
})
export class CameraComponent implements OnInit, OnDestroy {
    constructor() {}

    @ViewChild('videoElement') videoElement!: ElementRef;
    @ViewChild('canvasElement') canvasElement!: ElementRef;

    photoUrl: string | null = null;
    wordContent: string | null = null;
    stream: MediaStream | null = null;

    @ViewChild('previewContainer') previewContainer!: ElementRef;

    async previewWord(event: any) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            // 清空预览容器
            this.previewContainer.nativeElement.innerHTML = '';

            // 使用docx-preview渲染Word文档
            await renderAsync(file, this.previewContainer.nativeElement, undefined, {
                className: 'docx', // 自定义样式类名
                inWrapper: true, // 包含包装容器
                ignoreWidth: false,
                ignoreHeight: false,
                ignoreFonts: false,
            });

            // 隐藏纯文本预览
            this.wordContent = null;
        } catch (err) {
            console.error('Word预览失败:', err);
        }
    }

    async startCamera() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
                audio: false,
            });
            this.videoElement.nativeElement.srcObject = this.stream;
        } catch (err) {
            console.error('摄像头访问失败:', err);
            alert('无法访问摄像头，请检查权限设置');
        }
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.videoElement.nativeElement.srcObject = null;
            this.stream = null;
        }
    }

    capture() {
        if (!this.stream) return;

        const video = this.videoElement.nativeElement;
        const canvas = this.canvasElement.nativeElement;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        this.photoUrl = canvas.toDataURL('image/png');
    }
    print() {
        window.print();
    }

    ngOnInit(): void {}

    ngOnDestroy() {
        this.stopCamera();
    }
}
