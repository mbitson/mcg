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
				return $http.get(getClUrl('?format=json'));
			},
			getNew: function(){
				return $http.get(getClUrl('new?format=json'));
			},
			getTop: function () {
				return $http.get(getClUrl('top?format=json'));
			},
			getRandom: function () {
				return $http.get(getClUrl('random?format=json&numResults=20'));
			}
		}
	} ] );