function init(){
    location.hash='student-list';   //页面一刷新后要显示第一个tab，所以hash也应该修改
    bindEvent();
}
init();

function bindEvent(){
    //下拉菜单
    var list=$('header .drop-list');
    $('header .btn').on('click',function(){
        list.slideToggle();
    });

    $(window).resize(function(){
        if($(window).innerWidth()>=768){
            list.css('display','none');
        }
    });

    //处理地址。通过hashchange事件完成tab切换
    $(window).on('hashchange',function(){
        //console.log(1);
        var hash=location.hash; //#student-list
       // console.log(hash);

        //右侧的内容先把上一个显示的隐藏，再把当前的显示
       $('.show-list').removeClass('show-list');
       $(hash).addClass('show-list');

       //tab按钮，也是一样。先把上一个的active去掉。再把当前的加上active
       $('.list-item.active').removeClass('active');
       $('.'+hash.slice(1)).addClass('active');
    });


     //给所有的导航添加点击事件，点击的时候去修改hash值
    $('.list-item').on('click',function(){
        $('.drop-list').slideUp();
        var id=$(this).attr('data-id');
        location.hash=id;
    });
}