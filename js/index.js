var flag = false;	

$(document).on('pagebeforechange', function () {
    if(flag==false) {
        $.mobile.loading( "show" );
        flag=true;
    }
});

$(document).on('pageshow', function () {
	$.mobile.loading( "hide" );
    flag=false;
}); 


$(document)
  .ajaxStart(function () {
    $.mobile.loading( "show" );
  })
  .ajaxStop(function () {
    $.mobile.loading( "hide" );
  });

function init_db()
{
	 db = window.openDatabase("news", "1.0", "Pulanam Post Database.", 200000);
}

init_db();
 

$( document ).on( "pageinit", "#postIndex", function() {
     create_db_table();
     count_db();
});


function check_posts(databaselength){
    var url = "http://pulanam.omtamil.com/api/get_recent_posts/?json=1&count=100";
	$.ajax({
	   type: 'GET',
	    url: url,
	    async: false,
	    jsonpCallback: 'callback',
	    contentType: "application/json",
	    dataType: 'jsonp',
	    success: function(json) {

	    	if(json.status=="ok") {
	    		jsonlength=json.posts.length;		    		 
            	db.transaction(function(tx) {
                   tx.executeSql("select * from news_posts;", [], function(tx, res) {
        	            databaselength=res.rows.length;
                        if(jsonlength>databaselength){
				           console.log('Database is need to update');
				           get_posts();
				        } else {
				   	      console.log('Database is uptodate');
				        } 
                    });    
                });
	    	}
	    	else {
	    		console.log("error");
	    	}	 

	    },
	    error: function(e) {
	       console.log(e.message);
	    }
	});
}

function get_posts(url){    
    var url = "http://pulanam.omtamil.com/api/get_recent_posts/?json=1&count=100";
	$.ajax({
	    type: 'GET',
	    url: url,
	    async: false,
	    jsonpCallback: 'callback',
	    contentType: "application/json",
	    dataType: 'jsonp',
	    success: function(json) {
	    	if(json.status=="ok") {
				posts(json);    
	    	}
	    	else {
	    		console.log("error");
	    	}		       
	    },
	    error: function(e) {
	       console.log(e.message);
	    }
	});
}

function drop_db_table(){
    db.transaction(function(tx) {
	    tx.executeSql('DROP TABLE IF  EXISTS news_posts ');
	});
}

function count_db(){
    db.transaction(function(tx) {
        tx.executeSql("select * from news_posts;", [], function(tx, res) {             
            if(res.rows.length!=0){
                var html = "";               
			  	for (var i = 0; i < res.rows.length; i++){
					postid=res.rows.item(i).id;
				    postthumbnail=res.rows.item(i).thumbnail;
				    postcontent=res.rows.item(i).title;
				    date=res.rows.item(i).date;
			        html = html + "<li data-icon=\"false" + "\">" + "<a href=\"post.html?id=" + postid + "\" data-transition=\"slide"+"\">" + '<img src="' + postthumbnail + '"/ height="80px"/ width="80px"/>' + "<h3>" + postcontent + "</h3>" + "<p>" + date + "</p></a></li>";
                    document.getElementById("postsList").innerHTML = html;                   
				}
				$("#postsList").listview("refresh");	
                limit_posts();
                } else {
              	get_posts();
            	console.log('Database is empty.. Getting posts from the server.');
            }
        });        
    });
    check_posts();
}
function show_db_slug_posts(slug){
	qu1='select * from news_posts where slug="'+ slug+ '" ';
    db.transaction(function(tx) {
        tx.executeSql(qu1, [], function(tx, res) { 
                var html = "";               
			  	for (var i = 0; i < res.rows.length; i++){
					postid=res.rows.item(i).id;
				    postthumbnail=res.rows.item(i).thumbnail;
				    postcontent=res.rows.item(i).title;
				    date=res.rows.item(i).date;
			        html = html + "<li data-icon=\"false" + "\">" + "<a href=\"post.html?id=" + postid + "\" data-transition=\"slide"+"\">" + '<img src="' + postthumbnail + '"/ height="80px"/ width="80px"/>' + "<h3>" + postcontent + "</h3>" + "<p>" + date + "</p></a></li>";
                    document.getElementById("postsList").innerHTML = html;                   
				}
				$("#postsList").listview("refresh");	
                limit_posts();            
        });        
    });
    check_posts();
}

function create_db_table(){
    db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE  IF NOT EXISTS news_posts (id unique,title text, content text,slug text,thumbnail text,url text,date datetime)');
    });
}

function select_db_post(postid){
	qu='SELECT * from news_posts where id = '+ postid+ '';	 
	db.transaction(function(tx) {		
        tx.executeSql(qu, [], function(tx, res) {                    
		    posttitle=res.rows.item(0).title;
		    postcontent=res.rows.item(0).content;	
		    var html = "<h3>"+posttitle+"</h3>";
            html += "<p>"+postcontent+"</p>";
            document.getElementById("post").innerHTML = html;
        },
        function(err) {
          console.log("Error processing SQL: "+err.code);
        });
    });
}


$( document ).on( "pagebeforeshow", "#postLanguage", function() {
    slug='language';
	show_db_slug_posts(slug);	 
});

$( document ).on( "pagebeforeshow", "#postRace", function() {
	slug='race';
	show_db_slug_posts(slug);
});

$( document ).on( "pagebeforeshow", "#postCulture", function() {
	slug='culture';
	show_db_slug_posts(slug);	 
});

$( document ).on( "pagebeforeshow", "#postTechnology", function() {
	slug='technology';
	show_db_slug_posts(slug);	 
});

$( document ).on( "pagebeforeshow", "#postScience", function() {
	slug='science';
	show_db_slug_posts(slug);	 
});

$( document ).on( "pagebeforeshow", "#postLifeology", function() {
	slug='lifeology';
	show_db_slug_posts(slug);	 
});


$( document ).on( "pagebeforeshow", "#postFinance", function() {
	slug='finance';
	show_db_slug_posts(slug);	 
});

$( document ).on( "pagebeforeshow", "#postHistory", function() {
	slug='history';
	show_db_slug_posts(slug);	 
});

$( document ).on( "pagebeforeshow", "#postPhilosophy", function() {
	slug='philosophy';
	show_db_slug_posts(slug);	 
});

$( document ).on( "pagebeforeshow", "#postMusic", function() {
	slug='music';
	show_db_slug_posts(slug);	 
});


$( document ).on( "pagebeforeshow", "#postPage", function() {
    postid = getQueryVariable("id");
    select_db_post(postid);     
});

function getQueryVariable(variable)
{
   var query = window.location.search.substring(1);
   var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

document.addEventListener('deviceready', function() {
 	setTimeout(function() { navigator.splashscreen.hide(); }, 3000);
});

function tarih(date){

	if(date % 1 !== 0) return false;  
	if(date<1000) return false;

	var time    = (parseInt(new Date().getTime()))/1000;
	var fark 	= time-parseInt(date); //to get the time since that moment

	if(fark<0) fark= fark * -1;
		
	var tokens = new Array();
		tokens[0] = "yıl";
		tokens[1] = "ay";
		tokens[2] = "hafta";
		tokens[3] = "gün";
		tokens[4] = "saat";
		tokens[5] = "dakika";
		tokens[6] = "saniye";
				
	var values = new Array();
		values[0] = 31536000;
		values[1] = 2592000;
		values[2] = 604800;
		values[3] = 86400;
		values[4] = 3600;
		values[5] = 60;
		values[6] = 1;
		
	for(i=0; i<=tokens.length; i++) {
		if(values[i] > fark) continue;
		var numberOfUnits=Math.ceil(fark/values[i]);
		return numberOfUnits+" "+tokens[i]+" once ";
	}
}

function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

function post(json) {

	document.getElementById("title").innerHTML = json.post.title;

    var html = "<h3>"+json.post.title+"</h3>";
    html += "<p>"+json.post.content+"</p>";

	document.getElementById("post").innerHTML = html;
}

function posts(json) {

    var html = "";

  	for (var i = 0; i < json.posts.length; i++)
	{
		
	   
	    if ("url" in json.posts[i]) {
	        var posturl = json.posts[i].url;	     
	    }

	    if ("id" in json.posts[i]) {
	        var postid = json.posts[i].id;	     
	    }
	    
	 	if ("title" in json.posts[i]) {
	      var postcontent = json.posts[i].title;}
		  
		  	if ("thumbnail" in json.posts[i]) {
	      var postthumbnail = json.posts[i].thumbnail;}
		  
		  
		  
	    else
	    if ("content" in json.posts[i]) {
	      var postcontent = json.posts[i].content;}
	    else var postcontent = "Başlıksız";

	    if (postcontent.length > 200) postcontent = strip(postcontent).substring(0,200);
	    else postcontent = strip(postcontent);

		if ("date" in json.posts[i]) {
	      	var date = json.posts[i].date;
	  	}
	  	else {
	  		var date = "null";
	  	}
	  	
	  	if(json.posts[i])
	  	{   
	  		data=json.posts[i];
	  		insert_db(data);
	  	}
	  	console.log(i+" = "+json.posts[i].categories[0].slug);
        html = html + "<li data-icon=\"false" + "\">" + "<a href=\"post.html?id=" + postid + "\" data-transition=\"slide"+"\">" + '<img src="' + postthumbnail + '"/ height="80px"/ width="80px"/>' + "<h3>" + postcontent + "</h3>" + "<p>" + date + "</p></a></li>";
        
        document.getElementById("postsList").innerHTML = html;
        $("#postsList").listview("refresh");
     
	}	
  limit_posts();	
}

function insert_db(data){
	  
      db.transaction(function(tx) {
       tx.executeSql("INSERT OR REPLACE INTO news_posts   (id,title,content,slug,thumbnail,url,date) VALUES (?,?,?,?,?,?,?)", [data.id,data.title,data.content,data.categories[0].slug,data.thumbnail,data.url,data.date], function(tx, res) {
           
       },
           function(err) {
          console.log("Error processing SQL: "+err.code);
        });
    });
}

function open_browser(link)
{
    window.open(link, '_blank', 'location=yes','closebuttoncaption=back');
}

function getParameter(query, url) {
 	var query = query.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
        var expr = "[\\?&]"+query+"=([^&#]*)";
        var regex = new RegExp( expr );
        var results = regex.exec( url );

	if(results!=null) return results[1];
	else return false;
}

function limit_posts(){    
    litod=10;  	 
	$('ul#postsList>li:nth-child('+litod+')').nextAll().css("display","none");
	listlength=$('ul#postsList >li').length;       
}


function initPushwoosh()
{
    var pushNotification = cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");
 
    //set push notifications handler
    document.addEventListener('push-notification', function(event) {
        var title = event.notification.title;
        var userData = event.notification.userdata;
                                 
        if(typeof(userData) != "undefined") {
            console.warn('user data: ' + JSON.stringify(userData));
        }
                                     
        alert(title);
    });
 
    //initialize Pushwoosh with projectid: "GOOGLE_PROJECT_ID", pw_appid : "PUSHWOOSH_APP_ID". This will trigger all pending push notifications on start.
    pushNotification.onDeviceReady({ projectid: "662603676948", pw_appid : "E7AD0-C0E62" });
 
    //register for pushes
    pushNotification.registerDevice(
        function(status) {
            var pushToken = status;
            console.warn('push token: ' + pushToken);
        },
        function(status) {
            console.warn(JSON.stringify(['failed to register ', status]));
        }
    );
}
function init() {
    document.addEventListener("deviceready", initPushwoosh, true);
 
    //rest of the code
}
document.addEventListener('push-notification', function(event) {
    //event.notification is a JSON push notifications payload
    var title = event.notification.title;
 
    //example of obtaining custom data from push notification
    var userData = event.notification.userdata;
 
    console.warn('user data: ' + JSON.stringify(userData));
 
    //we might want to display an alert with push notifications title
    alert(title);
});