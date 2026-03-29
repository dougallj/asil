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

    function setDisplayByClass(className, value) {
        Array.prototype.forEach.call(document.getElementsByClassName(className), function (element) {
            element.style.display = value;
        });
    }

    function exportCurrentPageAsPdf() {
        window.print();
    }

    function getStoredHideUnavailablePreference() {
        return localStorage.getItem("hideUnavailable") === "1";
    }

    function shouldHideUnavailable() {
        var toggle = document.getElementById("hideUnavailable");
        if (toggle) {
            return toggle.checked;
        }
        return getStoredHideUnavailablePreference();
    }

    function syncUnavailableVisibility() {
        Array.prototype.forEach.call(document.getElementsByClassName("unavailable"), function (element) {
            element.classList.toggle("hidden-unavailable", shouldHideUnavailable());
        });
        Array.prototype.forEach.call(document.querySelectorAll(".group:not(.unavailable)"), function (element) {
            element.classList.remove("hidden-unavailable");
        });
    }

    function refreshAvailabilityRows() {
        var hideUnavailable = shouldHideUnavailable();

        syncUnavailableVisibility();

        Array.prototype.forEach.call(document.querySelectorAll("table.t tr"), function (row) {
            var groups = row.getElementsByClassName("group");
            var hasVisibleGroup = false;

            row.classList.remove("row-hidden-unavailable");

            if (!groups.length || !hideUnavailable) {
                return;
            }

            Array.prototype.forEach.call(groups, function (group) {
                if (!group.classList.contains("hidden-unavailable")) {
                    hasVisibleGroup = true;
                }
            });

            if (!hasVisibleGroup) {
                row.classList.add("row-hidden-unavailable");
            }
        });

        Array.prototype.forEach.call(document.querySelectorAll("table.t"), function (table) {
            var rowsWithGroups = Array.prototype.filter.call(table.getElementsByTagName("tr"), function (row) {
                return row.getElementsByClassName("group").length > 0;
            });
            var hasVisibleRow = rowsWithGroups.some(function (row) {
                return !row.classList.contains("row-hidden-unavailable");
            });

            table.classList.toggle("table-hidden-unavailable", hideUnavailable && rowsWithGroups.length > 0 && !hasVisibleRow);
        });

        Array.prototype.forEach.call(document.querySelectorAll("h2, h3"), function (heading) {
            var next = heading.nextElementSibling;
            if (!next || next.tagName !== "TABLE" || !next.classList.contains("t")) {
                heading.classList.remove("heading-hidden-unavailable");
                return;
            }
            heading.classList.toggle("heading-hidden-unavailable", next.classList.contains("table-hidden-unavailable"));
        });
    }

    function switchToLong() {
        setDisplayByClass("l", "inline");
        setDisplayByClass("s", "none");
        document.getElementById("shortasm").style.display = "inline";
        document.getElementById("longasm").style.display = "none";
        localStorage.setItem("longasm", "long");
    }

    function switchToShort() {
        setDisplayByClass("s", "inline");
        setDisplayByClass("l", "none");
        document.getElementById("longasm").style.display = "inline";
        document.getElementById("shortasm").style.display = "none";
        localStorage.setItem("longasm", "short");
    }

    function initAsmToggle() {
        var host = document.getElementById("asm-toggle");
        var hideUnavailableToggle;
        var topToolsHost;
        var html;
        var topToolsHtml;
        if (!host) {
            return;
        }

        topToolsHost = ensureTopToolsHost();

        html =
            '<div class="page-actions page-actions-footer">' +
            '<a href="javascript:switchToLong()" id="longasm" style="color:#000">Switch to long assembly</a>' +
            '<a href="javascript:switchToShort()" id="shortasm" style="color:#000;display:none">Switch to short assembly</a>';

        html += "</div>";

        topToolsHtml = '<div class="page-actions page-actions-top">';

        if (typeof window.updateHighlighting === "function") {
            topToolsHtml +=
                '<label class="page-actions-toggle">' +
                '<input type="checkbox" id="hideUnavailable">' +
                ' Hide unavailable instructions' +
                '</label>';
        }

        topToolsHtml += '<a href="javascript:exportCurrentPageAsPdf()" id="exportpdf" style="color:#000">Export current page as PDF</a></div>';

        host.innerHTML = html;
        topToolsHost.innerHTML = topToolsHtml;

        if (localStorage.getItem("longasm") === "long") {
            switchToLong();
        }

        hideUnavailableToggle = document.getElementById("hideUnavailable");
        if (hideUnavailableToggle) {
            hideUnavailableToggle.checked = getStoredHideUnavailablePreference();
            hideUnavailableToggle.addEventListener("change", function () {
                localStorage.setItem("hideUnavailable", hideUnavailableToggle.checked ? "1" : "0");
                if (typeof window.updateHighlighting === "function") {
                    window.updateHighlighting();
                } else {
                    refreshAvailabilityRows();
                }
            });

            refreshAvailabilityRows();
        }
    }

    window.switchToLong = switchToLong;
    window.switchToShort = switchToShort;
    window.exportCurrentPageAsPdf = exportCurrentPageAsPdf;
    window.shouldHideUnavailable = shouldHideUnavailable;
    window.refreshAvailabilityRows = refreshAvailabilityRows;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAsmToggle);
    } else {
        initAsmToggle();
    }
})();
