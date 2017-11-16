var cas_e = {
    close: function(){
        $('body').find('.case').removeClass("show").addClass("hide");
        $('.skin').remove();
    },
    open: function(){
        $('body').prepend(`<div class="skin"></div>`);
        $('body').find('.case').removeClass("hide").addClass("show");
    }
};

$(function(){
    $(document).on('click','[data-case="show"]', function(){
        cas_e.close();
        cas_e.open();
    });

    $(document).on('click','[data-case="hide"]', function(){
        cas_e.close();
    });

    $(document).on('click','[data-case="close"]', function(){
        cas_e.close();
    });

    $(document).on('click','.skin', function(){
        cas_e.close();
    });
});