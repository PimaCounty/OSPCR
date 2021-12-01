/*
 START all functions (like click-handlers) that need to occur at page load here
*/

$(document).ready(() => {
    setEnvironmentBanner();

    $(document).ajaxStart(() => {
        startLoading("#allcontent");
        //startLoading(document.body);
    });
    //----------------------------------------------
    $(document).ajaxStop(() => {
        stopLoading("#allcontent");
        //stopLoading(document.body);
    });

    // on accordion expand/collapse change glyphicon
    $('.card-header').click(() => {
        let selectedID = $(this).find('span').attr("id");

        $(this).find('span').toggleClass('glyphicons-plus glyphicons-minus');

        $("span").each(() => {
            if ($(this).hasClass("glyphicons glyphicons-bold") && $(this).attr("id") != selectedID) {
                $(this).removeClass().addClass("glyphicons glyphicons-bold glyphicons-plus float-right");
            }
        });
    });
});

/*
 END all functions (like click-handlers) that need to occur at page load here
*/

/*
 START all load-independent functions
*/

function startLoading(target) {
    kendo.ui.progress($(target), true);
    //Scroll so that the spinner is centered on the screen
    let height = $(target).height();
    height = (height / 2) + $(target).offset().top;
    height = height - ($(window).height() / 2);
    window.scrollTo(0, height);
}

/* Remove the loading icon and Un-Block the entire page*/
function stopLoading(target) {
    kendo.ui.progress($(target), false)
}

/*
 END all load-independent functions
*/
