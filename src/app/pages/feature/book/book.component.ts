import { Component, OnInit } from '@angular/core';

interface Book {
    title: string;
    content: string;
    cover: string;
    path: string;
}

@Component({
    selector: 'xj-book',
    templateUrl: './book.component.html',
    styleUrls: ['./book.component.scss'],
})
export class BookComponent implements OnInit {
    books: Book[] = [
        {
            title: '圣墟',
            content: '',
            cover: 'assets/books/圣墟.jpg',
            path: 'assets/books/圣墟.txt',
        },
    ];
    selectedBook: Book | null = null;
    bgColor = '#ffffff';
    fontSize = 16;
    chapters: { title: string; position: number; content: string }[] = []; // 新增章节列表
    currentChapterIndex = 0; // 当前章节索引
    loading = false; // 加载状态
    loadingText = '书籍内容加载中...'; // 加载提示文本

    constructor() {}

    ngOnInit(): void {
        this.loadLocalBooks();
    }

    async loadLocalBooks() {
        this.loading = true; // 开始加载
        try {
            // 从assets/books目录加载TXT文件
            const response = await fetch('assets/books/book-list.json');
            const bookList = await response.json();

            this.books = await Promise.all(
                bookList.map(async (book: any) => {
                    const content = await this.loadBookContent(book.path);
                    return {
                        title: book.title,
                        content: content,
                        cover: book.cover || 'assets/background/7.jpeg',
                    };
                })
            );
            this.selectedBook = this.books[0]; // 默认选中第一个书籍
            if (this.selectedBook) {
                this.jumpToChapter(0); // 跳转到第一章
            }
        } catch (error) {
            console.error('加载书籍失败:', error);
        }
        this.loading = false; // 加载完成
    }

    async loadBookContent(path: string): Promise<string> {
        const response = await fetch(`assets/books/${path}`);
        const content = await response.text();
        this.parseChapters(content); // 解析章节
        return content;
    }

    // 新增方法：解析章节
    private parseChapters(content: string) {
        this.chapters = [];
        // 常见章节标题正则表达式（可根据实际书籍格式调整）
        const chapterRegex = /^(第[一二三四五六七八九十百千万零]+章|\d+\.\d+|\d+、)[^\n]+/gm;
        let match;
        let lastPos = 0;

        while ((match = chapterRegex.exec(content)) !== null) {
            this.chapters.push({
                title: match[0].trim(),
                position: match.index,
                content: '', // 内容将在跳转时加载
            });

            lastPos = match.index + match[0].length;
        }
    }

    // 新增方法：跳转到指定章节
    jumpToChapter(index: number) {
        this.currentChapterIndex = index;
        if (!this.chapters[index].content && this.selectedBook) {
            this.chapters[index].content = this.getChapterContent(index);
        }
    }

    private getChapterContent(index: number): string {
        if (!this.selectedBook || index >= this.chapters.length - 1) {
            return this.chapters[index].content || '';
        }

        const startPos = this.chapters[index].position;
        const endPos = this.chapters[index + 1].position;
        return this.selectedBook.content.substring(startPos, endPos);
    }

    prevChapter() {
        if (this.currentChapterIndex > 0) {
            this.jumpToChapter(this.currentChapterIndex - 1);
        }
    }

    nextChapter() {
        if (this.currentChapterIndex < this.chapters.length - 1) {
            this.jumpToChapter(this.currentChapterIndex + 1);
            // 滚动到顶部
            const contentElement = document.querySelector('.right nz-card');
            if (contentElement) {
                contentElement.scrollTop = 0;
            }
        }
    }

    /**侧边栏显示 */
    sidebarVisible = true;
    /**切换侧边栏显示 */
    toggleSidebar() {
        this.sidebarVisible = !this.sidebarVisible;
    }

    async selectBook(book: Book) {
        if (this.selectedBook === book) {
            this.selectedBook = null;
            return;
        }
        this.selectedBook = book;
    }
}
