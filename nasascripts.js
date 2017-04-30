var lat = 0;
var long = 0;
var topic = '';
var username = '';
var A = context.get("A") || [];
var B = context.get("B") || [];


// long = msg.payload.results[0].geometry
lat = msg.payload.results[0].geometry.bounds.northeast.lat;
long = msg.payload.results[0].geometry.bounds.northeast.lng;
topic = msg.topic;

var tweet;
var twitterHandle = '@' + topic.replace('tweets/','');

Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

if(A.length > 1) {
    
    var n = '';
    
    var lat1 = Math.abs(lat);
    var lat2 = Math.abs(A[0].lat);
    var long1 = Math.abs(long);
    var long2 = Math.abs(A[0].lon);
    	
    var R = 6371e3; // metres
    var φ1 = Math.radians(lat1);
    var φ2 = Math.radians(lat2);
    var Δφ = (lat2-lat1);
    var Δλ = Math.abs(long2-long1);

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    var d = R * c;
    
    if (d>2000){
        n = 'Green';
        tweet = ' ' + "You are in a clear";
        
    }else if(1000<=d<=2000){
        n = 'Orange';
        
        tweet = ' ' + "please try and help others around you";
        
    } else {
        n = 'Red';
        tweet = ' ' + "Get out now you are to close!!";

    }
    
    msg.preparing = {
        name: "tweet" + A.length,
        tweet: tweet,
        lat: lat,
        lon: long,
        radius: 1000,
        // icon: "fa-fire",
        iconColor: n,
    };
    A.push(msg.preparing);
    
    context.set("A", A);
    msg.preparing = A;
    return msg;
    
    
} else {

msg.preparing = {
    name: "tweet" + A.length,
    tweet: ' ' + ' get out now you are too close',
    lat: lat,
    lon: long,
    radius: 1000,
    // icon: "fa-fire",
    iconColor: "red",
    };
    
    A.push(msg.preparing);
    
    context.set("A", A);
    msg.preparing = A;
    return msg;
}

msg.preparing = msg.preparing[msg.preparing.length-1];
var something = msg.preparing.tweet;
var watsonResponse = msg.payload.output.text;

var topics = msg.topic
var twitterHandle = '@' + topics.replace('tweets/','');

msg.preparing = something;
msg.payload = watsonResponse;

msg.params = {
    username: twitterHandle,
    message: something,
    watsonResponse: watsonResponse,
}

msg.payload = msg.params.username + ' ' + msg.params.message + ' ' + msg.params.watsonResponse;


return msg;







