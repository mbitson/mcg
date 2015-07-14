/**
 * Created by mbitson on 7/14/2015.
 */
mcgApp.factory( 'ColourLovers', [ '$http', function ( $http ) {
		return {
			get:     function () {
				return $http.jsonp( 'http://www.colourlovers.com/api/palettes/?format=json&jsonCallback=JSON_CALLBACK' );
			},
			getNew: function(){
				return $http.jsonp( 'http://www.colourlovers.com/api/palettes/new?format=json&jsonCallback=JSON_CALLBACK' );
			},
			getTop: function () {
				return $http.jsonp( 'http://www.colourlovers.com/api/palettes/top?format=json&jsonCallback=JSON_CALLBACK' );
			},
			getRandom: function () {
				return $http.jsonp( 'http://www.colourlovers.com/api/palettes/random?format=json&jsonCallback=JSON_CALLBACK&numResults=20' );
			}
		}
	} ] );