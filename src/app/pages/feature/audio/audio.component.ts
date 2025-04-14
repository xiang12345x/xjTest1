import { Component, OnInit, OnDestroy, ElementRef, HostListener } from '@angular/core';
import * as THREE from 'three';

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
    private currentIndex = 0;
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

    constructor(private el: ElementRef) {}

    ngOnInit(): void {
        this.initThreeJS();
        this.createObjects();
        this.animate();
    }

    /**上一张 */
    prev(): void {
        this.currentIndex = Math.max(0, this.currentIndex - 1);
    }

    /**下一张 */
    next(): void {
        this.currentIndex = Math.min(this.objects.length - 1, this.currentIndex + 1);
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
    }
}
