(function () {
    function ensureTopToolsHost() {
        var host = document.getElementById("page-tools-top");

        if (!host) {
            host = document.createElement("div");
            host.id = "page-tools-top";
            host.className = "page-tools-top";
            document.body.insertBefore(host, document.body.firstChild);
        }

        return host;
    }

    function exportCurrentPageAsPdf() {
        window.print();
    }

    function useLowDPI() {
        Array.prototype.forEach.call(document.getElementsByTagName("img"), function (img) {
            img.src = img.src.replace("/svg/", "/lowdpi/");
        });
        document.getElementById("highdpi").style.display = "inline";
        document.getElementById("lowdpi").style.display = "none";
    }

    function switchToLowDPI() {
        useLowDPI();
        localStorage.setItem("dpi", "low");
    }

    function useHighDPI() {
        Array.prototype.forEach.call(document.getElementsByTagName("img"), function (img) {
            var highDpiSrc = img.src.replace("/lowdpi/", "/svg/");
            if (img.src !== highDpiSrc) {
                img.src = highDpiSrc;
            }
        });
        document.getElementById("highdpi").style.display = "none";
        document.getElementById("lowdpi").style.display = "inline";
    }

    function switchToHighDPI() {
        useHighDPI();
        localStorage.setItem("dpi", "high");
    }

    function initDpiToggle() {
        var host = document.getElementById("dpi-toggle");
        var topToolsHost;
        if (!host) {
            return;
        }

        topToolsHost = ensureTopToolsHost();

        host.innerHTML = "";
        topToolsHost.innerHTML =
            '<div class="page-actions page-actions-top">' +
            '<a href="javascript:switchToHighDPI()" id="highdpi">Switch to High-DPI</a>' +
            '<a href="javascript:switchToLowDPI()" id="lowdpi">Switch to Low-DPI</a>' +
            '<a href="javascript:exportCurrentPageAsPdf()" id="exportpdf">Export current page as PDF</a>' +
            '</div>';

        useHighDPI();
        if (localStorage.getItem("dpi") === "low") {
            useLowDPI();
        }
    }

    window.switchToLowDPI = switchToLowDPI;
    window.switchToHighDPI = switchToHighDPI;
    window.exportCurrentPageAsPdf = exportCurrentPageAsPdf;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initDpiToggle);
    } else {
        initDpiToggle();
    }
})();
