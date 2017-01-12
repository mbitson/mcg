/**
 * Created by mbitson on 7/14/2015.
 */
mcgApp.factory( 'ColourLovers', [ '$http', '$sce', function ( $http, $sce ) {
		var clUrl = 'http://www.colourlovers.com/api/palettes/';
	    var getClUrl = function(path) {
	    	return $sce.trustAsResourceUrl(clUrl + path);
		};
		return {
			get:     function () {
				return $http.jsonp(getClUrl('?jsonCallback=CLGetSuccess')).catch(function(e){console.log(e);});
			},
			getNew: function(){
				return $http.jsonp(getClUrl('new?jsonCallback=CLGetSuccess')).catch(function(e){console.log(e);});
			},
			getTop: function () {
				return $http.jsonp(getClUrl('top?jsonCallback=CLGetSuccess')).catch(function(e){console.log(e);});
			},
			getRandom: function () {
				return $http.jsonp(getClUrl('random?jsonCallback=CLGetSuccess&numResults=20')).catch(function(e){console.log(e);});
			}
		}
	} ] );