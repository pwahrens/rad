// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .
//= require highcharts
// to get the new features in 2.3.0:
//= require highcharts/highcharts-more

function startup(app, page) {
    var titleLarge = $(".title-large");

    if (app === "art-history") {
        titleLarge.text("Art history");
        colorControl("#F44336", page);
    } else if (app === "apex") {
        titleLarge.text("Apex");
        colorControl("#2196F3", page);
    } else if (app === "vegetarian") {
        titleLarge.text("Vegetarianism");
        colorControl("#4CAF50", page);
        if (page === "welcome") {
            vegetarianBarGraph();
            pieChart();
        }
    } else if (app === "error") {
        titleLarge.text("Error (" + page + ")");
        colorControl("#000", page);
    } else if (app === "laptop-orchestra") {
        titleLarge.text("Laptop orchestra");
        colorControl("#673AB7", page);
        var bttn1 = 0;
        var bttn2 = 0;
        var bttn3 = 0;
        var bttn4 = 0;
        var bttn5 = 0;
        var bttn6 = 0;

        var socket = io.connect("http://localhost:8080");
        socket.on("connect", function () {
            document.getElementById("song-button-1").onclick = function () {
                socket.emit("button_click_1");
            }
            document.getElementById("song-button-2").onclick = function () {
                socket.emit("button_click_2");
            }
            document.getElementById("song-button-3").onclick = function () {
                socket.emit("button_click_3");
            }
            document.getElementById("song-button-4").onclick = function () {
                socket.emit("button_click_4");
            }
            document.getElementById("song-button-5").onclick = function () {
                socket.emit("button_click_5");
            }
            document.getElementById("song-button-6").onclick = function () {
                socket.emit("button_click_6");
            }
            socket.on("connection_made", function () {
                document.getElementById("connection-status").style.backgroundColor = "#4CAF50";
                document.getElementById("connection-status").textContent = "Connected";
            });
            socket.on('disconnect', function () {
                document.getElementById("connection-status").style.backgroundColor = "#F44336";
                document.getElementById("connection-status").textContent = "Not connected";
            });
        });
        //accelerometer();
    }
    scrollControl(titleLarge);
    objectControl();
    finalModifications();
}
function colorControl(color, page) {
    var card = $(".card");
    $("#top-shadow").css("box-shadow", "0px 64px " + hexToRgbA(color, 0.8));
    $("#" + page + "-tab").css("color", color);
    $(".row-header").css("color", color);
    card.css("box-shadow", "0 0 2px " + color);
    card.on({
        mouseenter: function () {
            $(this).css("box-shadow", "0 0 4px " + color + ", 0 0 6px " + color);
        },
        mouseleave: function () {
            $(this).css("box-shadow", "0 0 2px " + color);
        }
    });
    $(".primary-color").css("background-color", color);
}
function objectControl() {
    var html = $("html");
    var menu = $("#menu");
    var cover = $("#cover");
    var button = $("#menu-button");
    var section = $(".menu-section");
    var container = $("#container");
    var topShadow = $("#top-shadow");

    function menuOpen(menu) {
        menu.css("transform", "translateX(248px)");
        cover.css("opacity", "1");
        html.css("overflow", "hidden");
        button.css("transform", "rotate(90deg)");
        container.css("filter", "blur(5px)");
        topShadow.css("display", "none");

        setTimeout(function () {
            menu.css("transition", "all 0.2s cubic-bezier(0.4, 0.0, 0.6, 1)");
            cover.css({
                "transition": "all 0.2s cubic-bezier(0.4, 0.0, 0.6, 1)",
                "pointer-events": "auto"
            });
        }, 200);
    };
    function menuClose(menu) {
        menu.css("transform", "translateX(-248px)");
        cover.css("opacity", "0");
        html.css("overflow", "");
        button.css("transform", "rotate(0deg)");
        container.css("filter", "");
        topShadow.css("display", "block");

        setTimeout(function () {
            menu.css("transition", "all 0.2s cubic-bezier(0.0, 0.0, 0.2, 1)");
            cover.css({
                "transition": "all 0.2s cubic-bezier(0.0, 0.0, 0.2, 1)",
                "pointer-events": "none"
            });
        }, 200);
    };

    button.click(function () {
        menuOpen(menu);
    });
    section.on("click", function () {
        var selected = $(this).next();
        selected.toggleClass("sub-menu-expanded");
        section.css("background-color", "#fff");
        $(this).css("background-color", "#f2f2f2");
    });
    $(document).mouseup(function (e) {
        if (!section.is(e.target) && section.has(e.target).length === 0) {
            section.css("background-color", "#fff");
        }
    });
    cover.click(function () {
        menuClose(menu);
    });
    cover.on("touchstart", function () {
        menuClose(menu);
    });
    window.addEventListener("resize", function () {
        if (button.css("display") == "none") { //TODO reduce the redundancy of this function in particular
            menu.css("transform", "translateX(0)");
            cover.css("opacity", "0");
            html.css("overflow", "");
            container.css("filter", "");
            topShadow.css("display", "block");
            button.css("transform", "rotate(0deg)");
            setTimeout(function () {
                menu.css("transition", "all 0.2s cubic-bezier(0.0, 0.0, 0.2, 1)");
                cover.css({
                    "transition": "all 0.2s cubic-bezier(0.0, 0.0, 0.2, 1)",
                    "pointer-events": "none"
                });
            }, 200);
        } else {
            menu.css("transform", "translateX(-248px)");
            cover.css("opacity", "0");
            html.css("overflow", "");
            container.css("filter", "");
            topShadow.css("display", "block");
            button.css("transform", "rotate(0deg)");
            setTimeout(function () {
                menu.css("transition", "all 0.2s cubic-bezier(0.0, 0.0, 0.2, 1)");
                cover.css({
                    "transition": "all 0.2s cubic-bezier(0.0, 0.0, 0.2, 1)",
                    "pointer-events": "none"
                });
            }, 200);
        }
    });
}
function scrollControl(titleLarge) {
    var scrollTop;
    var view = $(window);
    var topShadow = $("#top-shadow");

    view.scroll(function () {
        scrollTop = view.scrollTop();
        if (scrollTop <= 34) {
            var title = $(".title");
            title.addClass("title-large");
            title.removeClass("title");
        } else {
            titleLarge.addClass("title");
            titleLarge.removeClass("title-large");
        }
        if ($("#top-bar").css("height") == "256px") {
            if (scrollTop > 208) {
                topShadow.css("opacity", "1");
            } else if (scrollTop <= 208) {
                topShadow.css("opacity", "0");
            }
        } else {
            if (scrollTop > 80) {
                topShadow.css("opacity", "1");
            } else if (scrollTop <= 80) {
                topShadow.css("opacity", "0");
            }
        }
    });
    window.addEventListener("load", function () {
        setTimeout(function () {
            window.scrollTo(0, 1);
        }, 0);
    });
}

function finalModifications() {
    $("#bottom-filler").appendTo("#container");
}
/*
 function vegetarianBarGraph() {
 $('#vegetarian-bar-graph').highcharts({
 chart: {
 reflow: false,
 style: {
 fontFamily: 'Roboto, sans-serif'
 },
 type: 'column'
 },
 title: {
 text: 'Reasoning behind becoming vegetarian'
 },
 subtitle: {
 text: 'Source: www.statisticbrain.com/',
 x: -20
 },
 xAxis: {
 type: 'category'
 },
 yAxis: {
 title: {
 text: 'Percentage of individuals'
 }

 },
 legend: {
 enabled: false
 },
 plotOptions: {
 series: {
 borderWidth: 0,
 dataLabels: {
 enabled: true,
 format: '{point.y:.1f}%'
 }
 }
 },

 tooltip: {
 headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
 pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
 },
 series: [{
 name: 'Reasons',
 colorByPoint: true,
 data: [{
 name: 'Animal welfare',
 y: 54,
 color: '#2196F3'
 }, {
 name: 'Improve overall health',
 y: 53,
 color: '#000000'
 }, {
 name: 'Environmental concerns',
 y: 47,
 color: '#4CAF50'
 }, {
 name: 'Natural approach to wellness',
 y: 39,
 color: '#FF9800'
 }, {
 name: 'Food-safety concerns',
 y: 31,
 color: '#9C27B0'
 }, {
 name: 'Weight loss',
 y: 25,
 color: '#F44336'
 }, {
 name: 'Weight maintenance',
 y: 24,
 color: '#FFEB3B'
 }]
 }],
 });
 }
 function pieChart() {
 $('#pie-chart').highcharts({
 chart: {
 reflow: false,
 style: {
 fontFamily: 'Roboto, sans-serif'
 },
 plotBackgroundColor: null,
 plotBorderWidth: null,
 plotShadow: false,
 type: 'pie'
 },
 title: {
 text: 'Diet statistics in America during 2012'
 },
 subtitle: {
 text: 'Source: www.vegetariantimes.com/',
 x: -20
 },
 tooltip: {
 pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
 },
 plotOptions: {
 pie: {
 allowPointSelect: true,
 cursor: 'pointer',
 dataLabels: {
 enabled: false
 },
 showInLegend: true
 }
 },
 series: [{
 name: 'Diets',
 colorByPoint: true,
 data: [{
 name: 'Everyone else',
 y: 86.3,
 color: '#F44336'
 }, {
 name: 'Vegetarian-inclined',
 y: 10,
 sliced: true,
 selected: true,
 color: '#4CAF50'
 }, {
 name: 'Vegetarian',
 y: 3.2,
 color: '#2196F3'
 }, {
 name: 'Vegan',
 y: 0.5,
 color: '#FFEB3B'
 }]
 }]
 });
 }

 function accelerometer() {
 if (window.DeviceMotionEvent != undefined) {
 var aX = $("#acceleration-x");
 var aY = $("#acceleration-y");
 var aZ = $("#acceleration-z");
 var rA = $("#rotation-alpha");
 var rB = $("#rotation-beta");
 var rG = $("#rotation-gamma");
 var accelerationX;
 var accelerationY;
 var accelerationZ;
 var rotationAlpha;
 var rotationBeta;
 var rotationGamma;

 window.ondevicemotion = function (e) {
 accelerationX = e.accelerationIncludingGravity.x;
 accelerationY = e.accelerationIncludingGravity.y;
 accelerationZ = e.accelerationIncludingGravity.z;
 rotationAlpha = e.rotationRate.alpha;
 rotationBeta = e.rotationRate.beta;
 rotationGamma = e.rotationRate.gamma;

 aX.text(accelerationX);
 aY.text(accelerationY);
 aZ.text(accelerationZ);

 if (e.rotationRate) {
 rA.text(rotationAlpha);
 rB.text(rotationBeta);
 rG.text(rotationGamma);
 }

 }
 $('#laptop-orchestra-bar-graph').highcharts({
 chart: {
 reflow: false,
 style: {
 fontFamily: 'Roboto, sans-serif'
 },
 polar: true,
 animation: Highcharts.svg, // don't animate in old IE
 events: {
 load: function () {
 var series = this.series[0];
 setInterval(function () {
 if (accelerationX != null) {
 series.data[0].update(accelerationX);
 } else {
 series.data[0].update(Math.random());
 }
 if (accelerationY != null) {
 series.data[1].update(accelerationY);
 } else {
 series.data[1].update(Math.random());
 }
 if (accelerationZ != null) {
 series.data[2].update(accelerationZ);
 } else {
 series.data[2].update(Math.random());
 }
 if (rotationAlpha != null) {
 series.data[4].update(rotationAlpha);
 } else {
 series.data[3].update(Math.random());
 }
 if (rotationBeta != null) {
 series.data[4].update(rotationBeta);
 } else {
 series.data[4].update(Math.random());
 }
 if (rotationGamma != null) {
 series.data[5].update(rotationGamma);
 } else {
 series.data[5].update(Math.random());
 }
 }, 166);
 }
 }
 },
 pane: {
 startAngle: -30
 },
 plotOptions: {
 series: {
 pointStart: 0,
 pointInterval: 60
 },
 column: {
 pointPadding: 0,
 groupPadding: 0
 }
 },
 title: {
 text: 'Acceleration and rotation data'
 },
 xAxis: {
 categories: ['X', 'Y', 'Z', 'α', 'β', 'γ'],
 },
 yAxis: {
 labels: {enabled: false},
 gridLineWidth: 0,
 minorGridLineWidth: 0,
 title: {
 text: ''
 }
 },
 tooltip: {
 enabled: false
 },
 legend: {
 enabled: false
 },
 exporting: {
 enabled: false
 },
 series: [{
 type: 'column',
 data: (function () {
 var data = [];
 var colors = ['#FFEB3B', '#FF9800', '#F44336', '#3F51B5', '#2196F3', '#4CAF50'];
 for (var i = 0; i < 6; i++) {
 data.push({
 x: i,
 y: 0,
 color: colors[i]
 });
 }
 return data;
 }())
 }]
 });
 }
 }
 */
function hexToRgbA(hex, opacity) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
    }
    throw new Error('Bad Hex');
}
