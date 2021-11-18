// ==UserScript==
// @name         YouTube Normal Thumbnails
// @namespace    http://greasyfork.org
// @version      0.7.1
// @description  Restores normal thumbnails size
// @author       NeoCortex
// @license      MIT
// @match        *://www.youtube.com/*
// @match        *://youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    const styles = `
    ytd-rich-grid-video-renderer[mini-mode] #video-title.ytd-rich-grid-video-renderer {
        font-size: 1.4rem;
        font-weight: 500;
        line-height: 1.6rem;
    }

    #avatar-link.ytd-rich-grid-video-renderer {
        display: none !important;
    }

    ytd-video-renderer[use-prominent-thumbs] ytd-thumbnail.ytd-video-renderer {
        min-width: 120px !important;
        max-width: 240px !important;
    }
    `.trim()

    class YoutubeThumbnailsFixer {
        constructor() {
            this.replaceMathMin()
            document.addEventListener("DOMContentLoaded", () => this.installStyle(styles))
        }

        private replaceMathMin(): void {
            const origMathMin = Math.min
            function modifiedMathMin () {
                if (/calcElementsPerRow/img.test(Error().stack || '')) {
                    return origMathMin.apply(Math, (arguments as unknown) as Array<number>) + 1
                }
        
                return origMathMin.apply(Math, (arguments as unknown) as Array<number>)
            }
            Math.min = modifiedMathMin
        }

        private installStyle(contents: string): void {
            let style = document.createElement('style')
            style.innerHTML = contents
            document.body.appendChild(style)
        }
    }

    new YoutubeThumbnailsFixer()
})();
