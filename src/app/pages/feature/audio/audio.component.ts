import { Component, OnInit, OnDestroy, ElementRef, HostListener } from '@angular/core';
import * as THREE from 'three';
import { Howl } from 'howler'; // 导入Howler.js

@Component({
    selector: 'xj-audio',
    templateUrl: './audio.component.html',
    styleUrls: ['./audio.component.scss'],
})
export class AudioComponent implements OnInit, OnDestroy {
    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private renderer!: THREE.WebGLRenderer;
    private objects: THREE.Mesh[] = [];
    currentIndex = 0;
    private rafId!: number;
    private isDragging = false;
    private previousMousePosition = { x: 0, y: 0 };
    private textureLoader = new THREE.TextureLoader();
    private imageUrls = [
        'assets/images/2.jpeg',
        'assets/images/3.jpeg',
        'assets/images/4.jpeg',
        'assets/images/5.jpeg',
        'assets/images/6.jpeg',
    ];
    public sound!: Howl; // 音乐播放器实例
    private audioFiles = [
        'assets/audio/明天，你好 - 牛奶咖啡.mp3',
        'assets/audio/时光背面的我 - 刘至佳_韩瞳.mp3',
        'assets/audio/是你 - 梦然.mp3',
        'assets/audio/我想更懂你 - 潘玮柏_苏芮.mp3',
        'assets/audio/下完这场雨 - 后弦.mp3',
    ];
    audioList = [
        '明天，你好 - 牛奶咖啡',
        '时光背面的我 - 刘至佳_韩瞳',
        '是你 - 梦然',
        '我想更懂你 - 潘玮柏_苏芮',
        '下完这场雨 - 后弦',
    ];
    volume = 50;
    currentTime = 0; // 当前播放时间
    duration = 0; // 歌曲总时长
    progressInterval!: number; // 进度条更新定时器

    constructor(private el: ElementRef) {}

    ngOnInit(): void {
        this.initThreeJS();
        this.createObjects();
        this.animate();
        this.initAudioPlayer();
    }

    private initAudioPlayer(): void {
        this.sound = new Howl({
            src: [this.audioFiles[this.currentIndex]],
            autoplay: true,
            loop: true,
            volume: this.volume / 100,
            onload: () => {
                this.duration = this.sound.duration();
            },
            onplay: () => {
                this.startProgressTimer();
            },
            onend: () => {
                this.clearProgressTimer();
            },
        });
    }

    private startProgressTimer(): void {
        this.clearProgressTimer();
        this.progressInterval = window.setInterval(() => {
            this.currentTime = this.sound.seek() || 0;
        }, 1000);
    }

    private clearProgressTimer(): void {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
    }

    seekAudio(value: number): void {
        if (this.sound) {
            this.sound.seek(value);
            this.currentTime = value;
        }
    }

    /**上一张 */
    prev(): void {
        this.currentIndex = Math.max(0, this.currentIndex - 1);
        this.playCurrentAudio();
    }

    /**下一张 */
    next(): void {
        this.currentIndex = Math.min(this.objects.length - 1, this.currentIndex + 1);
        this.playCurrentAudio();
    }

    private playCurrentAudio(): void {
        if (this.sound) {
            this.sound.stop();
            this.clearProgressTimer();
        }
        this.sound = new Howl({
            src: [this.audioFiles[this.currentIndex]],
            autoplay: true,
            volume: this.volume / 100,
            onload: () => {
                this.duration = this.sound.duration();
            },
            onplay: () => {
                this.startProgressTimer();
            },
            onend: () => {
                this.clearProgressTimer();
            },
        });
    }

    private initThreeJS(): void {
        const container = this.el.nativeElement.querySelector('.three-container');
        const width = container.clientWidth;
        const height = container.clientHeight;

        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);

        // 创建相机
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.z = 5;

        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        container.appendChild(this.renderer.domElement);
    }

    private createObjects(): void {
        const geometry = new THREE.PlaneGeometry(12, 6); // 使用平面几何体代替立方体
        this.imageUrls.forEach((url, i) => {
            this.textureLoader.load(url, texture => {
                texture.minFilter = THREE.LinearFilter;
                const material = new THREE.MeshBasicMaterial({
                    map: texture,
                    side: THREE.DoubleSide,
                });
                const plane = new THREE.Mesh(geometry, material);
                plane.position.x = (i - 2) * (1 * 1.1); // 间距为图片宽度的1.1倍
                this.objects.push(plane);
                this.scene.add(plane);
            });
        });
    }

    private animate(): void {
        this.rafId = requestAnimationFrame(() => this.animate());

        // 平滑过渡到当前选中对象
        this.objects.forEach((obj, i) => {
            const targetX = (i - this.currentIndex) * 9;
            obj.position.x += (targetX - obj.position.x) * 0.1;

            const isActive = i === this.currentIndex;
            const targetScale = isActive ? 1 : 0.7;
            const targetOpacity = isActive ? 1 : 0.5;
            const targetColor = isActive ? 0xffffff : 0x888888; // 非选中对象变灰
            const targetZ = isActive ? 0.1 : 0; // 选中图片z轴位置提高

            const material = obj.material as THREE.MeshBasicMaterial;
            material.opacity += (targetOpacity - material.opacity) * 0.1;
            material.color.lerp(new THREE.Color(targetColor), 0.1); // 颜色渐变
            obj.scale.x = obj.scale.y = obj.scale.z += (targetScale - obj.scale.x) * 0.1;
            obj.position.z += (targetZ - obj.position.z) * 0.1; // 平滑过渡z轴位置
        });

        this.renderer.render(this.scene, this.camera);
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this.isDragging = true;
        this.previousMousePosition = { x: event.clientX, y: event.clientY };
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (!this.isDragging) return;

        const deltaX = event.clientX - this.previousMousePosition.x;
        if (Math.abs(deltaX) > 50) {
            this.currentIndex += deltaX > 0 ? -1 : 1;
            this.currentIndex = Math.max(0, Math.min(this.objects.length - 1, this.currentIndex));
            this.previousMousePosition = { x: event.clientX, y: event.clientY };
        }
    }

    @HostListener('mouseup')
    onMouseUp(): void {
        this.isDragging = false;
    }

    @HostListener('window:resize')
    onWindowResize(): void {
        const container = this.el.nativeElement.querySelector('.three-container');
        const width = container.clientWidth;
        const height = container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    ngOnDestroy(): void {
        cancelAnimationFrame(this.rafId);
        this.renderer.dispose();
        this.clearProgressTimer();
    }
}
