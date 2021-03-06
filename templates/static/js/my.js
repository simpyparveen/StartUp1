/*
 * Javascript functions for CoreLogs.com
 *
 * Date: 22-06-2015
 */


$('.qa_wyg').trumbowyg({
      btns: [
        // ['viewHTML'],
        // ['formatting'],
        'btnGrp-semantic',
        ['superscript', 'subscript'],
        ['link'],
        ['insertImage'],
        'btnGrp-lists',
        'btnGrp-justify',
        ['horizontalRule'],
        ['removeformat'],
        ['fullscreen']
      ]
    });

$('.wyg').trumbowyg({
      btns: [
        ['formatting'],
        'btnGrp-semantic',
        ['superscript', 'subscript'],
        ['link'],
        ['insertImage'],
        'btnGrp-lists',
        'btnGrp-justify',
        ['horizontalRule'],
        ['removeformat'],
        // ['fullscreen']
      ]
    });

/* global parameters */

$(function () {
  $('[data-toggle="popover"]').popover();
});

var top_nav_width, win_width, win_height, foot_height, mid_wide, side_wide;

/* function to initialize some global parameters */
function measure() {
    top_nav_width = $('#top_nav').outerHeight(true);
    win_width = $(window).width();
    win_height = $(window).height();
    foot_height = $('footer').outerHeight(true);
    left_right();
    body_slide();
}

/* function to auto adjust top margin for the body */
function body_slide() {
    $('.body').stop().animate({
        //'margin-top': top_nav_width,
        'min-height': (win_height - top_nav_width)
    });
}

/* function to adjust left and right menus */
function left_right(){
    $mid_body = $('.mid_body');
    if ($mid_body.length){
        $parent = $mid_body.parent();
        $side_body = $('.side_body');
        mid_wide = $mid_body.outerWidth();
        side_wide = ($parent.width() - mid_wide)/2;
        side_aithan = $side_body.find('.aithan').data('aithan');
        if (side_wide < side_aithan){
            $side_body.css('width', side_wide).addClass('hide');
        }
        else{
            $side_body.css('width', side_wide).removeClass('hide');
        }
        console.log($mid_body.parent().width(), mid_wide, side_wide, side_aithan);
    }
}

/* call body_slide when the window loads or resizes */
$(measure);
$(window).on('resize', measure);


/* handling input for dynamiac search inputs */
function doneTyping() {
    d_on = true;
    var $this = d_this;
    var $d_search = $this.closest('.d_search');
    var query = $this.val(),
        search = "/search" + $this.data('search') + "/";
    var type = $d_search.find('.d_type').val();
    console.log(type);
    if (!type)
        type = '';
    if (query.length < 3){
        console.log('e to chotu h');
        d_on = false;
    }
    if (d_on) {
        //d_on = false;
        $d_search.find('.create').addClass('hide');
        $this.siblings('.form-control-feedback').children('.fback_wait').removeClass('hide');
        console.log(query, search, type);
        $.ajax({
            url: search,
            type: "GET",
            data: {
                'the_query': query,
                'the_type': type
            },
            success: function(result) {
                //d_on = true;
                // console.log(result);
                $d_search.find('.dropdown')
                    .find(".d_list").html(result);
                $this.siblings('.form-control-feedback').children('.fback_wait').addClass('hide');
                $d_search.find('.create').removeClass('hide');
            },
            error: function(xhr, errmsg, err) {
                //d_on = true;
                $d_search.find('.dropdown')
                    .find(".d_list").html("<li class='list-group-item list-group-item-warning'>Sorry, unable to fetch results. Try later.</li>");
                console.log(errmsg, err);
                $this.siblings('.form-control-feedback').children('.fback_wait').addClass('hide');
            }
        });
    }
    if (query !== ''){
        $d_search.find('.dropdown').addClass('open');
        $d_search.find('.d_menu').css('z-index','1000');
    }
}

var typingTimer; //timer identifier
var doneTypingInterval = 500; //time in ms
var d_this;
var d_on = true;

function d_input_remove_error($this,sign,msg){
    if(sign){
        $this.closest('.d_search').removeClass('has-error');
        $this.closest('.form-group').find('.fback_warn').addClass('hide');
    }
    if(msg)
        $this.closest('.form-group').find('.fback_msg').addClass('hide');
}
function d_input_show_error($this,sign,msg){
    if(sign){
        $this.closest('.d_search').addClass('has-error');
        $this.closest('.form-group').find('.fback_warn').removeClass('hide');
    }
    if(msg)
        $this.closest('.form-group').find('.fback_msg').removeClass('hide');
}


$('body').on('keydown', '.d_input', function(event) {
    $(".d_input").on('blur', d_input_blur);
    var $this = $(this);
    d_input_remove_error($this,true,false);
    d_this = $this;
    $d_search = $this.closest('.d_search');
    if (event.keyCode == '13') {
        event.preventDefault();
        if ($d_search.find('.dropdown').attr('class').indexOf('open') >= 0){
            $d_search.find('.dropdown').find('.d_menu').find('.option').first().trigger('click');
        }
    }
    else {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    }
});


$('body').on('click', '.d_search .one_value .close', function() {
    $d_search = $(this).closest('.d_search');
    $d_search.find('.d_input').removeClass('hide').focus();
    $d_search.find('.d_value').val('');
    $(this).closest('.one_value').addClass('hide');
});

$("body").on('click', '.one_list .option', function(event) {
    //aj_search($(this));
    d_check = false;
    var $this = $(this),
        $d_search = $this.closest('.d_search'),
        value = $this.find('.option_value').text();
    d_input_remove_error($this,true,true);
    $d_search.find('.d_value').val(value).trigger('change');
    $d_search.find('.d_input').val(value);

    $this.closest('.dropdown').removeClass('open');
    $d_search.find('.d_menu').css('z-index','auto');
});

$('body').on('click', '.many_list .option', function(event) {
    d_check = false;
    var $this = $(this),
        $d_search = $this.closest('.d_search'),
        value = $this.find('.option_value').text();
    d_input_remove_error($this,true,true);
    var pre_value = $d_search.find('.d_value').val();
    if (pre_value !== '')
        pre_value += ',';
    $d_search.find('.d_value').val(pre_value + value).trigger('change');
    console.log('asd');
    $d_search.find('.input_tags').append('<div class="tag"><a class="close">&times;</a><span class="value">' + value +'</span></div>');
    $this.closest('.dropdown').removeClass('open');
    $d_search.find('.d_menu').css('z-index','auto');
    $('.d_search').find('.d_input').val('');
});

$('body').on('click', '.d_search .create', function(){
    d_check = false;
    console.log('ab create to hoga');
    var $d_search = $(this).closest('.d_search'),
        value = $d_search.find('.d_input').val();
    d_input_remove_error($(this),true,true);
    var pre_value = $d_search.find('.d_value').val();
    if (pre_value !== '')
        pre_value += ',';
    $d_search.find('.d_value').val(pre_value + value).trigger('change');
    $d_search.find('.input_tags').append('<div class="tag"><a class="close">&times;</a><span class="value">' + value +'</span></div>');
    $(this).closest('.dropdown').removeClass('open');
    $d_search.find('.d_menu').css('z-index','auto');
    $('.d_search').find('.d_input').val('');
});

$('body').on('click', '.d_search .create_new', function(){
    var $d_search = $(this).closest('.d_search'),
        value = $d_search.find('.d_input').val();
    var create = $(this).attr('href');
    var $create = $(create);
    $create.find('input[name=name]').val(value);
    var $form = $create.find('form');
    $create.on('click','button[type=submit]', function(){
        console.log('bind hua h');
        d_check = false;
        d_input_remove_error($d_search.find('.d_input'),true,true);
        $d_search.find('.d_value').val(value);
        $d_search.find('.one_value').removeClass('hide')
            .children('span').text(value);
        $d_search.find('.d_input').addClass('hide');
        $d_search.find('.dropdown').removeClass('open');
        $d_search.find('.d_menu').css('z-index','auto');
    });
});

$('body').on('click', '.input_tags .close', function(){
    var $tag = $(this).closest('.tag');
    var value = $tag.find('.value').text();
    var $d_search = $tag.closest('.d_search');
    var pre_value = $d_search.find('.d_value').val();
    i1 = pre_value.indexOf(value);
    i2 = i1 + value.length;
    if(i1!==0)
        i1 -= 1;
    val1 = pre_value.slice(0, i1);
    val2 = pre_value.slice(i2);
    console.log(i1,i2,val1+val2);
    if ($(this).closest('.form-group').data('del')){
        var url = $tag.closest('.form-group').data('del');
        console.log(value, url);
        $.ajax({
            url: url,
            type: "POST",
            data: {
                'tag': value
            },

            success: function(response) {
                $d_search.find('.d_value').val(val1+val2);
                console.log('deleted');
                $tag.remove();
            },

            error: function(xhr, errmsg, err) {
                console.log(errmsg, err);
            }
        });
    } else {
        $d_search.find('.d_value').val(val1+val2);
        $tag.remove();
    }
});


    function aj_search($this) {
        var $sabke_papa = $this.closest('.d_search'),
            value;
        if ($this.attr('class') == 'create') {
            value = $sabke_papa.children('input').val();
            if (value[value.length - 1] == ',') {
                value = value.substring(0, value.length - 1);
            }
            console.log('input wala');
        } else if ($this.attr('class').indexOf('create_new') >= 0) {
            $sabke_papa.find('.d_list').css({
                'display': 'none'
            });
            value = $sabke_papa.children('input').val();
            var target = $this.attr('href');
            console.log(target, value);
            $(target).find('input[type=text]').first().val(value);
            console.log('naya form');
            return 0;
        } else {
            value = $this.find('span').first().text();
            console.log('list wala', value);
        }
        var r_type = $sabke_papa.data('results');
        console.log($sabke_papa.attr('class'));
        if (r_type == 'instant') {
            $sabke_papa.children('input[name=value]').val(value)
                .nextAll('.form-ajax').trigger('click');
            console.log('1');
        } else if (r_type == 'single') {
            $sabke_papa.children('input').first().before('<div class="alert"><a class="close">&times;</a><strong>' + value + '</strong></div>').addClass('hide').next().val(value);

            $sabke_papa.on('click', '.close', function() {
                $(this).parent('.alert').alert('close');
                $sabke_papa.children('input').first().removeClass('hide').focus();
            });
        } else if (r_type == 'multiple') {
            var $d_results = $sabke_papa.children('.d_results');
            var pre_value = $d_results.html();
            $d_results.html(pre_value + '<div class="alert alert_tag"><a class="close">&times;</a><strong>' + value + '</strong></div>');
            var pre_value_snd = $sabke_papa.children('input').first().next().val();
            if (pre_value_snd !== '')
                pre_value_snd += ',';
            $sabke_papa.children('input').first().next().val(pre_value_snd + value);
            console.log($sabke_papa.children('input').first().next().val());
            $sabke_papa.find('.close').on('click', function() {
                $(this).parent('.alert_tag').alert('close');
                $sabke_papa.children('input').first().focus();
            });
            //$sabke_papa.children('input').val('');
        }
    }


var d_check = true;

function d_input_blur() {
if (d_check){
    $(this).closest('.d_search').find('.dropdown').removeClass('open');
    $d_search.find('.d_menu').css('z-index','auto');
    console.log('okkk');
    var $this = $(this);
    var value = $(this).closest('.d_search').find('.d_value').val();
    if (!value){
        /*d_input_show_error($this,true,true);*/
    }
}
}

/*$(".body").on('blur', '.d_input', d_input_blur);*/

$("body").on('mouseover', '.d_menu .dropdown-menu', function() {
    // console.log('lop')
    $(".d_input").off('blur', d_input_blur);
});
$('body').on('mouseout', '.d_menu .dropdown-menu', function() {
    $(".d_input").on('blur', d_input_blur);
});

$("body").on('focus', '.d_input', function() {
    d_check = true;
    var $this = $(this);
    var query = $this.val();
    if (query !== ''){
        $(this).closest('.d_search').find('.dropdown').addClass('open');
        $d_search.find('.d_menu').css('z-index','1000');
    }
});

// function to submit form ajaxly
$("body").on('click', '.form-ajax', function(event) {
    event.preventDefault();
    console.log('default nahi');
    var $this = $(this);
    var $papa = $this.closest('.ajax_papa');
    var $form = $this.closest('form');
    console.log($form.serialize());
    $.ajax({
        url: $form.attr('action'),
        type: $form.attr('method'),
        data: $form.serialize(),

        success: function(response) {
            $form.find('.form-control').val('');
            if (response.fields) {
                for (i = 0; i < response.fields.length; i++) {
                    $papa.find('.' + response.fields[i]).text(response.data[response.fields[i]]);
                }
            }
            if (response.inputs) {
                for (i = 0; i < response.inputs.length; i++) {
                    $papa.find('#' + response.inputs[i]).val(response.value[response.inputs[i]]);
                    var cl = $papa.find('#' + response.inputs[i]).attr('class');
                    /*if (cl.indexOf('d_input') >= 0) {
                        console.log('OKAY');
                        $papa.find('#' + response.inputs[i]).before('<div class="alert"><a class="close">&times;</a><strong>' + response.value[response.inputs[i]] + '</strong></div>').addClass('hide').next().val(response.value[response.inputs[i]]);
                    }*/
                }
            }
            if (response.elements) {
                if (response.prepend) {
                    for (i = 0; i < response.elements.length; i++) {
                        $papa.find('.' + response.elements[i]).prepend(response.html[response.elements[i]]);
                        console.log(response.elements[i], response.html[response.elements[i]]);
                    }
                }
                else if (response.append) {
                    for (i = 0; i < response.elements.length; i++) {
                        $papa.find('.' + response.elements[i]).append(response.html[response.elements[i]]);
                        console.log(response.elements[i], response.html[response.elements[i]]);
                    }
                }
                else {
                    for (i = 0; i < response.elements.length; i++) {
                        $papa.find('.' + response.elements[i]).html(response.html[response.elements[i]]);
                    }
                }
            }
        },

        error: function(xhr, errmsg, err) {
            $this.next().next().find(".d_list").html("<li><a class='tag_multiple'>Sorry, unable to fetch results. Try later.</a></li>");
            console.log(errmsg, err);
        }
    });
});

$(".ajax_andar").on('click', '.form-ajax-filed', function(event) {
    event.preventDefault();
    console.log('file wala');
    var $this = $(this);
    var $papa = $this.closest('.ajax_papa');
    var $form = $this.closest('form');
    var formData = new FormData($form[0]);
    console.log(formData);
    $.ajax({
        url: $form.attr('action'),
        type: $form.attr('method'),
        data: formData,
        cache: false,
        contentType: false,
        processData: false,

        success: function(response) {
            console.log('the form with the file succesfully submited');
            $form.find('.form-control').val('');
            if (response.fields) {
                for (i = 0; i < response.fields.length; i++) {
                    $papa.find('.' + response.fields[i]).text(response.data[response.fields[i]]);
                }
            }
            if (response.inputs) {
                for (i = 0; i < response.inputs.length; i++) {
                    $papa.find('#' + response.inputs[i]).val(response.value[response.inputs[i]]);
                }
            }
            if (response.elements) {
                if (response.prepend) {
                    for (i = 0; i < response.elements.length; i++) {
                        $papa.find('.' + response.elements[i]).prepend(response.html[response.elements[i]]);
                    }
                    console.log('yoho');
                } else {
                    for (i = 0; i < response.elements.length; i++) {
                        $papa.find('.' + response.elements[i]).html(response.html[response.elements[i]]);
                    }
                }
            }
            $form.find('.close').trigger('click');
            $form.find('.index').val(parseInt($form.find('.index').val()) + 1);
            $form.closest('.modal').modal('hide');
            lazyImages();
        },

        error: function(xhr, errmsg, err) {
            console.log(errmsg, err);
        }
    });
});

//home page
var load = true;
var timer = true;
/*$(setInterval(function(){
    timer = true;
    console.log(timer);
},300));*/ // works., implement after performance analysis
$(window).scroll(function() {
    //if (!timer)
    //return;
    //timer = false;
    if (!load)
        return;
    var $this = $(this),
        $pg = $('.paginator');
    if ($pg.length) {
        var a = $this.scrollTop();
        var b = $this.outerHeight();
        var c = $pg.offset().top;
        var nxt = $pg.data('next_page');
        //console.log('scroll', load, a + b - c);
        if ((a + b - c) > -10) {
            console.log('Yeah');
            load = false;
            var pg_url = $pg.data('url');
            console.log(pg_url);
            if (!pg_url){
                pg_url = window.location;
            }
            $.ajax({
                url: pg_url,
                type: "GET",
                data: {
                    'page': nxt
                },

                success: function(response) {
                    nxt++;
                    $pg.data('next_page', nxt);
                    var $pg_parent = $pg.parent();
                    var height_before = $pg.parent().height();
                    /*$pg_parent.css({
                        'height': height_before,
                        'overflow-y': 'hidden'
                    });*/
                    $pg.before(response);
                    $('[data-toggle="tooltip"]').tooltip();
                    lazyImages();
                    /*var height_after = $pg.parent()[0].scrollHeight;
                    $pg_parent.animate({
                        'height': height_after
                    }, 500);
                    console.log(height_after,height_before);*/
                    load = true;
                },

                error: function(xhr, errmsg, err) {
                    console.log(errmsg, err);
                    $pg.before("<h5 id='last_feed' class='text-center text-muted'>Looks like you've reached the beginning of your history at CoreLogs :)</h5>");
                    $pg.addClass('hide');
                }
            });
        }
    }
});

//profile page
$('#img_profile_box').on({
    mouseover: function() {
        $('#img_upload').stop().animate({
            'height': '28px',
            'top': '-49px',
            'padding': '4px 0px'
        });
        $('#img_upload').on('click', function() {
            $('#img_upload').stop().animate({
                'height': '0px',
                'top': '-20px',
                'padding': '0px'
            });
        });
    },
    mouseout: function() {
        $('#img_upload').stop().animate({
            'height': '0px',
            'top': '-20px',
            'padding': '0px'
        });
    }
});
$(function() {
    $('.image-editor').cropit();
    $('.select-image-btn').click(function() {
      $('.cropit-image-input').click();
    });
    $('form').submit(function() {
        // Move cropped image data to hidden input
        var imageData = $('.image-editor').cropit('export');
        $('.hidden-image-data').val(imageData);
        $('#id_image').val(imageData);
        a = $('.cropit-preview-image').css('transform');
        var values = a.match(/-?[\d\.]+/g);
        // console.log(values)
        var formValue = $(this).serialize();
    });
});

// // function for main feeder
// $('#form_feed').on('focus', 'textarea', function() {
//     var $this = $(this);
//     /*$this.attr('rows', '3');*/
//     // $this.closest('form').find('.textarea_bottom').removeClass('hide');
//     autosize.update($this);
// });
// $('#form_feed textarea').on('blur', function() {
//     var $this = $(this);
//     $this.attr('rows', '1');
//     // $this.closest('form').find('.textarea_bottom').addClass('hide');
//     autosize.update($this);
// });
// $('#form_feed .btn, .img_pre').on({
//     mouseover: function() {
//         $('#form_feed textarea').off('blur');
//     },
//     mouseout: function() {
//         $('#form_feed textarea').on('blur', function() {
//             var $this = $(this);
//             $this.attr('rows', '1');
//             $this.closest('form').find('.textarea_bottom').addClass('hide');
//             autosize.update($this);
//         });
//     }
// });

$('body').on('click', '.delete', function() {
    var $this = $(this);
    var from = $this.data('delete');
    var url = '/workplace/delete_tag';
    var del = $this.closest('.alert').find('.del_id').text();
    if(!del){
        del = $this.closest('.tag_short').find('.del_id').text();
    }
    console.log(del, url);
    $.ajax({
        url: url,
        type: "GET",
        data: {
            'delete': del
        },

        success: function(response) {
            console.log('deleted');
            $this.tooltip("hide").parent().remove();

        },

        error: function(xhr, errmsg, err) {
            console.log(errmsg, err);
        }
    });
});



$('body').on('click', '.a_collapse', function() {
    var $this = $(this);
    var col = $this.siblings('.collapse');
    var text = $this.text();
    var alt = $this.data('alternate');
    var hide = $this.data('hide');
    if (hide){
        $this.addClass('hidden');
    }
    if (col.attr('class').indexOf('in') >= 0)
        col.removeClass('in');
    else {
        col.addClass('in');
        col.find('.form-control').first().focus();
    }
    if (alt){
        // console.log(alt)
        $this.text(alt);
        $this.data('alternate', text);
    }
});

$('body').on('click', '.fake_btn', function() {
    var btn = $(this).data('btn');
    // console.log(btn)
    $(btn).trigger('click');
});


// variable to index the no.of images uploaded
var img_index = [0, 0, 0];

function check_img_index() {
    var i = img_index.indexOf(0);
    if (i == -1)
        i = 3;
    return i;
}

function send_img() {
    var i = check_img_index();
    console.log(i);
    if (i > 2) {
        console.log('premature exit');
        return 0;
    }
    img_index[i] = 1;
    var free = check_img_index();
    console.log('free: ', free);
    var img_pre = '<div class="alert"><a class="close">&times;</a><img width="90%" src="" alt=""></div>';
    var input = '<span title="Add Image" data-toggle="tooltip" data-placement="left" class="btn btn-default btn-file glyphicon glyphicon-camera input-group-addon seamless_r img_pre_in"><input id="id_image_' + free + '" type="file" name="image' + free + '"></span>';
    if ($(this).closest('form').find('.img_pre .alert').length <= i) {
        console.log('alert added', $(this).closest('form').find('.img_pre .alert').length);
        $(this).closest('form').find('.img_pre').append(img_pre);
    } else {
        console.log(i, $(this).closest('form').find('.img_pre .alert').eq(i).css('display'));
        $(this).closest('form').find('.img_pre .alert').eq(i).show();
    }
    var preview = $(this).closest('form').find('.img_pre img').eq(i);
    var file = this.files[0];
    var fd = new FormData($('#form_feed')[0]);
    fd.append('file' + i, file);
    console.log(fd, $('#form_feed').serialize());
    var reader = new FileReader();
    reader.onloadend = function() {
        preview.attr('src', reader.result).closest('.alert').show();
    };
    if (file) {
        reader.readAsDataURL(file);
        preview.closest('.img_pre').removeClass('hide').addClass('show_pre');
        console.log('img_pre showing');
        $(this).closest('form').find('.img_pre').data('index', (i + 1));
        $(this).attr('id','id_image_'+free);
        $(this).attr('name','image_'+free);
        $('#id_image_' + (i + 1)).change(send_img);
        $(this).closest('form').find('.fake_btn').data('btn', '#id_image_' + free);
        console.log($(this).closest('form').find('.img_pre').data('index'));
    } else {
        preview.attr('src', "");
    }
    $(this).closest('form').find('textarea').trigger('focus');
}

$('.img_pre_in input').change(send_img);

$('.img_pre').on('click', '.close', function() {
    var im = $(this).closest('.alert').index();
    img_index[im] = 0;
    var free = check_img_index();
    console.log('deleted. next free: ', free);
    $(this).closest('form').find('.fake_btn').attr('data-btn', '#id_image_' + free);
    //$(this).closest('form').find('#id_image_'+im).parent().remove();
    $(this).closest('form').find('#id_image_' + im).parent().html('<input id="id_image_' + im + '" type="file" name="image' + im + '">');
    $(this).closest('form').find('#id_image_' + im).change(send_img);
    /*var i = $(this).closest('form').find('.img_pre').data('index');
    $(this).closest('form').find('#id_image_'+(i-1)).parent().nextAll().each(function() {
        var old_i = $(this).children().attr('id').slice(9);
        console.log(old_i);
        $(this).children().attr('id','id_image'+(old_i-1));
        $(this).children().attr('name','image'+(old_i-1));
    });*/
    //$(this).closest('form').find('#id_image_'+(i-1)).parent().remove();
    /*if ($(this).closest('form').find('.img_pre alert').length < 1){
        $(this).closest('form').find('.img_pre').addClass('hide');
    }*/
    //$(this).closest('form').find('.img_pre').data('index',(i-1));
    $(this).closest('form').find('.alert').eq(im).hide();
    console.log($(this).closest('form').find('input'));
});

$('.ajax_andar').on('click', '.upvote', function() {
    $this = $(this);
    console.log($(this));
    var val = parseInt($(this).closest('.ajax_papa').find('.votes').text());
    if ($this.attr('class').indexOf('done') >= 0) {
        $this.removeClass('done').tooltip('hide').attr('data-original-title', 'Vote Up').tooltip('fixTitle');
        val -= 1;
    } else {
        $this.addClass('done').tooltip('hide').attr('data-original-title', 'Cancel Vote').tooltip('fixTitle');
        val += 1;
    }
    console.log(val, $(this).closest('.ajax_papa').find('.votes').text());
    $(this).closest('.ajax_papa').find('.votes').text(val);
});

$('.ajax_andar').on('click', '.downvote', function() {
    $this = $(this);
    var val = parseInt($(this).closest('.ajax_papa').find('.votes').text());
    if ($this.attr('class').indexOf('done') >= 0) {
        $this.removeClass('done').tooltip('hide').attr('data-original-title', 'Vote Down').tooltip('fixTitle');
        val += 1;
    } else {
        $this.addClass('done').tooltip('hide').attr('data-original-title', 'Cancel Vote').tooltip('fixTitle');
        val -= 1;
    }
    console.log($this.data('original-title'));
    $(this).closest('.ajax_papa').find('.votes').text(val);
});

$('.ajax_andar').on('click', '.like', function() {
    $this = $(this);
    var val = parseInt($(this).closest('.ajax_papa').find('.likes').text());
    if ($this.attr('class').indexOf('done') >= 0) {
        $this.removeClass('done').tooltip('hide').attr('data-original-title', 'Like').tooltip('fixTitle');
        val -= 1;
    } else {
        $this.addClass('done').tooltip('hide').attr('data-original-title', 'Unlike').tooltip('fixTitle');
        val += 1;
    }
    console.log(val);
    $(this).closest('.ajax_papa').find('.likes').text(val);
});

$('.answer_form button[type="button"]').click(function(event) {
    if ($(this).attr('class').indexOf('check_btn') >= 0) {
        $(this).next().val('true');
    }
    var $this = $(this).closest('form');
    /*checkValidity();*/
    /*var $editor = $this.find('#editor');
    var content = $editor.html();
    $editor.next().val(content);*/
    $this.find('.form-ajax-filed').trigger('click');
    console.log('yaha hain bhaiya');
    $('#write_answer').trigger('click');
    /*$editor.html('');*/
});

$('.article_form button[type="button"]').click(function(event) {
    if ($(this).attr('class').indexOf('check_btn') >= 0) {
        $(this).next().val('true');
    }
    var $this = $(this).closest('form');
    //checkValidity();
    var $editor = $this.find('#editor');
    var content = $editor.html();
    //$editor.next().val(content);
    console.log('k');
    $this.find('button[type="submit"]').trigger('click');
});

$('.detail').on({
    'mouseover': function() {
        $(this).children('.detail_opt').removeClass('hide');
    },
    'mouseout': function() {
        $(this).children('.detail_opt').addClass('hide');
    }
});

$('body').on('click', '.detail_add', function(event) {
    event.preventDefault();
    console.log('clickku');
    var $this = $(this);
    console.log();
    var save = $this.attr('data-save');
    var content = $this.data('content');
    var taggy = $this.data('taggy');
    console.log(save,content,taggy);
    var $forms = $('.edit_' + content);
    if (save == 'save') {
        console.log('save hoga');
        $this.text('Add').attr('data-save', '');
        if (taggy == 'yes') {
            console.log($this.prev().text());
            $this.siblings('span').removeClass('hide').siblings('.tag_short').addClass('hide').children('.close');
        }
        $forms.each(function() {
            $(this).addClass('hide');
        });
        ajax_form($(this).siblings('form'));
    } else {
        $this.text('Done').attr('data-save', 'save');
        if (taggy == 'yes') {
            $this.siblings('span').addClass('hide').siblings('.tag_short').removeClass('hide').children('.close');
        }
        $forms.each(function() {
            $(this).removeClass('hide');
        });
    }
});


$('body').on('click', '.detail_edit', function(event) {
    event.preventDefault();
    console.log('oki');
    var $this = $(this);
    var content = $this.data('content');
    var $content = $('.content_' + content);
    var save = $this.data('save');
    if (save == 'save') {
        console.log('abhi data-save "" hoga or agli baar daba k userwa edit krega');
        console.log(('#' + content), $('#' + content).serialize());
        $content.each(function() {
            var value = $(this).next().val();
            console.log($(this).next().val());
            $(this).text(value).removeClass('hide')
                .next().addClass('hide');
        });
        $this.text('Edit').data('save', '').removeClass('form-ajax');
    } else {
        console.log('abhi data-save save hoga or agli baar dabaenge to form submit hoga');
        $content.each(function() {
            var value = $(this).text();
            console.log(value);
            $(this).addClass('hide')
                .next().val(value).removeClass('hide');
        });
        $this.text('Save').data('save', 'save').addClass('form-ajax');
    }
});


$('.hover_ajax').on({
    click: function() {
        var $this = $(this);
        var active = $this.data('active');
        var list = $this.find('.hover_box');
        if (active == 'yes') {
            list.css({
                'display': 'block'
            });
            return;
        }
        //$this.data('active', 'yes');
        var url = $this.data('url');
        console.log(url);
        $.ajax({
            url: url,
            type: 'GET',

            success: function(response) {
                console.log(response);
                for (i = 0; i < response.elements.length; i++) {
                    $this.find('.hover_box').html(response.html[response.elements[i]]);
                    /*$('.body').on('click', function() {
                        $this.find('.dropdown').removeClass('open');
                        //$this.data('active', 'no');
                        //count_notifications();
                        $('.body').off('click');
                    });*/
                }
            },

            error: function(xhr, errmsg, err) {
                $this.nextAll('.dropdown').find(".d_list").html("<li><a class='tag_multiple'>Sorry, unable to fetch results. Try later.</a></li>");
                console.log(errmsg, err);
            }
        });
        /*list.css({
            'display': 'block'
        });*/
        //$this.find('.dropdown').addClass('open');
    }
});

$(document).ready(function() {
    //fetches notifications
    if (typeof count_url !== 'undefined'){
        if(count_url)
            count_notifications();
    }
    // count_messages();

});

function count_notifications() {
    $.ajax({
        url: count_url,
        type: 'GET',

        success: function(response) {
            if (response.count)
                $('#notifications .badge').text(response.count);
        },
        error: function(xhr, errmsg, err) {
            console.log(errmsg, err);
        }
    });
}

function count_messages() {
    $.ajax({
        url: '/messages/check/',
        type: 'GET',

        success: function(response) {
            console.log(response.count, 'itna message');
            if (response.count)
                $('#messages .badge').text(response.count);
        },
        error: function(xhr, errmsg, err) {
            console.log(errmsg, err);
        }
    });
}

$('.ajax_andar').on('click', '.to_quest a', function() {
    var $this = $(this);
    $this.closest('.to_quest').find('input').val('no');
    $this.children('input').val('true');
    $this.parent('form').submit();
});

$('.little_edit').each(function() {
    var $this = $(this);
    var ed_panel = $this.closest('.panel');
    ed_panel.on({
        'mouseenter': function() {
            $(this).find('.little_edit').removeClass('hide');
        },
        'mouseleave': function() {
            $(this).find('.little_edit').addClass('hide');
        }
    });
});

$('#info_head').on({
    'mouseenter': function() {
        $(this).find('.detail_add').each(function() {
            $(this).removeClass('hide');
        });
    },
    'mouseleave': function() {
        $(this).find('.detail_add').each(function() {
            $(this).addClass('hide');
        });
    }
});

function checkValidity() {
    console.log('checking');
    var editor = $("#editor");
    var content = editor.html();
    console.log(content);
    var check = true,
        pos = -1,
        allow_pos = [],
        allowed = 0,
        att = false;
    var i = 0;
    while (i <= content.length) {
        var text = content[i];
        if (text == '<') {
            //i may is indexing the start of an opening or a closing tag
            pos = i;
            //the portion of string not yet checked
            var unchecked = content.slice(pos, content.length);
            var nxt = unchecked.search(">");
            var end = pos + nxt;
            //pos indexes the opening of tag
            //end indexes closing of tag
            var allowedy = allowed;
            if (allowed) {
                //check wether its a closing tag
                if (content[pos + 1] == '/') {
                    //check if its the closing tag of allowed (except 'img')
                    if (content[pos + 2] == 'b' || content[pos + 2] == 'i' || content[pos + 2] == 'u' || content[pos + 2] == 'a' || content[pos + 2] == 'l' || content[pos + 2] == 'o') {
                        //might be a recognised tag
                        if (content[pos + 3] == '>') {
                            //confirmed a/b/i/u
                            allowed--;
                            console.log('allowed ka closing', content[pos + 2], pos, allowed, allowedy);
                            if (content[pos + 2] == 'a')
                                att = 'href';
                        } else if (content[pos + 3] == 'r' || content[pos + 3] == 'l' || content[pos + 3] == 'i') {
                            //might be br/ul/ol/li
                            if (content[pos + 4] == '>') {
                                //confirmed br/ul/ol/li
                                allowed--;
                                console.log('allowed ka closing');
                            }
                        }
                    }
                }
            }
            if (!allowedy || (allowedy == allowed)) {
                console.log('yahi na', content[pos], pos);
                allowedy = allowed;
                //check for allowed tags
                if (content[pos + 1] == 'b' || content[pos + 1] == 'i' || content[pos + 1] == 'u' || content[pos + 1] == 'a' || content[pos + 1] == 'l' || content[pos + 2] == 'o') {
                    //might be a recognised tag
                    console.log('lvl 1 a', content[pos + 2]);
                    if (content[pos + 2] == '>' || content[pos + 2] == ' ') {
                        //confirmed a/b/i/u
                        console.log('lvl 2 a');
                        allowed++;
                        if (content[pos + 1] == 'a')
                            att = 'href';
                    } else if (content[pos + 2] == 'r' || content[pos + 2] == 'm' || content[pos + 2] == 'l' || content[pos + 2] == 'i') {
                        //might be 'br/ul/ol/li/img
                        console.log('lvl 2 b');
                        if (content[pos + 3] == '>' || content[pos + 3] == ' ') {
                            //confirmed br/ul/ol/li
                            console.log('lvl 3 a');
                            allowed++;
                        } else if (content[pos + 3] == 'g') {
                            //might be 'img'
                            console.log('lvl 3 b');
                            if (content[pos + 4] == '>' || content[pos + 4] == ' ') {
                                //confirmed img
                                console.log('lvl 4 a');
                                allowed++;
                                att = 'src';
                            }
                        }
                    }
                }
            }
            if (allowedy == allowed) {
                console.log(pos, end);
                var part1 = content.slice(0, pos);
                //console.log(part1);
                var part2 = content.slice(end + 1, content.length);
                //console.log(part2);
                content = part1 + part2;
                i--;
            } else {
                allow_pos[allowed] = pos;
                console.log(allowed, allow_pos[allowed]);
            }
        }
        i++;
    }
    console.log(content, allowed);
    editor.html(content);
    while (allowed) {
        console.log('ego adha aa giya');
        pos = allow_pos[allowed - 1];
        var nxt = unchecked.search(">");
        var end = pos + nxt;
        var part1 = content.slice(0, pos);
        //console.log(part1);
        var part2 = content.slice(end + 1, content.length);
        //console.log(part2);
        content = part1 + part2;
        allowed--;
    }
}


$(document).ready(function() {
    var ctrlDown = false;
    var ctrlKey = 17,
        vKey = 86,
        cKey = 67;
    $(document).keydown(function(e) {
        if (e.keyCode == ctrlKey) ctrlDown = true;
    }).keyup(function(e) {
        if (e.keyCode == ctrlKey) ctrlDown = false;
    });

    $('#editor').on({
        'focus': function() {
            if ($(this).attr('class') == 'empty') {
                $(this).html('').removeClass('empty');
                //setInterval(checkValidity, 5000);
            }
            //checkValidity();
        },
        'keyup': function(event) {
            if (ctrlDown && event.keyCode == 86) {
                checkValidity();
            }
        },
        'blur': function() {
            console.log('blured');
            if ($(this).html() === '') {
                $(this).html('<div class="text-muted">The Awesome Body goes here ...</div>').addClass('empty');
            }
            //checkValidity();
        }
    });


});

var nones = $('span.none');
if (nones.siblings('span').length) {
    nones.addClass('hide');
}

$('.d_results').on('click', '.alert_tag .close', function() {
    $(this).parent('.alert_tag').alert('close');
    //$(sabke_papa).children('input').first().focus();
});

$('.d_results').on('close.bs.alert', '.alert_tag', function() {
    console.log('check');
    var all_val = $(this).closest('.d_search').find('input[name=tags]').val();
    var this_val = $(this).find('strong').text();
    var pos = all_val.search(this_val);
    var pos_end = pos + this_val.length - 1;
    if (all_val[pos_end + 1] == ',') {
        console.log(pos, pos_end);
        pos_end += 1;
        console.log(pos, pos_end);
    } else if (all_val[pos - 1] == ',') {
        console.log(pos, pos_end);
        pos -= 1;
        console.log(pos, pos_end);
    }
    var part1 = all_val.slice(0, pos);
    var part2 = all_val.slice(pos_end + 1, all_val.length);
    all_val = $(this).closest('.d_search').find('input[name=tags]').val(part1 + part2);
    console.log(all_val, this_val, part1, part2);
});

$('.answers').on('click', '.edit_ans', function() {
    var editor = $('#editor');
    var $this = $(this);
    var id = $this.siblings('span').text();
    var ans = $this.closest('.feed_box').find('.a_detail').html();
    console.log('hello');
    $('#write_answer').trigger('click');
    editor.html(ans).focus();
    var form = $('.answer_form');
    form.find('input[name=aid]').val(id);
    form.find('.new').addClass('hide');
    form.find('.check_btn').removeClass('hide');
    $this.closest('.feed_box').addClass('hide');
});

$('#write_answer').on('click', function() {
    var mode = $(this).text();
    var form = $('.answer_form');
    if (mode == 'Cancel') {
        form[0].reset();
        $('#editor').html('');
    }
    //form.find('input[name=aid]').val('');
    form.find('.new').removeClass('hide');
    form.find('.check_btn').addClass('hide');
});

var c_i = $('.change_image');
if (c_i.length > 0) {
    change_image();
}

function change_image() {
    var form = $('.change_image');
    var images = form.find('.img_pre').children();
    var img_no = images.length;
    if (img_no > 0) {
        $('.img_pre').removeClass('hide').addClass('show_pre');
        $('.img_pre').attr('data-index', img_no);
        for (i = 1; i <= img_no; i++) {
            var input = '<span title="Add Image" data-toggle="tooltip" data-placement="left" class="btn btn-default btn-file glyphicon glyphicon-camera input-group-addon seamless_r img_pre_in"><input id="id_image_' + i + '" type="file" name="image' + i + '"></span>';
            $('.img_pre_in').last().after(input);
            $('#id_image_' + i).change(send_img);
            img_index[i - 1] = 1;
        }
        form.find('.fake_btn').attr('data-btn', ('#id_image_' + img_no));
    }
    console.log($('.img_pre').data('index'));
}


/*$('.feed_box_body').each(function() {
    var fig_w = (100 / ($(this).find('figure').length)) - 1;
    $(this).find('figure').css({
        'width': fig_w + '%'
    });
});
*/
$('.change_image').on('click', '.img_pre .close', function() {
    var pid = $(this).data('id');
    if (pid) {
        var pre = $(this).closest('.img_pre');
        var url = pre.data('url');
        var id = $(this).closest('form').find('input[name=id]').val();
        console.log('hello', pid);
        $.ajax({
            url: url,
            type: 'GET',
            data: {
                'qid': id,
                'pid': pid
            },
            success: function(response) {
                console.log('image removeed');
            },
            error: function(xhr, errmsg, err) {
                console.log(errmsg, err);
            }
        });
    }
});


$('#almost_write_answer').mouseenter(function(){
    if (win_width > 768 ){
        $('#top_login').addClass('open');
    }
    else{
        $('#top_nav_toggle').click();
        $('#top_login a').addClass('open');
    }
});


// this activates the tooltips
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
  autosize($('textarea'));
  autosize.update($('textarea'));
  autosize.destroy($('.form_card_thin textarea'));
});

$('.body').on('click', '.call_car', function(){
    console.log('image bada ho ja');
    var $this = $(this);
    var $feed = $this.closest('.feed_box_body');
    var title = $feed.find('.summary_title').text();
    var src = $this.attr('src');
    $('#figure_modal .modal-title').text(title);
    $('#figure_modal .modal-body img').attr('src',src);
    $('#figure_modal').on('shown.bs.modal', function(){
        var h_head = $(this).find('.modal-header').outerHeight(true);
        var h_foot = $(this).find('.modal-footer').outerHeight(true);
        console.log(win_height, h_head, h_foot);
        $(this).find('.modal-body').css('height',(win_height-h_head-h_foot));
    });
});


if($('#set_workplace').length){
    console.log('b');
    $('#set_workplace').find('input[name=workplace]').change(function(){
        var $this = this;
        console.log('a',$this.find('button[type=submit]').attr('disabled'));
        $this.find('button[type=submit]').attr('disabled','false');
    });
}


function ajax_form($this){
    var $papa = $this.closest('.ajax_papa');
    var $form = $this;
    console.log($form.serialize());
    console.log('a form is being submitted ajaxly');
    $.ajax({
        url: $form.attr('action'),
        type: $form.attr('method'),
        data: $form.serialize(),

        success: function(response) {
            $form.find('.form-control').val('');
            if (response.fields) {
                for (i = 0; i < response.fields.length; i++) {
                    $papa.find('.' + response.fields[i]).text(response.data[response.fields[i]]);
                }
            }
            if (response.inputs) {
                for (i = 0; i < response.inputs.length; i++) {
                    $papa.find('#' + response.inputs[i]).val(response.value[response.inputs[i]]);
                    var cl = $papa.find('#' + response.inputs[i]).attr('class');
                    if (cl.indexOf('d_input') >= 0) {
                        $papa.find('#' + response.inputs[i]).before('<div class="alert"><a class="close">&times;</a><strong>' + response.value[response.inputs[i]] + '</strong></div>').addClass('hide').next().val(response.value[response.inputs[i]]);

                    }
                }
            }
            if (response.elements) {
                if (response.prepend) {
                    for (i = 0; i < response.elements.length; i++) {
                        $papa.find('.' + response.elements[i]).prepend(response.html[response.elements[i]]);
                    }
                } else {
                    for (i = 0; i < response.elements.length; i++) {
                        $papa.find('.' + response.elements[i]).html(response.html[response.elements[i]]);
                    }
                }
            }
        },

        error: function(xhr, errmsg, err) {
            $this.next().next().find(".d_list").html("<li><a class='tag_multiple'>Sorry, unable to fetch results. Try later.</a></li>");
            console.log(errmsg, err);
        }
    });
}

var ajaxloadflag = false;

$(document).ready(function(){
    $('.ajax_load').each(function(index, el) {
        var ajaxloadflag = true;
        var $this = $(this);
        var url = $(this).data('url');
        var post = $(this).data('post');
        var data = '';
        type = 'GET';
        if (post){
            type = 'POST';
            data = {'data': $(post).val()};
        }
        console.log(url, data);
        $.ajax({
            url: url,
            type: type,
            data: data,

            success: function(response) {
                $this.html(response);
                // console.log('kuch ajax load hui');
                lazyImages();
            },

            error: function(xhr, errmsg, err) {
                $this.html("<p class='text-center'>Yoo..<br>Content lost its way ... :/</p>");
                console.log(errmsg, err, url);
            }
        });
    });
    $('.ajax_load2').each(function(index, el) {
        var ajaxloadflag = true;
        var $this = $(this);
        var url = $(this).data('url');
        var post = $(this).data('post');
        var data = '';
        type = 'GET';
        if (post){
            type = 'POST';
            data = {'data': $(post).val()};
        }
        console.log(url, data);
        $.ajax({
            url: url,
            type: type,
            data: data,

            success: function(response) {
                $this.find('.content').html(response);
                // console.log('kuch ajax load hui');
                $this.find('.loading').addClass('hide');
                lazyImages();
            },

            error: function(xhr, errmsg, err) {
                $this.find('.content').html("<p class='text-center'>Yoo..<br>Content lost its way ... :/</p>");
                $this.find('.loading').addClass('hide');
                console.log(errmsg, err, url);
            }
        });
    });
});

/*$(document).ajaxComplete(function(){
    if (ajaxloadflag){
        $('.ajax_load').each(function(index, el) {
            var $this = $(this);
            var url = $(this).data('url');
            $.ajax({
                url: url,
                type: 'GET',

                success: function(response) {
                    $this.html(response);
                    console.log('home_right load hua');
                    lazyImages();
                },

                error: function(xhr, errmsg, err) {
                    $this.html("<p class='text-center'>Yoo..<br>Content lost its way ... :/</p>");
                    console.log(errmsg, err, url);
                }
            });
        });
    }
    else
        ajaxloadflag = true;
});*/

$('.ajax_andar').on('click', '.show_edit', function(){
    var $form = $(this).parent().find('.d_edit');
    $form.removeClass('hide');
    $(this).addClass('hide');
    $(this).parent().find('.done_edit').removeClass('hide');
    $(this).closest('.info_field').find('.info_field_value').addClass('hide');
});

$('.ajax_andar').on('click', '.done_edit', function(){
    var $form = $(this).parent().find('.d_edit');
    ajax_form($form);
    $form.addClass('hide');
    $(this).addClass('hide');
    $(this).parent().find('.show_edit').removeClass('hide');
    $(this).closest('.info_field').find('.info_field_value').removeClass('hide');
});

$(function () {
  $("#send").submit(function () {
    $.ajax({
      url: '/messages/send/',
      data: $("#send").serialize(),
      cache: false,
      type: 'post',
      success: function (data) {
        $(".send-message").before(data);
        $("input[name='message']").val('');
        $("input[name='message']").focus();
      }
    });
    return false;
  });
});

$(function () {
  var substringMatcher = function(strs) {
    return function findMatches(q, cb) {
      var matches, substringRegex;
      matches = [];
      substrRegex = new RegExp(q, 'i');
      $.each(strs, function(i, str) {
        if (substrRegex.test(str)) {
          matches.push({ value: str });
        }
      });
      cb(matches);
    };
  };
});

function nav_active(a){
    var nav = $(a).closest('.nav');
    var act = nav.find('.active');
    var e_type = act.prop('nodeName');
    act.removeClass('active');
    $(a).closest(e_type).addClass('active');
}

$('.nav_activate').on('click', 'a', function(){
    nav_active(this);
});

function ajax_a(a, push){
    var url = $(a).attr('href');
    var target = $(a).data('place');
    var post = $(a).data('post');
    var type = 'GET';
    if (target){
        console.log(target);
        $(target).find('.loading').removeClass('hide');
    }
    data = '';
    if (post){
        type = 'POST';
        data = {'data': $(post).val()};
    }
    $.ajax({
        url: url,
        type: type,
        data: data,
        success: function (response) {
            // console.log(response);
            if (target){
                $(target).find('.content').html(response);
                $(target).find('.loading').addClass('hide');
                lazyImages();
                if (push)
                    changeurl(response, url);
            }
        },
        error: function(xhr, errmsg, err) {
            console.log(errmsg, err);
            if (target)
                $(target).find('.loading').addClass('hide');
        }
    });
}

$('body').on('click', '.ajax_a', function(event){
    event.preventDefault();
    ajax_a(this, true);
});

$('body').on('click', '.ajax_a2', function(event){
    event.preventDefault();
    ajax_a(this, false);
});

$('.nav_flex').on('click', 'li', function(){
    $(this).addClass('active');
    $(this).siblings('li').removeClass('active');
});

$('.select_dropdown').on('click', '.dropdown-menu a', function(){
    console.log($(this).text());
    $(this).addClass('current');
    $(this).closest('.dropdown-menu').find('.current').removeClass('current');
    var what = $(this).find('.value').text();
    var what_fa = $(this).find('i').attr('class');
    var sd = $('.select_dropdown .dropdown-toggle');
    sd.find('.value').text(what);
    sd.find('i').attr('class', what_fa);
    sd.closest('form').find('.d_input').attr('placeholder','Search '+ what + ' ...');
    sd.closest('form').find('.what').val(what.toLowerCase());
    var s_url = '/search/'+what.toLowerCase();
    /*sd.closest('form').attr('action',s_url);*/
});

$('#top_search').on('focus', '.d_input', function(){
    type = $('#top_search').find('.what').val().toLowerCase();
    $(this).closest('.d_search').find('.d_type').val(type);
    /*$(this).closest('form').tooltip('hide');*/
});

/*$('#top_search').on('keydown', '.d_input', function(){
    $(this).closest('form').tooltip('hide');
});*/

$(function(){
    var what = $('#search_typ').find('.dropdown-toggle .value').text().toLowerCase();
    $('#search_typ .dropdown-menu').find('li').each(function(){
        var typ = $(this).find('.value').text().toLowerCase();
        if (typ == what) {
            var what_i = $(this).find('i').attr('class');
            $('#search_typ').find('.dropdown-toggle i').attr('class', what_i);
        }
    });
});


$('#search_toggle').on('click', function(){
    $(this).hide();
    if($('#pre_nav .orelogs').outerWidth(true)){
        $('#top_search').animate({'left':'0%','min-width':'250px'}).css({'overflow':'visible'});
        $('#pre_nav .orelogs').animate({'width':0});
    }
});

/*$('#top_search').on('show.bs.dropdown', '.dropdown', function(){
    $('#top_search .d_menu').css('z-index','1000');
});

$('#top_search').on('hidden.bs.dropdown', '.dropdown', function(){
    $('#top_search .d_menu').css('z-index','auto');
});*/

function lazyImages(){
    $('.lazy_img').each(function(index, el){
        var $this = $(this);
        var change = true;
        var old_src = $this.attr('src');
        var src = $this.data('src');
        var $farzi = $('.farzi');
        $farzi.append('<img id="lazyimg" src=' + src + ' >');
        var $farzi_now = $farzi.children('#lazyimg');
        $farzi_now.on('load', function() {
            //console.log(index +' loaded ');
            change = true;
            changeSource($this, change, src, $farzi_now);
        });
        if($farzi_now.prop('complete')){
            //console.log(index + 'already loaded');
            change = true;
            changeSource($this, change, src, $farzi_now);
        }
        $farzi_now.on('error', function() {
            //console.log(index +' not loaded');
            change = false;
            changeSource($this, change, src, $farzi_now);
        });
        $farzi_now.attr('id', '');
        $this.removeClass('lazy_img');
    });
}

$(lazyImages);

function changeSource($this, change, src, $farzi_now){
    if (change) {
        $this.attr('src',src);
    }
    $farzi_now.remove();
}

$('.body').on('click', '.field_edit', function(){
    var $this = $(this);
    $this.addClass('hide').siblings('.save').removeClass('hide');
    var $info_grp = $this.closest('.info_field_grp');
    $info_grp.find('.info_field_value').addClass('hide');
    $info_grp.find('.info_field_edit').removeClass('hide');
});

$('.body').on('click', '.info_field_grp .save', function(){
    var $this = $(this);
    $this.addClass('hide').siblings('.saving').removeClass('hide');
    var $form = $this.closest('form');
    ajax_form_2($form, changeComplete);
    /*changeComplete($form)*/
    var $info_grp = $this.closest('.info_field_grp');
    $info_grp.find('.info_field_value').removeClass('hide');
    $info_grp.find('.change').addClass('changing');
    $info_grp.find('.info_field_edit').addClass('hide');
});

$('.body').on('change', '.info_field .form-control', function(){
    $(this).closest('.info_field').addClass('change');
    console.log('input value changed');
});



function ajax_form_2($this, callback){
    var $papa = $this.closest('.ajax_papa');
    var $form = $this;
    console.log($form.serialize());
    console.log('a form is being submitted ajaxly');
    $.ajax({
        url: $form.attr('action'),
        type: $form.attr('method'),
        data: $form.serialize(),
        success: function(response) {
            console.log('ajax form submission complete !');
            callback($form, response);
        },
        error: function(xhr, errmsg, err) {
            console.log(errmsg, err);
        }
    });
}

function changeComplete($form, response){
    var $info_grp = $form.closest('.info_field_grp');
    $info_grp.find('.changing').each(function(index, el) {
        $this = $(el);
        var $new_val = $this.find('.new_val');
        if (!$new_val.attr('name')){
            console.log('new_val is not a form element');
            new_val = $this.find('.new_val').html();
        }
        else
            new_val = $this.find('.new_val').val();
        $this.find('.info_field_value').html(new_val);
        console.log('content replaced successfully ',new_val);
    });
    $info_grp.find('.changing').removeClass('changing').removeClass('change').addClass('changed');
    $info_grp.find('.saving').addClass('hide').siblings('.field_edit').removeClass('hide');
}

$('body').on('click','.info_field_edit .close', function(){
    console.log('delete this tag');
    deleteWPTag($(this).closest('.tag'));
});

function deleteWPTag($tag){
    var url = '/workplace/delete_tag/';
    var del = $tag.find('.value').text();
    console.log(del, url);
    $.ajax({
        url: url,
        type: "POST",
        data: {
            'delete': del
        },
        success: function(response) {
            console.log('deleted tag ',del);
            //$this.tooltip("hide").parent().remove();
        },
        error: function(xhr, errmsg, err) {
            console.log(errmsg, err);
        }
    });
}

$('body').on('click','.enq_btn',function(){
    $('#enquiry_modal').find('input[name="pid"]').val($(this).closest('.product').find('.id').text());
});

$('body').on('click', '.more', function(){
    var $this = $(this);
    $this.parent().stop().animate({'height':'131px'}, 500, function(){
        $this.parent().addClass('expanded');
        $this.removeClass('more').addClass('less').html('less <span class="fa fa-chevron-up"></span>');
    });
});

$('body').on('click', '.less', function(){
    var $this = $(this);
    $(this).parent().stop().animate({'height':'30px'},500, function(){
        $this.parent().removeClass('expanded');
        $this.removeClass('less').addClass('more').html('more <span class="fa fa-chevron-down"></span>');
    });
});

$('body').on('click', '.next_nav', function(){
    $(this).closest('.tab-content').siblings('.nav-tabs').find('.active').next().find('a').tab('show');
});


var $prod_cat_a, $prod_cat_form, $other_forms;

$('#add_prod_category').on('click', '.select_btn', function(){
    var name = $(this).data('name');
    $prod_cat_form.find('input[name=' + name + ']').val($(this).data('value')).attr('data-text',$(this).text());
    // $prod_cat_form.find('.active_selection').removeClass('active_selection');
    var cat = $(this).data('name');
    if (cat == 'category1') {
        $prod_cat_form.find('input[name="category2"], input[name="category3"]').val("").attr('data-text', '');
    }
    else if (cat == 'category2') {
        $prod_cat_form.find('input[name="category3"]').val("").attr('data-text', '');
    }
    for (var i = $other_forms.length - 1; i >= 0; i--) {
        $($other_forms[i]).find('input[name=' + name + ']').val($(this).data('value')).attr('data-text',$(this).text());
        var cat = $(this).data('name');
        if (cat == 'category1') {
            $($other_forms[i]).find('input[name="category2"], input[name="category3"]').val("").attr('data-text', '');
        }
        else if (cat == 'category2') {
            $($other_forms[i]).find('input[name="category3"]').val("").attr('data-text', '');
        }
    }
});


$('body').on('click', '.change_prod_category', function(){
    $prod_cat = $(this);
    $prod_cat_form = $prod_cat.closest('form');
    $other_forms = $prod_cat_form.closest('.form_card').nextAll('.form_card');
});

$('#add_prod_category').on('click', '.no_sub', function(){
    $(this).addClass('active_selection');
    var cat1 = $prod_cat_form.find('input[name="category1"]').attr('data-text');
    var cat2 = $prod_cat_form.find('input[name="category2"]').attr('data-text');
    var cat3 = $prod_cat_form.find('input[name="category3"]').attr('data-text');
    var cats = [cat1, cat2, cat3];
    html = '';
    for (var i = 0; i < cats.length; i++) {
        if(cats[i]){
            if(i){
                html += ' <span class="fa fa-angle-right mid_fa"></span>';
            }
            html = html + '<span>' + cats[i] + '</span>';
        }
    }
    $prod_cat.html(html);
    for (var i = $other_forms.length - 1; i >= 0; i--) {
        $($other_forms[i]).find('.change_prod_category').html(html);
    }
    $(this).closest('.modal').modal('hide');
});

$('#add_prod_category').on('click', '.new_category_btn', function(){
    var value = $(this).closest('.collapse').find('input').val();
    $(this).addClass('current');
    var $new_cat_form = $('#new_category_form');
    $('#new_category_form').find('input').each(function(){
        $(this).val('');
    });
    if ($(this).data('level') == 2){
        $new_cat_form.find('input[name=new_category_2]').val(value);
        $new_cat_form.find('input[name=new_category_1]').val($('#add_prod_category').find('input[name="category1"]').val());
    }
    else if ($(this).data('level') == 3){
        $new_cat_form.find('input[name=new_category_3]').val(value);
        $new_cat_form.find('input[name=new_category_2]').val($('#add_prod_category').find('input[name="category2"]').val());
        $new_cat_form.find('input[name=new_category_1]').val($('#add_prod_category').find('input[name="category1"]').val());
    }
    ajax_form_2($new_cat_form, newCategory);
});

function newCategory($form, response){
    var level = $('.new_category_btn.current').attr('data-level');
    console.log(response, level);
    if (level == 2){
        $('.new_category_btn.current').closest('ul').prepend('<li><a class="select_btn added_now" data-name="category' + level + '" data-value="' + response.id + '" data-toggle="pill" href="#category_' + response.id + '">' + response.name + '<span class="fa fa-fw fa-chevron-right"></span></a></li>');
        $('.new_category_btn.current').closest('.tab-pane').find('.tab-content').prepend('<div id="category_' + response.id + '" class="tab-pane fade"><ul class="nav nav-pills nav-stacked"><li><a class="no_sub">' + response.name + '<span class="fa fa-fw fa-check"></span></a></li><li><a class="new_category" href="#new_category_' + response.id + '" data-toggle="collapse">Add a new Category<span class="fa fa-fw fa-plus"></span></a></li><div id="new_category_' + response.id + '" class="collapse" style="padding: 10px"><div class="form-group"><input class="form-control" type="text" value="" placeholder="Name of the new category"></div><div class="panel info"><div class="panel-body bg-warning"><span class="fa fa-exclamation-circle"></span> Categories are meant to be generic so that a considerable number of products fall under it. Kindly provide an apt name keeping this in mind and only after none of the pre-existing categories satisfy your needs.</div></div><div class="form-group text-center"><button type="button" class="btn btn-sm new_category_btn" data-level=2>Add</button></div></div>');
        $('.added_now').tab('show').removeClass('added_now');
    }
    else
        $('.new_category_btn.current').closest('ul').prepend('<li><a class="select_btn no_sub" data-name="category' + level + '" data-value="' + response.id + '">' + response.name + '<span class="fa fa-fw fa-check"></span></a></li>');
    $('.new_category_btn.current').closest('ul').find('.new_category').trigger('click');
    $('.new_category_btn.current').removeClass('current');
}

$('.select_btn').on('click', function(){
    var name = $(this).data('name');
    var $input = $(this).closest('form').find('input[name=' + name + ']');
    $input.val($(this).data('value'));
    if($input.attr('type') == 'hidden'){
        $input.trigger('change');
    }
});

$('body').on('click', '.add_prod .ajx_form', function(e){
    e.preventDefault();
    $(this).find('.fa').removeClass('fa-check').addClass('fa-cog fa-spin');
    ajx_form($(this).closest('form'), prodSuccess, showFailureModalCommon);
});

$('#add_product_form').on('click', '.select_btn', function(e){
    var w = $('#add_product_form').outerWidth();
    if (w < 900){
        var $this = $(this);
        console.log('step 1');
        $this.closest('.c_col').css('display', 'none');
        $('#prev_col').css('display', 'block').attr({
            'data-prevcol': $this.closest('.c_col').attr('id'),
            'data-nextcol': $this.attr('href')
        });
    }
});

$('#add_product_form').on('click', '#prev_col', function(e){
    /*$('#add_product_form').find('.c_col').css('display', 'none');*/
    $('#'+$(this).attr('data-prevcol')).css('display','block').find('li.active').removeClass('active');
    $($(this).attr('data-nextcol')).closest('.tab-pane').removeClass('active').removeClass('in');
    if($(this).attr('data-prevcol') == 'c2_col'){
        $(this).attr('data-prevcol','c1_col');
        $(this).attr('data-nextcol','#c2_col');
    }
    else{
        $(this).css('display', 'none');
    }
});


function ajx_form_file($form, onSuccess, onFailure){
    var formData = new FormData($form[0]);
    console.log($form,formData);
    $.ajax({
        url: $form.attr('action'),
        type: $form.attr('method'),
        data: formData,
        cache: false,
        contentType: false,
        processData: false,

        success: function(response) {
            onSuccess($form, response);
        },

        error: function(xhr, errmsg, err) {
            console.log(errmsg, err);
            onFailure($form);
        }
    });
}

function ajx_form($form, onSuccess, onFailure){
    $.ajax({
        url: $form.attr('action'),
        type: $form.attr('method'),
        data: $form.serialize(),

        success: function(response) {
            onSuccess($form, response);
        },

        error: function(xhr, errmsg, err) {
            console.log(errmsg, err);
            onFailure($form);
        }
    });
}

function prodSuccess($form, response){
    $form.closest('.form_card').animate({'height': '0', 'margin': '0'}, 200, function(){
        $(this).remove();
    });
    $form.closest('.form_pool').find('.form_card.hide').first().removeClass('hide');
    $form.closest('.form_pool').append(response.new_form);
    $('#recent_prods').find('.product_sm').first().addClass('hide');
    $('#recent_prods').find('.product_sm').last().after(response.last_p);
    // showSuccessModal($form);
}

function showSuccessModal($form){
    var id = $form.attr('id');
    $("#" + id + "_succModal").modal();
    $form.find('input:visible, textarea').val('');
    $form.find('[type=file]').val('');
    $form.find('.img_preview img').attr('src', '');
}

function showFailureModal($form){
    var id = $form.attr('id');
    $("#" + id + "_errModal").modal();
}

function showFailureModalCommon($form){
    var id = $form.attr('id');
    $("#errModal").modal();
}

$("#wp_set_form").on('click','button[type=button]', function(){
    $("#wp_set_form").find('.active').removeClass('active');
    $("#wp_set_search").animate({'opacity':'1'}, 1000);
    console.log($("#wp_set_search").offset().top);
    $('html, body').animate({
        scrollTop: ($("#wp_set_search").offset().top - 200)
    }, 1000);
    $("#wp_set_search .d_type").val($(this).val());
    $(this).addClass('active');
    $("#wp_set_search .d_input").focus();
});

$("body").on('click','.scrollto', function(event){
    event.preventDefault();
    var to = $(this).attr('href');
    $('html, body').animate({
        scrollTop: ($(to).offset().top - 200)
    }, 1000);
});

$('#feedback').on('click', 'h3', function(){
    if($(this).attr('class').indexOf('active') >= 0){
        $(this).removeClass('active');
        $("#feedback form").animate({opacity: '0'}, 800, function(){
            $("#feedback").animate({width: '175px', height:'40px'}, 500);
        });
    }
    else{
        $(this).addClass('active');
        $("#feedback").animate({width: '250px', height:'165px'}, 800, function(){
            $("#feedback").css({height: 'auto'});
            $("#feedback form").animate({opacity: '1'}, 500);
        });
        console.log('not active');
    }
});

$('#feedback').on('click', '.ajx_form', function(){
    $(this).addClass('active');
    $("#feedback form").animate({opacity: '0'}, 800, function(){
        $("#feedback").animate({width: '175px', height:'40px'}, 500);
    });
    ajx_form($(this).closest('form'), showSuccessModal, showFailureModal);
});

$('.file_in_single').on('change', function(){
    var value = $(this).val();
    var id = $(this).attr('id');
    var file = this.files[0];
    if (value){
        var reader = new FileReader();
        reader.onloadend = function() {
            $('#' + id + '_preview').find('img').attr('src', reader.result);
        };
        reader.readAsDataURL(file);
    }
    else{
        $('#' + id + '_preview').find('img').attr('src', '');
    }
});

$('.d_type_ext').on('change', function(){
    /*console.log('changing type')*/
    $(this).closest('form').find('.d_type').val($(this).val());
});

$('.c1_group_title').on('click', function(e){
    var $prev = $(this).closest('.form-group').find('.current');
    $prev.find('.fa').removeClass('fa-chevron-up').addClass('fa-chevron-down');
    $prev.closest('.panel').find('li.active').removeClass('active');
    /*$(this).animate({opacity: 0}, 500, function() {
        var top = $(this).outerHeight();
        var h = parseInt($(this).closest('.panel').find('.collapse').height());
        $(this).closest('.panel').find('.collapse').css({
            display: 'block',
            height: '0',
            overflow: 'hidden'
        }).animate({height: h},1000);
    });*/
    /*$(this).closest('.panel').find('.collapse').collapse();*/
    if ($(this).attr('class').indexOf('current') >= 0) {
        if ($(this).attr('class').indexOf('collapsed') >= 0) {
            $(this).find('.fa').removeClass('fa-chevron-down').addClass('fa-chevron-up');
        }
        else {
            $(this).find('.fa').removeClass('fa-chevron-up').addClass('fa-chevron-down');
        }
    }
    else {
        $(this).find('.fa').removeClass('fa-chevron-down').addClass('fa-chevron-up');
    }
    $prev.removeClass('current');
    $(this).addClass('current');
});

var $cover_slide = $('#cover_slide');
if($cover_slide){
    SlideInterval = 3000;
    slideTimer = setTimeout(animateSlide, SlideInterval);
}

function animateSlide(){
    var $cover_slide = $('#cover_slide');
    $cover_slide.find('.current').animate({
        'min-height': (win_height - top_nav_width)
    });
}

$("body").on('click', '.active_li a', function(){
    $('.active_li').find('.active').removeClass('active');
    $(this).closest('li').addClass('active');
});

$('body').on('change', '.dashboard .form_instant .d_value', function(){
    ajx_form($(this).closest('form'), tagAdded, showFailureModal);
});

$('body').on('click', '.suggestions .add_now', function(){
    var $form = $($(this).closest('.suggestions').data('form'));
    $form.find('.d_value').val($(this).closest('.tag_suggest_box').find('.value').text());
    ajx_form($form, tagAdded, showFailureModal);
});

function tagAdded($form, response){
    showSuccessModal($form);
    console.log(response.tag);
    var tag_c = parseInt($form.data('targettags'));
    var count_c = parseInt($form.data('targetcount'));
    console.log(tag_c,count_c);
    for (var i = tag_c; i >= 0; i--) {
        $($form.data('target')+"_tags_"+i).append(response.tag);
    }
    for (var i = count_c; i >= 0; i--) {
        count = parseInt($($form.data('target')+"_count_"+i).text()) + 1;
        $($form.data('target')+"_count_"+i).text(count);
    }
}

$('body').on('click','.alt_data', function(){
    var alt = $(this).attr('data-alt');
    $(this).attr('data-alt',$(this).text());
    $(this).text(alt);
});

$('body').on('click','#dash_side a', function(){
    if (win_width < 768 ){
       $('html, body').animate({
            scrollTop: ($("#dash_content").offset().top - 90)
        }, 1000);
    }
});


var slide_lock = false;

$('body').on('click', '.slider', function(){
    if (!slide_lock){
        var $this = $(this);
        $slide = $($this.data('slide')).closest('.slide_container');
        $slide_left = $slide.find('.left_slide');
        $slide_mid = $slide.find('.mid_slide');
        var shift_w = $('.mid_slide').outerWidth(true);
        var status = $this.attr('data-status');
        if (status == 'closed'){
            slide_lock = true;
            $this.attr('data-status','open');
            var shift_w_new = shift_w - 200;
            $slide_left.css('display','block').stop().animate({'left':'0px','opacity':'1'});
            $slide_mid.stop().animate({'left':'200px','width':shift_w_new}, function(){
                slide_lock = false;
            });
        }
        else{
            slide_lock = true;
            $this.attr('data-status','closed');
            var shift_w_new = shift_w + 200;
            $slide_left.stop().animate({'left':'-200px','opacity':'0'});
            $slide_mid.stop().animate({'left':'0px','width':shift_w_new}, function(){
                slide_lock = false;
            });
        }
    }
});

$('#categories_top').on('click', '.slider', function(){
    if($(this).attr('data-status')=='closed'){
        $('#categories_top .navbar-nav').animate({'opacity':'0'}, function(){
            $(this).css('display','none');
        });
    }
    else{
        $('#categories_top .navbar-nav').css('display','block').animate({'opacity':'1'});
    }
});

$('.hoverdown_toggle').on({
        'mouseenter': function() {
            var $hoverbox = $(this).closest('.hoverbox');
            $hoverbox.addClass('open');
        },
        'mouseleave': function() {

        }
    });

$('.hoverbox').on('mouseleave', function(){
    var $hoverbox = $(this).closest('.hoverbox');
    $hoverbox.removeClass('open');
});

$('#all_categories .hoverdown_toggle').on('mouseenter', function(){
    var $hoverdown = $(this).closest('.hoverbox').find('.hoverdown');
    var par_off = $('#all_categories').offset().top;
    var top_off = $(this).offset().top;
    var top_scroll = $(window).scrollTop();
    var box_h = $hoverdown.outerHeight(true);
    console.log(par_off, top_off, top_scroll, box_h, $hoverdown.text());
    var box_top = (par_off - top_scroll) > 51 ? (par_off - top_scroll) : 51;
    var win_top = (win_height/top_off > 2) ? true : false;
    var win_side = ((par_off + box_h) > (top_off + 41)) ? true : false;
    $hoverdown.css({'top':box_top});
    if (!win_side){
        //$hoverdown.css({'bottom':(win_height-top_off-41)});
    }
    console.log(box_top, win_height/top_off, win_top, (par_off + box_h), win_side);
});


$(function(){
    $('.pre_input').each(function(){
        if ($(this).closest('.form_card').length){
            if ($(this).closest('.form_card').attr('class').indexOf('form_card_thin') >= 0) {
                $(this).find('input, textarea').css('padding-left',($(this).find('.pre').outerWidth() + 5));
            }
            else{
                $(this).find('input, textarea').css('padding-left',($(this).find('.pre').outerWidth() + 10));
            }
        }
    });
    $('.char_count').each(function(){
        var f = $(this).parent().find('input, textarea');
        $(this).text(f.attr('maxlength')-f.val().length);
    });
});

$('form').on('keyup', '.count_field', function(){
    var c = $(this).val().length;
    var max = $(this).attr('maxlength');
    $(this).parent().find('.char_count').text(max-c);
});

$('body').on('change', '.auto_form input, .auto_form textarea', function(){
    autoSubmitReady($(this));
});

function autoSubmitReady($this){
    if ($this.attr('type') == 'hidden'){
        customValidate($this);
        autoSubmit($this,$this.data('response'));
    }
    else {
        customValidate($this);
        autoSubmit($this,$this.data('response'));
    }
}

function customValidate($this){
    var type = $this.attr('type');
    a = $this[0].validity;
    for (var err in a){
        if (a[err] == true){
            console.log(err)
        }
    }
    console.log($this[0].checkValidity());
}

function autoSubmit($this, data_response){
    var $form = $this.closest('form');
    var $field = $this.closest('.form-group');
    autoSubmitShow($field);
    f_data = $this.serialize();
    if ($this.attr('type') == 'checkbox'){
        if (!$this.is(':checked')){
            console.log('add data to checkbox',$this.attr('name'));
            var f_obj = {};
            if ($this.val() == 'false'){
                f_obj[$this.attr('name')] = true;
            } else {
                f_obj[$this.attr('name')] = false;
            }
            f_data = f_obj;
            console.log(f_data);
        }
    }
    console.log($form.attr('action'),f_data);
    $.ajax({
        url: $form.attr('action'),
        type: $form.attr('method'),
        data: f_data,

        success: function(response) {
            autoSubmitDone($field);
            if (data_response){
                console.log(data_response);
                window[data_response]($field, response);
            }
            else if ($form.data('response')){
                data_response = $form.data('response');
                console.log(data_response);
                window[data_response]($field, response);
            }
        },

        error: function(xhr, errmsg, err) {
            console.log(errmsg, err);
            autoSubmitFailed($field);
        }
    });
}

function autoSubmitShow($field){
    if($field.find('.saving').length == 0){
        $field.closest('form').find('.saving.original').clone().removeClass('original').prependTo($field,$field.closest('form'));
    }
    $field.find('.saving').removeClass('hide');
}

function autoSubmitDone($field){
    $field.find('.saving').addClass('hide');
}

function autoSubmitFailed($field){
    $field.find('.saving').addClass('hide');
}

function productCreated($field,response){
    $field.closest('form').attr('action',"/products/edit_add/"+response['p_id']+"/");
    console.log($field.closest('form').attr('action'));
}
function leadCreated($field,response){
    console.log(response);
    $('#lead_from').html(response);
    /*$field.closest('form').attr('action',"/leads/edit_add/"+response['l_slug']+"/");
    console.log($field.closest('form').attr('action'));*/
}

function UpdateScore($field,response){
    console.log(response);
    var el = $('#info_score').find('.circle_bar').attr('data-percent', response.info_score)[0];
    CircleProgress(el);
}

function imageUpload($this){
    var preview = $this.closest('.image_box').find('.img_pre');
    var file = $this[0].files[0];
    var fd = new FormData();
    var name = $this.attr('name');
    fd.append(name, file);
    console.log(fd, file);
    var reader = new FileReader();
    reader.onloadend = function() {
        var $img = preview.html("<img id='product_image'>");
        $('#product_image').attr('src', reader.result);
        var $form = $this.closest('form');
        var $field = $this.closest('.form-group');
        // for(var pair of fd.entries()) {
        //    console.log(pair[0]+ ', '+ pair[1]);
        // }
        autoSubmitShow($field);
        $.ajax({
            url: $form.attr('action'),
            type: $form.attr('method'),
            data: fd,
            cache: false,
            contentType: false,
            processData: false,

            success: function(response) {
                autoSubmitDone($field);
            },

            error: function(xhr, errmsg, err) {
                console.log(errmsg, err);
                autoSubmitFailed($field);
            }
        });
    };
    if (file) {
        reader.readAsDataURL(file);
        console.log('img_pre showing');
    }
    else {
        preview.attr('src', "");
    }
}

$('.img_pre').on('mouseenter', 'img', function(){
    $(this).closest('.image_box').find('.hover_btn').css('display', 'block');
});
$('.image_box').on('mouseleave', '.hover_btn', function(){
    $(this).css('display', 'none');
});

$('body').on('mouseenter', '.hover_a_container', function(){
    $(this).find('.hovering_a').css('display', 'block');
});
$('body').on('mouseleave', '.hover_a_container', function(){
    $(this).find('.hovering_a').css('display', 'none');
});

$('.form_eric').find('input, textarea').on('keyup blur focus', function (e) {
    var $this = $(this),
    label = $this.prev('label');
    if (e.type === 'blur') {
      if( $this.val() === '' ) {
        label.removeClass('active highlight');
      } else {
        label.removeClass('highlight');
      }
    } else if (e.type === 'focus') {
        label.addClass('active highlight');
    }
});

$(function(){
    $('.form_eric').find('input, textarea').each(function(index, el) {
        var $this = $(this),
        label = $this.prev('label');
        // console.log($this.val())
        if( $this.val() !== '' )
            label.addClass('active highlight');
    });
});

$('.form_card').find('input, textarea').on('blur focus', function (e) {
    var $this = $(this),
    fg = $this.closest('.form-group');
    if (e.type === 'focus') {
        fg.addClass('active');
    } else {
        fg.removeClass('active');
    }
});

$('body').on('change','.s_validate',function(){
    var $this = $(this);
    var fg = $this.closest('.form-group');
    fg.find('.validating').removeClass('hide');
    $this.on('blur',function(){
        console.log($this.val());
        name = $this.attr('name');
        val = $this.val();
        var csrf = $this.closest('form').find('input[name=csrfmiddlewaretoken]').val();
        $.ajax({
            url: $this.data('url'),
            type: 'POST',
            data: {
                'data': val,
                'csrfmiddlewaretoken': csrf
            },

            success: function(response) {
                console.log(response.valid);
                fg.find('.validating').addClass('hide');
                if (!response.valid) {
                    fg.removeClass('invalid');
                    fg.addClass('valid');
                }
                else if (response.valid == 1){
                    fg.removeClass('valid');
                    fg.addClass('invalid');
                }
                else if (response.valid == 2){
                    fg.removeClass('valid');
                    fg.removeClass('invalid');
                }
            },

            error: function(xhr, errmsg, err) {
                console.log(errmsg, err);
                fg.find('.validating').addClass('hide');
            }
        });
        $this.off('blur');
    });
});

$('.body').on('click', '#quotation_edit .submitbtn', function(){
    var $form = $(this).closest('form');
    ajax_form_2($form, loadNext);
});

function loadNext($form, response){
    if (response.status){
        $form.find('.submitbtn').next().trigger('click');
    }
}

$('body').on('click', '.msg_a', function(){
    var $this = $(this);
    if ($this.data('hide')){
        $(this).addClass('hide');
    }
    var msg = $(this).attr('data-msg');
    $this.siblings(msg).removeClass('hide');
    if ($this.attr('data-alt')){
        var alt = $this.attr('data-msgalt');
        $this.siblings(alt).addClass('hide');
        var now = $this.attr('data-msg');
        $this.attr('data-msgalt', now);
        $this.attr('data-msg', alt);
    }
});

$('body').on('click', '.alt_a', function(){
    var $this = $(this);
    var alt = $this.attr('data-alt');
    var text = $this.text();
    $this.text(alt);
    $this.attr('data-alt', text);
});

$('.fields_disabled').find('input, textarea').each(function(index, el) {
    var $this = $(this);
    $this.attr('disabled','true');
});

$('body').on('submit', '.bullet_form', function(event){
    event.preventDefault();
    var $this = $(this);
    $.ajax({
        url: $this.attr('action'),
        type: 'POST',
        data: {'msg': 'bhejo'},

        success: function(response) {
            console.log(response);
            $this.closest('#random_card').html(response);
        },

        error: function(xhr, errmsg, err) {
            console.log(errmsg, err);
        }
    });
});

$('body').on('click', '.swapper', function(event){
    $this = $(this);
    var now = $this.attr('data-now');
    var alt = $this.attr('data-alt');
    $(now).addClass('hide');
    $(alt).removeClass('hide');
    console.log('swappy si');
});

$('body').on('click', '.swapper_bi', function(event){
    event.preventDefault();
    $this = $(this);
    var now = $this.attr('data-now');
    var alt = $this.attr('data-alt');
    $(now).addClass('hide');
    $(alt).removeClass('hide');
    $this.attr('data-now', alt);
    $this.attr('data-alt', now);
    console.log('swappy');
});


var $login_modal = $('#login_modal');
if ($login_modal.length) {
  // console.log($login_modal);
  $('body').on('click','.signup_call',function(event){
    event.preventDefault();
    // console.log('singup call', $login_modal.length);
    $login_modal.modal();
  });
}

function nav_ajax_activate(){
  var $nav_ajax_content = $('.nav_ajax_content');
  if ($nav_ajax_content.length) {
    var $nav_ajax = $('#'+$nav_ajax_content.data('nav'));
    $nav_ajax.find('#'+$nav_ajax_content.data('nav')+'_'+$nav_ajax_content.attr('id')).closest('li').addClass('active');
  }
}

$(nav_ajax_activate);

function changeurl(response, url){
  var state = window.location.pathname;
  window.history.pushState(state, '', url);
  var $response = $('<div></div>').html(response);
  $('title').text($response.find('#ajax_title').text());
  $('meta[name=description]').attr('content', $response.find('#ajax_description').text());
  $("meta[property='og\:title']").attr('content', $response.find('#ajax_title').text());
  $("meta[property='og\:description']").attr('content', $response.find('#ajax_description').text());
  ga('send', 'pageview', url);
}

$(window).on('popstate', function(event) {
    var state = window.location.pathname;
    if (state) {
        $('.ajax_a').each(function(index, el) {
          console.log($(el).attr('href'), state);
          if ($(el).attr('href') == state){
            ajax_a(el, false);
            nav_active(el);
          }
        });
    }
});


var mouseX;
var mouseY;
$("body").on('mousemove', function(e) {
   mouseX = e.pageX;
   mouseY = e.pageY;
   // console.log(mouseX, mouseY);
});

$("body").on('mousemove mouseleave', "#prod_analysis", function(e) {
    $this = $(this);
    var $metric = $(e.target);
    var $pt = $metric.closest('.progress_thin');
    var w = $pt.width();
    if (e.type == 'mousemove'){
        var offset = $this.offset();
        var value_p = Math.floor(mouseX - offset.left);
        var avg = $pt.find('.progress_avg').offset().left;
        var direct = $pt.attr('id');
        var $direct = $('#'+direct);
        p = i = v = value_p;
        var range = $pt.find('.progress-bar').attr('aria-valuemax');
        value = getBarValue(w, range, Math.floor(value_p));
        if (direct == 'p'){
            i = Math.floor((1.2*value/10)+1);
            v = Math.floor(10*(Math.sqrt((2*value)+10)));
        } else if (direct == 'i'){
            p = Math.floor((10*(value-1))/1.2);
            v = Math.floor(10*Math.sqrt(20/1.2*(value-1)));
        } else if (direct == 'v'){
            p = Math.floor(((value*value)+1)/200);
            i = Math.floor(1.2/1000*((value*value)+1));
        }
        var list = [p, i, v];
        $this.find('.progress_thin').each(function(index, el){
            $el = $(el);
            var solid = $el.find('.progress-bar').width();
            var range = $el.find('.progress-bar').attr('aria-valuemax');
            var val_txt = '0';
            if ($el[0] == $direct[0]){
                $el.find('.progress-bar.trans').width(list[index] - solid);
                $el.find('.progress_data.trans').text(value).css('left', list[index]);
            }
            else{
                var pix = getBarPixels(w, range, list[index]);
                $el.find('.progress-bar.trans').width(pix - solid);
                $el.find('.progress_data.trans').text(list[index]).css('left', pix);
            }
        });
        var $tail = $('.graph_base').find('.'+direct+'_tail');
        $tail.find('.value').text(value);
        $tail.removeClass('hide').siblings().addClass('hide');
        if (!$('.progress-bar-striped').length){
            $this.find('.progress-bar.trans').addClass('progress-bar-striped');
        }
    }
    else{
        $('.graph_base').find('.default_tail').removeClass('hide').siblings().addClass('hide');
        // $this.find('.progress-bar.trans').removeClass('progress-bar-striped').each(function(){
        //     $(this).css('width', ($(this).data('default') + '%'));
        // });
        $this.find('.progress_data.trans').each(function(){
            var def = parseInt($(this).attr('data-default'));
            var range = $(this).siblings('.progress').find('.progress-bar').attr('aria-valuemax');
            var s = $(this).siblings('.progress').find('.progress-bar').width();
            console.log(def, range, w, getBarPixels(w, range, def)+'px');
            $(this).css('left', getBarPixels(w, range, def)+'px').text(def);
            $(this).siblings('.progress').find('.progress-bar.trans').css('width', getBarPixels(w, range, def)-s+'px').removeClass('progress-bar-striped');
        });
    }
});

function getBarPixels(w, range, value){
    var p = 0;
    for (var i = 0; value >= 0; i++) {
        if (value <= range/2) {
            p += value/Math.pow(2,i);
        }
        else {
            p += range/Math.pow(2,i+1);
        }
        value -= range/2;
    }
    return Math.floor((p/range)*w);
}

function getBarValue(w, range, pixels){
    var i = 0;
    var w2 = w/2;
    for (; w > 1 ; i++) {
        w /= 2;
        if (pixels <= w)
            w = 0;
        else
            pixels -= w;
    }
    w = w2*2;
    // console.log(w2,pixels,i)
    return Math.floor((w2*(i-1) + pixels*i)*range/w);
}

var setg = true;
function setgraph(){
    if ($('#prod_analysis').length){
        console.log('hoinga');
        p = parseInt($('#p').find('.progress_data').first().text());
        i = Math.floor((1.2*p/10)+1);
        v = Math.floor(10*(Math.sqrt((2*p)+10)));
        var list = [p, i, v];
        $('#prod_analysis').find('.progress_thin').each(function(index, el){
            $el = $(el);
            w = $el.width();
            var solid = parseInt($el.find('.progress_data').first().text());
            var range = $el.find('.progress-bar').attr('aria-valuemax');
            var s_pix = getBarPixels(w, range, solid);
            console.log(solid, range, s_pix, index);
            $el.find('.progress-bar').first().width(s_pix);
            $el.find('.progress_data').first().css('left', s_pix);
            if (index){
                var pix = getBarPixels(w, range, list[index]);
                $el.find('.progress-bar.trans').width(pix - s_pix).attr('data-default', list[index]);
                $el.find('.progress_data.trans').text(list[index]).attr('data-default', list[index]).css('left', pix);
            }
        });
    }
}

$(function () {
    setgraph();
});

$('body').on('click', '.slide_a', function(event){
    event.preventDefault();
    // console.log('slider')
    var $this = $(this);
    var target = $this.attr('href');
    var current = $this.attr('data-parent');
    var type = $this.attr('data-type');
    $(current).addClass('hide');
    $(target).removeClass('hide');
});

$('body').on('click', '#inbox_list .slide_a', function(event){
    ajx_form($(this).find('.seen_form'), messageSeen, messageFailed);
});

$('#inbox_content').on('click', '.ajx_form', function(){
    ajx_form($(this).closest('form'), messageSent, messageFailed);
});

function messageSeen($form, response){
    $form.closest('h4').removeClass('strong');
}

function messageSent($form, response){
    $form.closest('.inbox_msg').find('.msg_body').append(response.msg);
}
function messageFailed($form, response){

}

var bodyleave = true;
var modalTimer = 0;
$(function(){
    modalTimer = setTimeout(function(){
        bodyleave = false;
    }, 20000);
});
$('body').on('mouseleave', function(e) {
    console.log(modalTimer, bodyleave);
    if (!bodyleave && mouseY <= 100){
        bodyleave = true;
        $("#irritate_modal").modal();
    }
});

$('.dropdown-toggle_hover').on('mouseenter', function(){
    $(this).closest('.dropdown').addClass('open');
});

$('.menu_left').on('click', '.toggle', function(e){
    e.preventDefault();
    var $this = $(this);
    var $menu = $this.closest('.menu_left');
    var status = $this.attr('data-status');
    // console.log('a bhaiya', status)
    if (status == 'open'){
        $menu.stop().animate({
            'left': '-200px'
        }, 500);
        $this.stop().animate({
            'left': '200px'
        }, 500);
        status = $this.attr('data-status', 'closed');
    }
    else{
        $menu.stop().animate({
            'left': '0'
        }, 500);
        $this.stop().animate({
            'left': '0px'
        }, 500);
        status = $this.attr('data-status', 'open');
    }
});


$('#filter_tag').on('change', '.d_value', function(){
    $('#network_nav').find('.active a').trigger('click');
});

$('.inline_tags').on('click', function(){
    $(this).find('.d_input').focus();
});
$('.inline_tags').on('focus', '.d_input', function(){
    $(this).closest('.inline_tags').addClass('focus');
});
$('.inline_tags').on('blur', '.d_input', function(){
    $(this).closest('.inline_tags').removeClass('focus');
});

$('body').on('click', '.btn_form', function(){
    var $this = $(this);
    var form = $this.closest('form');
    var name = $this.attr('name');
    if (name){
        form.find("input[name="+name+"]").val($this.val());
    }
    console.log(form.serialize());
    ajx_form(form, buttonColor, ajaxError);
});

function buttonColor($form, response){
    $form.find($form.find('.btn_form').attr('data-success')).removeClass('hide');
    $form.find('.btn_form').addClass('hide');
}
function ajaxError($form, response){

}

$('.page_search').on('keydown', 'input', function(e){
    clearTimeout(typingTimer);
    typingTimer = setTimeout(pageSearch, doneTypingInterval);
});

function pageSearch() {
    var d_on = true;
    var $this = $('.page_search');
    var query = $this.find('input[name=query]').val(),
        search = $this.attr('action');
    if (query.length < 3){
        console.log('e to chotu h');
        d_on = false;
    }
    if (d_on) {
        var place = $this.attr('data-place');
        $this.find('.form-control-feedback').children('.fback_wait').removeClass('hide');
        $.ajax({
            url: search,
            type: $this.attr('method'),
            data: $this.serialize(),
            success: function(result) {
                $(place).html(result);
                $this.find('.form-control-feedback').children('.fback_wait').addClass('hide');
            },
            error: function(xhr, errmsg, err) {
                //d_on = true;
                console.log(errmsg, err);
                $this.find('.form-control-feedback').children('.fback_wait').addClass('hide');
            }
        });
    }
}

var tag_select = 0;

$('#network_content').on('click', '.btn_form', function(){
    tag_select += 1;
    if(tag_select > 2){
        $('#done').removeClass('hide');
    }
});

var more_less = '<span class="more_less more">see more ...</span>';

$("body").on('mouseenter', '.feed_box.feed', function() {
    var $this = $(this);
    var check = $this.attr('data-content');
    var body = $this.find('.summary_body');
    if (check!='checked'){
        console.log(body.height(), body[0].scrollHeight);
        if (body[0].scrollHeight > body.height()){
            body.append(more_less).addClass('ex_content');
        }
        $this.attr('data-content','checked');
    }
    // console.log('lop')
});

$('body').on('mouseenter', '.more_less.more', function(){
    var ex = $(this).closest('.ex_content');
    // console.log(ex[0].scrollHeight ,ex.height())
    var new_h = ex[0].scrollHeight;
    ex.attr('data-initial', ex.height());
    $(this).text('see less ...').removeClass('more').addClass('less');
    ex.stop().animate({
        'height':new_h
        }, 200);
});

$('body').on('click', '.more_less.less', function(){
    var ex = $(this).closest('.ex_content');
    var new_h = ex.attr('data-initial');
    $(this).text('see more ...').removeClass('less').addClass('more');
    ex.stop().animate({
        'height':new_h
        }, 200);
});

$('body').on('click', '.shell_input', function(){
    var $this = $(this);
    var form = $($this.attr('data-form'));
    var touch = $this.closest('.shell_container');
    if ($this.attr('class').indexOf('open') < 0) {
        if (touch.attr('class').indexOf('touched') >= 0){
            touch.find('.shell_input').each(function(){
                $(this).toggleClass('open');
            });
        }
        else{
            touch.addClass('touched');
            $this.addClass('open');
        }
        var new_h = form[0].scrollHeight;
        var form_c = touch.parent().find('.shell_form_container');
        var open_form = form_c.find('.shell_form.open');
        if (open_form.length) {
            open_form.stop().animate({
            'opacity': 0
            }, 100,
            function(){
                open_form.removeClass('open');
                form_c.stop().animate({
                    'height':new_h,
                    }, 200,
                    function(){
                        open_form.css({'height':0});
                        $(this).css({'height':'auto'});
                        form.addClass('open');
                        form.css({'height':'auto'}).animate({'opacity':1},100).addClass('open');
                    });
            });
        }
        else{
            form_c.stop().animate({
                'height':new_h,
                }, 200,
                function(){
                    $(this).css({'height':'auto'});
                    form.addClass('open');
                    form.css({'height':'auto'}).animate({'opacity':1},100).addClass('open');
                });
        }
    }
    form.find('.form-control').first().focus();
});


$('.body').on('click', '.reply .form-control', function(){
    var $this = $(this);
    $this.trumbowyg({
      btns: [
        // ['viewHTML'],
        // ['formatting'],
        'btnGrp-semantic',
        ['superscript', 'subscript'],
        ['link'],
        ['insertImage'],
        'btnGrp-lists',
        'btnGrp-justify',
        ['horizontalRule'],
        ['removeformat'],
        ['fullscreen']
      ]
    });
    $this.closest('form').find('.hide').removeClass('hide');
    $this.closest('form').find('.trumbowyg-editor').focus();
});

$('body').on('click', '.msg_send', function(event){
    ajx_form($(this).closest('form'), receiveModal, messageFailed);
});

function receiveModal($form, response){
    if(!$form.find('.success_modal').length){
        $form.append(response.modal);
    }
    $form.find('.success_modal').modal();
}


//  image upload ka naya complete wyawastha

$(function(){
    $('.image_box').cropit({ imageBackground: true });
});

$('body').on('click', '.image_box .file_btn', function(e){
    $(this).closest('.image_box').find('.ajax_image').trigger('click');
});

$(".image_crop_modal").on('hide.bs.modal', function (e) {
    var $this = $(this);
    var $image_box = $this.closest('.image_box');
    //the cropped image uri
    var imageData = $image_box.cropit('export');
    // correct preview
    $image_box.find('.image_preview img').attr('src', imageData);
    // transformation matrix
    var a = $this.find('.cropit-preview-image').css('transform');
    var values = a.match(/-?[\d\.]+/g); // conversion to array
    console.log(a, values);
    // console.log(index)
    // the original image
    var file = $this.find('.ajax_image')[0].files[0];
    // send image
    var fd = new FormData();
    fd.append('image', file);
    fd.append('transformation', values);
    fd.append('index', $image_box.find('input[name=index]').val());
    $.ajax({
        url: $image_box.attr('data-url'),
        type: "POST",
        data: fd,
        cache: false,
        contentType: false,
        processData: false,

        xhr: function() {
            var xhr = new window.XMLHttpRequest();
            //Upload progress
            xhr.upload.addEventListener("progress", function(evt)
            {
              if (evt.lengthComputable) {
                var percentComplete = evt.loaded / evt.total;
                //Do something with upload progress
                $image_box.find('.aj_progress .level').width((percentComplete*100)+'%');
                console.log(percentComplete);
              }
            }, false);
            //Download progress
            xhr.addEventListener("progress", function(evt) {
              if (evt.lengthComputable) {
                var percentComplete = evt.loaded / evt.total;
                //Do something with download progress
                console.log(percentComplete);
              }
            }, false);
            return xhr;
        },

        success: function(response) {
            // $this.find('.ajax_image').attr('disabled',true);
        },

        error: function(xhr, errmsg, err) {
            console.log(errmsg, err);
            autoSubmitFailed($field);
        }
    });
});

$('body').on('change', '.ajax_image', function(e){
    // show and hide elements
    var $this = $(this);
    var $clone = $this.clone();
    var $image_box = $this.closest('.image_box');
    var $preview = $image_box.find('.image_preview_box');
    $this.addClass('hide');
    $image_box.find('.add_btn').addClass('hide');
    $preview.removeClass('hide');
    // handle the image file
    var file = $this[0].files[0];
    // declare a new filereader
    var reader = new FileReader();
    // se what happens once the file loads in the filereader
    var image;
    reader.onloadend = function() {
        $preview.find('img').attr('src', reader.result);
        image = reader.result;
        // show crop modal
        $image_box.find('.options').removeClass('hide');
        $image_box.find('.image_crop_modal').modal();
        console.log('image_preview set');
    };

    if (file) {
        // read file as url, load is fired after this
        reader.readAsDataURL(file);
    }
});


$('body').on('click', '.form_show', function(){
    $(this).siblings('.form_pool').find('.form_card.hide').first().removeClass('hide');
})

$('body').on('change', '.up_file', function(e){
    e.preventDefault();
    ajx_form_file($(this).closest('form'));
});

var progress = '<div class="aj_progress"><div class="level"></div></div>';
