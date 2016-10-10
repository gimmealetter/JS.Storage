/*!
 * Storage JavaScript Library v1.0.0
 *
 * Copyright Mr.Park and Km-Studio
 *
 * Date: 2016-10-07T17:23Z
 */
(function(global){
    //  Check if exists namespace `km` and not define km
    if( !("km" in global) ){ global.km={}; }
    if( !("lib" in global.km) ){ global.km.lib={}; }

var
    Storage = function(data){
        /* private variables */
        var _sep = "."; // seperate character

        /* public variables */
        this.basket = {};

        /* public methods */
        // set private _sep
        this.fn_setsep = Storage.fn_setsep = function(sep){
            if( !sep || kmCore.type(sep)!=="string" ){ return; }
                _sep = sep.toString();
        };
        // get private _sep
        this.fn_getsep = Storage.fn_getsep = function(){
            return _sep;
        };

        /* init storage */
        return classinit.apply(this, arguments);
    },
    /* inherited prototypes */
    Prototype = function(){},
    /* real init */
    classinit = function(data){
        /* init */
        if( data ) this.set(data);
    },
    info = {
        version: "1.0.0",
        author: "Mr.Park",
        Created: "Fall 2016",
        Updated: "10 October 2016"
    },
    datatype = ["object","array"]
;

    Prototype.prototype = {
        version: info.version,
        set: function(){
            var args=kmCore.args2array(arguments);
            args.unshift(this.basket);

            kmCore.setData.apply(this, args);
            args.pop();
            return kmCore.getData.apply(this, args);
        },
        get: function(){
            var args=kmCore.args2array(arguments);
            args.unshift(this.basket);

            return kmCore.getData.apply(this, args);
        },
        unset: function(){
            var args=kmCore.args2array(arguments);
            args.unshift(this.basket);

            return kmCore.unsetData.apply(this, args);
        },
        isDefined: function(){
            var args=kmCore.args2array(arguments);
            args.unshift(this.basket);

            return kmCore.isDefined.apply(this, args);
        },
        data: function(){
            return this.basket;
        },
        setsep: function(sep){
            if( sep ){ this.fn_setsep(sep); }
            else{ return this.fn_getsep(); }
        }
    };

/*    kmCore    */
var
    kmCore = {
        core_push: Array.prototype.push,
        core_slice: Array.prototype.slice,
        core_indexOf: Array.prototype.indexOf,
        core_toString: Object.prototype.toString,
        core_hasOwn: Object.prototype.hasOwnProperty,
        core_trim: String.prototype.trim,
        hasOwn: ({}).hasOwnProperty,
        type: function( obj ) {
            // from jQuery
            var class2type=kmCore.class2type();
            return obj === null ?
                String( obj ) :
                class2type[ kmCore.core_toString.call(obj) ] || "object";
        },
        class2type: function(){
            // from jQuery
            var tmp={};
            ("Boolean Number String Function Array Date RegExp Object").split(" ").filter(function(name) {
                tmp[ "[object " + name + "]" ] = name.toLowerCase();
            });
            return tmp;
        },
        args2array: function( arr, results ) {
            // from jQuery( makeArray )
            var type,
                ret = results || [];

            if ( arr !== null ) {
                // The window, strings (and functions) also have 'length'
                // Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
                type = kmCore.type( arr );

                if ( arr.length === null || type === "string" || type === "function" || type === "regexp" || (arr !== null && arr == arr.window) ) {
                    kmCore.core_push.call( ret, arr );
                } else {
                    kmCore.merge( ret, arr );
                }
            }

            return ret;
        },
        isPlainObject: function( obj ) {
            // from jQuery
            var key;
            if ( kmCore.type( obj ) !== "object" || obj.nodeType || kmCore.isWindow( obj ) ) {
                return false;
            }

            if ( obj.constructor &&
                    !kmCore.hasOwn.call( obj, "constructor" ) &&
                    !kmCore.hasOwn.call( obj.constructor.prototype || {}, "isPrototypeOf" ) ) {
                return false;
            }

            for ( key in obj ) {}
            return key === undefined || kmCore.hasOwn.call( obj, key );
        },
        isArray: Array.isArray || function( obj ) {
            // from jQuery
            var length = !!obj && typeof obj.length && obj.length,
                type = kmCore.type( obj );

            if ( type === "function" || kmCore.isWindow( obj ) ) {
                return false;
            }

            return type === "array" || length === 0 ||
                typeof length === "number" && length > 0 && ( length - 1 ) in obj;
        },
        isWindow: function( obj ){
            // from jQuery
            return obj !== null && obj === obj.window;
        },
        merge: function( first, second ) {
            // from jQuery
            var l = second.length,
                i = first.length,
                j = 0;

            if ( typeof l === "number" ) {
                for ( ; j < l; j++ ) {
                    first[ i++ ] = second[ j ];
                }

            } else {
                while ( second[j] !== undefined ) {
                    first[ i++ ] = second[ j++ ];
                }
            }

            first.length = i;

            return first;
        },
        inherit: function(){
            var args=kmCore.args2array(arguments),
                prototype, prototypes = {},
                F = function(){},
                Child = args.shift(),
                Parent = args.shift()
            ;
            if( !Child || !Child.constructor ) return;
            if( !Parent || !Parent.constructor ) return Child;
            if( args.length>0 ){
                args.unshift(Parent);
                Parent = kmCore.inherit.apply(kmCore.inherit, args);
            }
            F.prototype = new Parent();
            for( prototype in Child.prototype ) prototypes[prototype] = Child.prototype[prototype];
            Child.prototype = new F();
            for( prototype in prototypes ) Child.prototype[prototype] = prototypes[prototype];
            Child.prototype.constructor = Child;
            return Child;
        },
        setData: function(){
            var args=kmCore.args2array(arguments),
                cur=args.shift() /* parent object */,
                key=args.shift(), tmpkey, keys/* key name */,
                prevalue /* already saved value */,
                value /* value */,
                isStorage = !!(this instanceof Storage),
                sep = isStorage?this.fn_getsep():Storage.fn_getsep(),
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
                for( tmpkey in value ) kmCore.setData.apply(this, [cur, tmpkey, value[tmpkey]]);
                return cur;
            }

            // pop `value` before arrange args for `key`
            value=args.pop();

            // arrange args for `key`
            key=arrangeArgs4storage2array.apply(this, [key,args]);
            key=key.join(sep);
            if(  kmCore.type(key)!=="string" ) return;

            if( cur instanceof Storage  ) return cur.set.apply(cur, [key,value]);

            if( typeof value==="object" ){
                // if `prevalue` is not same value then unset `prevalue`
                if( (prevalue=kmCore.getData.apply(this, [cur, key])) ){
                    if( kmCore.type(value)!==kmCore.type(prevalue) ){
                        kmCore.unsetData.apply(this, [cur,key]);
                    }
                }
                if( kmCore.type(value)==="object" ){
                    // set empty object
                    if( !prevalue ){
                        tmpkey = null;
                        for( tmpkey in value ){}
                        if( tmpkey===null ){
                            kmCore.setData.apply(this, [cur, key, {"tmp":"tmp"}]);
                            kmCore.unsetData.apply(this, [cur, key, "tmp"]);
                        }
                    }
                    for( tmpkey in value ) kmCore.setData.apply(this, [cur, key+sep+tmpkey, value[tmpkey]]);
                }else if( kmCore.type(value)==="array" ){
                    // keep array type
                    if( !prevalue && value.length>0 ) kmCore.setData.apply(this, [cur, key, []]);
                    for( tmpkey=0;tmpkey<value.length;tmpkey++ ) kmCore.setData.apply(this, [cur, key+sep+tmpkey.toString(), value[tmpkey]]);
                }

                if( !prevalue ){}
                else if( !prevalue && kmCore.type(value)==="array" && value.length===0 ){}
                else return kmCore.getData.apply(this, [cur, key]);
            }

            keys = key.split(sep);
            for (key; keys.length && (key = keys.shift())!==undefined;) {
                if( !key ){
                    key=0;
                    for( n in cur ) if( parseInt(n)>=key ) key=parseInt(n)+1;
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
            var args=kmCore.args2array(arguments),
                tar, key,
                isStorage = !!(this instanceof Storage),
                sep = isStorage?this.fn_getsep():Storage.fn_getsep()
            ;

            // require a minimum one argument
            if( args.length<1 ) return null;
            if( args.length==1 ) {
                if( kmCore.type(args[0])==="string" ){
                    // string would be Global variable name
                    args = ["window"].concat(args);
                    return kmCore.getData.apply(this, args);
                }else if( kmCore.isArray(args[0]) ){
                    return kmCore.getData.apply(this, args.shift());
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
                    return kmCore.getData.apply(this, [tar].concat( args ));
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
            var args=kmCore.args2array(arguments), lastargs,
                data = kmCore.getData.apply(this, args),
                key,
                isStorage = !!(this instanceof Storage),
                sep = isStorage?this.fn_getsep():Storage.fn_getsep()
            ;

            if( data ){
                lastargs = arrangeArgs4storage2array(args.pop());
                key = lastargs.pop();
                args = args.concat(lastargs);

                if( (data=kmCore.getData.apply(this, args)) ){
                    if( data instanceof Storage  ) return data.unset.apply(data, [key]);
                    delete data[key];
                }
            }
        },
        isDefined: function(){
            var value;

            value = kmCore.getData.apply(this, arguments);
            return (value!==undefined);
        }
    };

    /*
    * all arguments insert into a array include sub arguments
    * [ 1,2,3,[4,5,6,[7,8,9]],10 ] => [1,2,3,4,5,6,7,8,9,10]
    */
    function arrangeArgs4storage2array(){
        var args=kmCore.args2array(arguments), length=args.length,
            reargs = [], i,
            isStorage = !!(this instanceof Storage),
            sep = isStorage ?
                this.fn_getsep() :
                ( Storage.fn_getsep ? Storage.fn_getsep() : "." )
        ;

        for( i=0;i<length;i++ ){
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
    ["setData","getData","unsetData","isDefined"].forEach(function(k){
        var nkey = k;
        if( (/Data$/).test(k) ){
            nkey = k.replace(/Data$/, "");
        }
        Storage[nkey] = kmCore[k];
    });

    Storage.version = info.version;

    global.kmStorage = global.km.lib.Storage = Storage;
})(this);