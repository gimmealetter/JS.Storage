/*!
 * Storage JavaScript Library v1.1.0
 *
 * Copyright Mr.Park and Km-Studio
 *
 * Date: 2016-12-08T12:00Z
 */
(function(global){
    //  Check if exists namespace `km` and not define km
    if( !("km" in global) ){ global.km = {}; }
    if( !("lib" in global.km) ){ global.km.lib = {}; }

var kmCore, Storage, _sep = "."
	, cb = function(){
		Storage = function(){
			/* private variables */
			var _sep = ".",  // seperate character
				_isDeep  // is reference
			;

			if( !(this instanceof Storage) ){
				var args = kmCore.args2array(arguments); args.unshift(undefined);
				return new (Function.prototype.bind.apply(Storage, args))();
			}

			/* public variables */
			this.basket = {};

			/* public methods */
			// set private _sep
			this.fn_setsep = function(sep){
				if( !sep || kmCore.type(sep)!=="string" ){ return; }
					_sep = sep.toString();
			};
			// get private _sep
			this.fn_getsep = function(){
				return _sep;
			};
			// get private _sep
			this.fn_isdeep = function(){
				return _isDeep;
			}

			var args = kmCore.args2array(arguments), _isDeep = !!(kmCore.type(args[0])==="boolean");

			if( _isDeep ) _isDeep = !!(args.shift());

			/* init storage */
			return classinit.apply(this, args);
		},
		/* inherited prototypes */
		Prototype = function(){},
		/* real init */
		classinit = function(){
			/* init */
			if( arguments.length ){
				if( this.fn_isdeep() ) this.basket = arguments[0];
				else this.set.apply(this, arguments);
			}
		},
		info = {
			version: "1.1.0",
			author: "Mr.Park",
			Created: "Fall 2016",
			Updated: "8 December 2016"
		},
		datatype = ["object", "array"],
		__Core = {
			setData: function(){
				var args = kmCore.args2array(arguments),
					cur = args.shift() /* parent object */,
					key = args.shift(), tmpkey, keys/* key name */,
					prevalue /* already saved value */,
					value /* value */,
					isStorage = !!(this instanceof Storage),
					sep = isStorage?this.fn_getsep():Storage.fn_getsep(),
					isFirstDeepFlag = isStorage?this.fn_isdeep():false,
					n
				;

				// if `parent object` is null or is not typeof object then parent object must be object of `window`
				if( !cur || kmCore.type(cur)!=="object" ){
					if( isStorage ) return;
					if( !cur.constructor ){
						if( cur ){
							if( key ) args.unshift(key);
							key = cur;
						}
						cur = global;
					}
				}
				if( !key ) return;

				// if `key` is plain object then key must be data object
				if( kmCore.type(key)==="object" ){
					value = key;
					for( tmpkey in value ){					
						if( !(kmCore.hasOwn.call( value, tmpkey )) ) continue;
						__Core.setData.apply(this, [cur, tmpkey, value[tmpkey]]);
					}
					return cur;
				}

				// pop `value` before arrange args for `key`
				value = args.pop();

				// arrange args for `key`
				key = arrangeArgs4storage2array.apply(this, [key, args]);
				key = key.join(sep);
				if(  kmCore.type(key)!=="string" ) return;

				if( cur instanceof Storage  ) return cur.set.apply(cur, [key, value]);
				
				if( typeof value==="object" ){
					// if `prevalue` is not same value then unset `prevalue`
					if( (prevalue = __Core.getData.apply(this, [cur, key])) ){
						if( kmCore.type(value)!==kmCore.type(prevalue) ){
							__Core.unsetData.apply(this, [cur, key]);
							prevalue = null;
						}
					}
					if( kmCore.type(value)==="object" ){
						// set empty object
						if( !prevalue ) cur[key] = {};
						for( tmpkey in value ) __Core.setData.apply(this, [cur, key+sep+tmpkey, value[tmpkey]]);
					}else if( kmCore.type(value)==="array" ){
						// keep array type
						if( !prevalue ) cur[key] = [];
						for( tmpkey = 0; tmpkey < value.length; tmpkey++ ) __Core.setData.apply(this, [cur, key+sep+tmpkey.toString(), value[tmpkey]]);
					}

					return __Core.getData.apply(this, [cur, key]);
				}

				keys = key.split(sep);
				for (key; keys.length && (key = keys.shift())!==undefined;) {
					if( !key ){
						key = 0;
						for( n in cur ) if( parseInt(n)>=key ) key = parseInt(n)+1;
					}
					if (!keys.length && typeof value !== "undefined"){
						if( cur.constructor ){
						}else{
							if( datatype.indexOf(kmCore.type(cur))===-1 ){
								throw "Could not set property of "+ kmCore.type(cur) +" type!";
							}
							if( kmCore.type(cur)==="array" && isNaN(key=parseInt(key)) ){
								throw "Could not set property of "+ kmCore.type(cur) +" type!";
							}
						}
						cur[key] = value;
					} else if (cur[key] !== undefined){
						cur = cur[key];
					} else{
						cur = cur[key] = {};
					}
				}
				return cur;
			},
			getData: function(){
				var args = kmCore.args2array(arguments),
					tar, key,
					isStorage = !!(this instanceof Storage),
					sep = isStorage?this.fn_getsep():Storage.fn_getsep()
				;

				// require a minimum one argument
				if( args.length < 1 ) return null;
				if( args.length == 1 ) {
					if( kmCore.type(args[0])==="string" ){
						// string would be Global variable name
						args = ["window"].concat(args);
						return __Core.getData.apply(this, args);
					}else if( kmCore.isArray(args[0]) ){
						return __Core.getData.apply(this, args.shift());
					}else if( kmCore.type(args[0])!=="string" ){
						return typeof args[0]!=="undefined"? args[0] : undefined ;
					}
				}

				tar = tar || args.shift();
				if( kmCore.type(tar)==="string" ){
					if( tar!=="window" ) args.unshift(tar);
					tar=global;
				}

				// arrange args for `key`
				key = arrangeArgs4storage2array.apply(this, args);

				if( tar instanceof Storage  ) return tar.get.apply(tar, key);

				// if tar is expected object and key has depth
				if( tar && (datatype.indexOf(kmCore.type(tar))>-1||kmCore.isWindow(tar)||tar.constructor) && (kmCore.isArray(key) && key.length>1) ){
					args = key;
					key = args.shift();

					tar = tar[key];
					if( tar && (datatype.indexOf(kmCore.type(tar))>-1||kmCore.isWindow(tar)||tar.constructor) ){
						return __Core.getData.apply(this, [tar].concat( args ));
					}
					// continue
					key = args.shift();
				}
				if( kmCore.isArray(key) ) key=key.shift();

				if( tar && tar.constructor ){
					if( !(kmCore.hasOwn.call( tar, key )) ) tar = undefined;
					else return tar[key];
				}
				if( typeof tar==="undefined" || datatype.indexOf(kmCore.type(tar))===-1 || typeof tar[key]==="undefined" ) return undefined;
				return tar[key];
			},
			unsetData: function(){
				var args = kmCore.args2array(arguments), lastargs,
					data = __Core.getData.apply(this, args),
					key,
					isStorage = !!(this instanceof Storage),
					sep = isStorage?this.fn_getsep():Storage.fn_getsep()
				;

				if( data ){
					lastargs = arrangeArgs4storage2array(args.pop());
					key = lastargs.pop();
					args = args.concat(lastargs);

					if( (data = __Core.getData.apply(this, args)) ){
						if( data instanceof Storage  ) return data.unset.apply(data, [key]);
						delete data[key];
					}
				}
			},
			isDefined: function(){
				var value;

				value = __Core.getData.apply(this, arguments);
				return (value!==undefined);
			}
		}
		;
		Storage.fn_setsep = function(sep){
			if( !sep || kmCore.type(sep)!=="string" ){ return; }
				_sep = sep.toString();
		};
		// get private _sep
		Storage.fn_getsep = function(){
			return _sep;
		};

		Prototype.prototype = {
			version: info.version,
			set: function(){
				var args = kmCore.args2array(arguments);
				
				args.unshift(this.basket);

				__Core.setData.apply(this, args);
				args.pop();
				return __Core.getData.apply(this, args);
			},
			get: function(){
				var args = kmCore.args2array(arguments);
				args.unshift(this.basket);

				return __Core.getData.apply(this, args);
			},
			unset: function(){
				var args = kmCore.args2array(arguments);
				args.unshift(this.basket);

				return __Core.unsetData.apply(this, args);
			},
			isDefined: function(){
				var args = kmCore.args2array(arguments);
				args.unshift(this.basket);

				return __Core.isDefined.apply(this, args);
			},
			data: function(){
				return this.basket;
			},
			setsep: function(sep){
				if( sep ){ this.fn_setsep(sep); }
				else{ return this.fn_getsep(); }
			}
		};

		/*
		* all arguments insert into a array include sub arguments
		* [ 1,2,3,[4,5,6,[7,8,9]],10 ] => [1,2,3,4,5,6,7,8,9,10]
		*/
		function arrangeArgs4storage2array(){
			var args = kmCore.args2array(arguments), length = args.length,
				reargs = [], i,
				isStorage = !!(this instanceof Storage),
				sep = isStorage ?
					this.fn_getsep() :
					( Storage.fn_getsep ? Storage.fn_getsep() : "." )
			;

			for( i = 0; i < length; i++ ){
				if( ("Boolean Function Date RegExp Object").toLowerCase().split(" ").indexOf(kmCore.type(args[i]))===-1 ){
					if( kmCore.type(args[i])==="string" && args[i].split(sep).length>1 ) args[i] = args[i].split(sep);
					if( kmCore.type(args[i])==="array" ) reargs=reargs.concat(arrangeArgs4storage2array.apply(this, args[i]));
					else reargs.push( args[i] );
				}
			}
			return reargs;
		}

		kmCore.inherit( Storage, Prototype );

		// for Global kmStorage(km.lib.Storage)
		["setData", "getData", "unsetData", "isDefined"].forEach(function(k){
			var nkey = k;
			if( (/Data$/).test(k) ){
				nkey = k.replace(/Data$/, "");
			}
			Storage[nkey] = __Core[k];
		});

		Storage.version = info.version;

		global.KMStorage = global.km.lib.Storage = Storage;
}

if( !global.km.Core ){
	try{
		var core_uri='/js/km/km.lib.core.1.0.0.js', xhrObj = new XMLHttpRequest();
		core_uri='https://raw.githubusercontent.com/gimmealetter/JS.KMCore/master/lib/km.core.lastest.js';
		xhrObj.open('GET', core_uri, false);
		xhrObj.send(null);
		eval(xhrObj.responseText);
		kmCore = global.km.Core;
		cb();
	}catch(e){ console.log(e);console.log(e.message) }
}else{
	kmCore = global.km.Core;
	cb();
}

})(this);
