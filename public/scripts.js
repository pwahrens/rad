function startup(app, page) {
    var titleLarge = $(".title-large");
    switch (app) {
        case "home":
            titleLarge.text("Home");
            colorControl("#2196F3", page);
            break;
        case "art-history":
            titleLarge.text("Art history");
            colorControl("#F44336", page);
            break;
        case "error":
            titleLarge.text("Error: (" + page + ")");
            colorControl("#000", page);
            break;
        case "laptop-orchestra":
            titleLarge.text("Laptop orchestra");
            colorControl("#673AB7", page);
            if (page === "") {
                accelerometer();
            }
            break;
        case "web-assets":
            titleLarge.text("Web assets");
            colorControl("#009688", page);
            break;
        case "vegetarian":
            titleLarge.text("Vegetarianism");
            colorControl("#4CAF50", page);
            if (page === "welcome") {
                vegetarianBarGraph();
                pieChart();
            }
            break;
        default:
            titleLarge.text("Error: app has not yet been assigned a case");
            colorControl("#000", page);
            break;
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
        if (button.css("display") == "none") {
            menu.css("transform", "translateX(0)");
        } else {
            menu.css("transform", "translateX(-248px)");
        }
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
    cover.click(function () {
        menuClose(menu);
    });
    cover.on("touchstart", function () {
        menuClose(menu);
    });
    window.addEventListener("resize", function () {
        menuClose(menu);
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
function finalModifications() {
    $("#bottom-filler").appendTo("#container");
}