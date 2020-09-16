(function() {
    var styleN = document.createElement("style");
    var width = document.documentElement.clientWidth / 23;
    styleN.innerHTML = 'html{font-size:' + width + 'px!important}';
    document.head.appendChild(styleN);
    window.onresize = function() {
        var styleN = document.createElement("style");
        var width = document.documentElement.clientWidth / 23;
        styleN.innerHTML = 'html{font-size:' + width + 'px!important}';
        document.head.appendChild(styleN);
    }
})();