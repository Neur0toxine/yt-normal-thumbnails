// ==UserScript==
// @name         YouTube Normal Thumbnails
// @namespace    http://greasyfork.org
// @version      0.6.0
// @description  Restores normal thumbnails size
// @author       NeoCortex
// @match        *://www.youtube.com/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function () {
    const perRowProperty = '--ytd-rich-grid-items-per-row';
    const styleContent = `
    ytd-rich-grid-video-renderer[mini-mode] #video-title.ytd-rich-grid-video-renderer {
        font-size: 1.4rem;
        font-weight: 500;
        line-height: 1.6rem;
    }

    #avatar-link.ytd-rich-grid-video-renderer {
        display: none !important;
    }
    `.trim();

    class YoutubeThumbnailsFixer {
        private oldPerRow?: number;
        private observer?: MutationObserver;
        private target?: HTMLElement;
        private videoObserverConfig = {
            attributes: true,
            childList: false,
            subtree: false
        };

        constructor() {
            this.installContentObserver();
        }

        private installContentObserver(): void {
            this.observer = new MutationObserver((mutationsList, observer) => {
                this.target = document.querySelector('ytd-rich-grid-renderer') as HTMLElement;

                if (null !== this.target) {
                    this.observer?.disconnect();
                    this.installStyle();
                    this.updateRowsCount();
                    this.installVideoGridObserver();
                }
            });
            this.observer.observe(document.getElementById('content') as Node, {
                attributes: false,
                childList: true,
                subtree: true
            });
        }

        private installVideoGridObserver(): void {
            if (this.isNil(this.target)) {
                return;
            }

            this.observer = new MutationObserver((mutationsList, observer) => {
                for (let mutation of mutationsList) {
                    if (mutation.attributeName == 'style') {
                        this.observer?.disconnect();
                        this.updateRowsCount();
                        this.observer?.observe(this.target as Node, this.videoObserverConfig);
                    }
                }
            });
            this.observer?.observe(this.target as Node, this.videoObserverConfig);
            console.info(`[YouTube Normal Thumbnails] Changed to ${this.currentPerRow} thumbnails per row instead of ${this.oldPerRow}.`);
        }

        private updateRowsCount(): void {
            if (this.isNil(this.target)) {
                return;
            }

            try {
                if (this.oldPerRow === undefined || this.oldPerRow == this.currentPerRow || this.oldPerRow === 0) {
                    this.oldPerRow = this.currentPerRow;
                    this.currentPerRow += 1;
                }
            } catch (e) {
                console.warn(`[YouTube Normal Thumbnails] Cannot update thumbnails count: ${e}`)
            }
        }

        private installStyle(): void {
            let style = document.createElement('style');
            style.innerHTML = styleContent;
            document.body.appendChild(style);
        }

        private isNil(item: any): boolean {
            return null === item || undefined === item;
        }

        get currentPerRow(): number {
            if (this.isNil(this.target)) {
                return 0;
            }

            return +(this.target as HTMLElement).style.getPropertyValue(perRowProperty);
        }

        set currentPerRow(value: number) {
            this.target?.style.setProperty(perRowProperty, String(value));
        }
    }

    new YoutubeThumbnailsFixer();
})();