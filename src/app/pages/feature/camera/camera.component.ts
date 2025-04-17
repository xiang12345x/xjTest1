import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';

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
    stream: MediaStream | null = null;

    ngOnInit(): void {}

    ngOnDestroy() {
        this.stopCamera();
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
}
