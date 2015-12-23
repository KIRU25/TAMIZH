
(function pullPagePullImplementation($) {
  "use strict";
  var listSelector = "div.indexpage ul.ui-listview";
  var litod1;
  

  function gotPullUpData(event, data) {
    litod1=litod+15;   
    if(litod<=listlength){ 
       var newContent= $('ul#postsList>li').slice(litod,litod1).css("display","block");
       litod=litod1;
       $(listSelector).listview("refresh");    
       
    }
    else{ 
       $('div.iscroll-pullup').hide();$('div.eon').fadeIn(100);}
    }
  
  function onPullDown (event, data) { 
    setTimeout(function fakeRetrieveDataTimeout() {
      gotPullDownData(event, data);
      }, 
      500); 
    } 

  function onPullUp (event, data) { 
    setTimeout(function fakeRetrieveDataTimeout() {
      gotPullUpData(event, data);
      }, 
      1000); 
    }    

   $(document).delegate("div.indexpage", "pageinit", 
    function bindPullPagePullCallbacks(event) {
      $(".iscroll-wrapper", this).bind( {
      iscroll_onpullup   : onPullUp
      } );

    } );   
   
  }(jQuery));