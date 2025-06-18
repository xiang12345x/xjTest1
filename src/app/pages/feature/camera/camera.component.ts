import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { renderAsync } from 'docx-preview';
import { gsap } from 'gsap';

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

  /**动画测试按钮 */
  btnIfy = {
    btn1Click: () => {
      gsap.to('.btn1', {
        duration: 0.3,
        y: -10, // 向上移动
        scale: 1.1, // 放大
        ease: 'back.out(1.7)',
        yoyo: true, // 返回原位置
        repeat: 1, // 重复1次
      });
    },
  };

  async previewWord(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // 清空预览容器
      this.previewContainer.nativeElement.innerHTML = '';

      // 添加强制样式重置
      this.previewContainer.nativeElement.className = 'docx-preview-container';

      // 添加强制样式
      setTimeout(() => {
        const docxElements = this.previewContainer.nativeElement.querySelectorAll('.docx-wrapper, .docx');
        docxElements.forEach((el: any) => {
          el.style.padding = '20px';
          el.style.width = '100%';
        });
      }, 100);

      // 使用docx-preview渲染Word文档
      await renderAsync(file, this.previewContainer.nativeElement, undefined, {
        className: 'docx',
        inWrapper: false,
        ignoreWidth: true, // 忽略原始宽度
        ignoreHeight: true, // 忽略原始高度
        breakPages: true, // 启用分页
        experimental: true, // 启用实验性优化
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

  ngOnInit(): void {
    /**卡片入场效果 */
    gsap.from('.card', {
      duration: 1.5,
      opacity: 0, // 从完全透明到当前透明度
      y: 100, // 从下方100px移动到当前位置
      rotation: -15, // 初始旋转角度
      ease: 'elastic.out(1, 0.3)',
    });

    // 进度条加载
    gsap.fromTo(
      '.progress-bar',
      { width: '0%' }, // 起始状态
      {
        width: '100%', // 结束状态
        duration: 3,
        ease: 'power1.inOut',
        onUpdate: function () {
          console.log(this.progress()); // 输出动画进度
        },
      }
    );

    // 创建自定义贝塞尔曲线
    gsap.registerEase('myEase', 'M0,0 C0.12,0 0.25,1 1,1' as any);

    gsap.to('.btn2', {
      x: 500,
      ease: 'myEase',
      duration: 2,
    });
  }

  ngOnDestroy() {
    this.stopCamera();
  }
}
