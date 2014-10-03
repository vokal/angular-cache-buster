angular.module( "ngCacheBuster", [] )
	.config( [ "$httpProvider", function( $httpProvider )
	{
		return $httpProvider.interceptors.push('httpRequestInterceptorCacheBuster');
	} ] )
    .provider( "httpRequestInterceptorCacheBuster", function () 
    {	
		this.matchlist = [ /\.html/gi ];
		
		//Default to whitelist (i.e. block all except matches)
		this.black = false;
		this.key = "version";
		this.version = "{{ VERSION }}";
		
		//Select blacklist or whitelist, default to whitelist
		this.setMatchlist = function( list, black )
		{
		    this.black = typeof black !== 'undefined' ? black : false
		    this.matchlist = list;
		};
		
		this.$get = ['$q', '$log', 
			function( $q, $log )
			{
			    var matchlist = this.matchlist;
			    var key = this.key;
			    var version = this.version;

			    return {
					"request": function( config )
					{
					    for( var i = 0; i < matchlist.length; i++ )
					    {
							if( config.url.match( matchlist[ i ] ) ) 
							{
								config.url += ( config.url.indexOf('?') === -1 ? '?' : '&' ) + key + '=' + version;
								break;
							}
					    }

					    return config || $q.when( config );
					}
			    }
			} ];
    });
