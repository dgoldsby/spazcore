/**
 * a library to get direct image urls for various image hosting servces 
 */
function SpazImageURL(args) {
	
	this.apis = {};
	
	this.initAPIs();
	
};

/**
 * Creates the initial default set of API descriptions 
 */
SpazImageURL.prototype.initAPIs = function() {
	this.addAPI('twitpic', {
		'url_regex'       : /http:\/\/twitpic.com\/([a-zA-Z0-9]+)/gi,
		'getThumbnailUrl' : function(id) {
			var url = 'http://twitpic.com/show/thumb/'+id;
			return url;
		},
		'getImageUrl'     : function(id) {
			return null;
		}
	});


	this.addAPI('yfrog', {
		'url_regex'       : /http:\/\/yfrog.com\/([a-zA-Z0-9]+)/gi,
		'getThumbnailUrl' : function(id) {
			var url = 'http://yfrog.com/'+id+'.th.jpg';
			return url;
		},
		'getImageUrl'     : function(id) {
			return null;
		}
	});
	
	
	this.addAPI('twitgoo', {
		'url_regex'       : /http:\/\/twitgoo.com\/([a-zA-Z0-9]+)/gi,
		'getThumbnailUrl' : function(id) {
			var url = 'http://twitgoo.com/show/thumb/'+id;
			return url;
		},
		'getImageUrl'     : function(id) {
			var url = 'http://twitgoo.com/show/img/'+id;
			return url;
		}
	});
	
	
	
	this.addAPI('pikchur', {
		'url_regex'       : /http:\/\/pikchur.com\/([a-zA-Z0-9]+)/gi,
		'getThumbnailUrl' : function(id) {
			// http://img.pikchur.com/pic_GPT_t.jpg
			var url = 'http://img.pikchur.com/pic_'+id+'_t.jpg';
			return url;
		},
		'getImageUrl'     : function(id) {
			//http://img.pikchur.com/pic_GPT_l.jpg
			var url = 'http://img.pikchur.com/pic_'+id+'_l.jpg';
			return url;
		}
	});
	
	
	this.addAPI('tweetphoto', {
		'url_regex'       : /http:\/\/tweetphoto.com\/([a-zA-Z0-9]+)/gi,
		'getThumbnailUrl' : function(id) {
			// http://TweetPhotoAPI.com/api/TPAPI.svc/json/imagefromurl?size=thumbnail&url=http://tweetphoto.com/iyb9azy4
			var url = 'http://TweetPhotoAPI.com/api/TPAPI.svc/imagefromurl?size=thumbnail&url=http://tweetphoto.com/'+id;
			return url;
		},
		'getImageUrl'     : function(id) {
			// http://TweetPhotoAPI.com/api/TPAPI.svc/imagefromurl?size=big&url=http://tweetphoto.com/iyb9azy4
			var url = 'http://TweetPhotoAPI.com/api/TPAPI.svc/imagefromurl?size=big&url=http://tweetphoto.com/'+id;
			return url;
		}
	});
	
	
	this.addAPI('pic.gd', {
		'url_regex'       : /http:\/\/pic.gd\/([a-zA-Z0-9]+)/gi,
		'getThumbnailUrl' : function(id) {
			// http://TweetPhotoAPI.com/api/TPAPI.svc/json/imagefromurl?size=thumbnail&url=http://pic.gd/iyb9azy4
			var url = 'http://TweetPhotoAPI.com/api/TPAPI.svc/imagefromurl?size=thumbnail&url=http://pic.gd/'+id;
			return url;
		},
		'getImageUrl'     : function(id) {
			// http://TweetPhotoAPI.com/api/TPAPI.svc/imagefromurl?size=big&url=http://pic.gd/iyb9azy4
			var url = 'http://TweetPhotoAPI.com/api/TPAPI.svc/imagefromurl?size=big&url=http://pic.gd/'+id;
			return url;
		}
	});	
};


/**
 * retrieve APIs 
 * @return {array}
 */
SpazImageURL.prototype.getAPIs = function() {
	return this.apis;	
};

/**
 * get an api for a service
 * @param {string} service_name 
 * @return {object}
 */
SpazImageURL.prototype.getAPI = function(service_name) {
	
	return this.apis[service_name];
	
};

/**
 * add a new API for a service
 * @param {string} service_name
 * @param {object} opts (url_regex regexp, getThumbnailUrl method, getImageUrl method)
 */
SpazImageURL.prototype.addAPI = function(service_name, opts) {
	
	var newapi = {};
	newapi.url_regex       = opts.url_regex;       // a regex used to look for this service's urls, must provide a parens match for image ID code
	newapi.getThumbnailUrl = opts.getThumbnailUrl; // a function
	newapi.getImageUrl     = opts.getImageUrl;     // a function
	
	this.apis[service_name] = newapi;
	
};

/**
 * find the image service URLs that work with our defined APIs in a given string
 * @param {string} str
 * @return {object|null} an object of services (keys) and an array of their matches (vals)
 */
SpazImageURL.prototype.findServiceUrlsInString = function(str) {
	
	var matches = {}, num_matches = 0, urls = [], key;
	
	for (key in this.apis) {
		
		var thisapi = this.getAPI(key);
		
		urls = thisapi.url_regex.exec(str);
		if (urls && urls.length > 0) {
			matches[key] = urls;
			num_matches++;
		}
	}
	
	if (num_matches > 0) {
		return matches;
	} else {
		return null;
	}
	
};

/**
 * find the image service URLs that work with our defined APIs in a given string
 * @param {object} matches
 * @return {object|null} fullurl:thumburl key:val pairs
 */
SpazImageURL.prototype.getThumbsForMatches = function(matches) {
	var x, service, api, thumburl, thumburls = {}, num_urls = 0;
	
	for (service in matches) {
		api = this.getAPI(service);
		urls = matches[service]; // an array
		
		thumburls[urls[0]] = api.getThumbnailUrl(urls[1]);
		num_urls++;
	}
	
	if (num_urls > 0) {
		return thumburls;
	} else {
		return null;
	}
};


/**
 * given a string, this returns a set of key:val pairs of main url:thumbnail url
 * for image hosting services for urls within the string
 * @param {string} str
 * @return {object|null} fullurl:thumburl key:val pairs
 */
SpazImageURL.prototype.getThumbsForUrls = function(str) {
	var matches = this.findServiceUrlsInString(str);
	if (matches) {
		return this.getThumbsForMatches(matches);
	} else {
		return null;
	}
	
};