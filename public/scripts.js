function startup(app, page) {
    var titleLarge = $(".title-large")
    switch (app) {
        case "home":
        titleLarge.text("Home")
        colorControl("#2196F3", app, page)
        break
        case "art-history":
        titleLarge.text("Art History")
        colorControl("#F44336", app, page)
        break
        case "error":
        titleLarge.text("Error")
        colorControl("#000", app, page)
        break
        case "laptop-orchestra":
        titleLarge.text("Laptop Orchestra")
        colorControl("#673AB7", app, page)
        break
        case "vegetarianism":
        titleLarge.text("Vegetarianism")
        colorControl("#4CAF50", app, page)
        vegetarianBarGraph()
        pieChart()
        break
        default:
        titleLarge.text("Error: app has not yet been assigned a case")
        colorControl("#000", app, page)
        break
    }
    scrollControl(titleLarge)
    $("#bottom-filler").clone().appendTo("#container")
}

function colorControl(color, app, page) {
    var card = $(".card")
    $("#top-shadow").css("box-shadow", "0px 64px " + hexToRgbA(color, 0.8))
    $("#" + app + "-" + page + "-tab").css("color", color)
    $(".row-header").css("color", color)
    card.css("box-shadow", "0 0 2px " + color)
    card.on({
        mouseenter: function () {
            $(this).css("box-shadow", "0 0 4px " + color + ", 0 0 6px " + color)
        },
        mouseleave: function () {
            $(this).css("box-shadow", "0 0 2px " + color)
        }
    })
    $(".primary-color").css("background-color", color)
}

function scrollControl(titleLarge) {
    var scrollTop
    var view = $(window)
    var topShadow = $("#top-shadow")
    view.scroll(function () {
        scrollTop = view.scrollTop()
        if (scrollTop <= 34) {
            var title = $(".title")
            title.addClass("title-large")
            title.removeClass("title")
        } else {
            titleLarge.addClass("title")
            titleLarge.removeClass("title-large")
        }

        if (scrollTop > 80) {
            topShadow.css("opacity", "1")
        } else if (scrollTop <= 80) {
            topShadow.css("opacity", "0")
        }
    })
    window.addEventListener("load", function () {
        setTimeout(function () {
            window.scrollTo(0, 1)
        }, 0)
    })
}

// This is not a function I wrote myself and I do not know where it came from
function hexToRgbA(hex, opacity) {
    var c
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('')
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]]
        }
        c = '0x' + c.join('')
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')'
    }
    throw new Error('Bad Hex')
}
