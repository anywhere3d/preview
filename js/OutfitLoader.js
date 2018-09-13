//  outfitLoader.js (v1.2)

    var debugMode;

    var scriptsFolder  = "/scripts/";
    var skinnedFolder  = "/skinned/";
    var texturesFolder = "/textures/";

    var Avatars = {};

    var initOutfitAsset = initSkinnedAsset;

    if ( !!window.localforage ) {
        console.warn("LocalForage is deprecated.");
    }
/*
    if ( !!window.CacheStorage ) {
        console.warn("CacheStorage is deprecated.");
    }
*/
    function w3getOutfit( options ){

        var url  = options.url;
        var key  = options.key;
        var name = options.name;

        return new Promise( function(resolve, reject){

            w3.getHttpObject(url, function( json ){
            //  debugMode && console.log( "json:", json );
    
                json.sourceFile = url;  //  IMPORTANT  //
    
                Avatars[ name ] = initSkinnedAsset( json, url );
                if ( !Avatars[ name ].geometry.sourceFile ) {
                    Avatars[ name ].geometry.sourceFile = url; //  IMPORTANT  //
                }
    
            //  if ( !!options.loadStamp )   options.loadStamp( Avatars[ name ] );
                if ( !!options.loadTextures) options.loadTextures( Avatars[ name ] );
    
            //  Material settings.
                var asset = Avatars[ name ];
                var index = options.map.index;
        
                options.materials.forEach( function( material, i ){
                    if ( options.materials[i].metalness != undefined ) asset.material.materials[i].metalness = options.materials[i].metalness;
                    if ( options.materials[i].roughness != undefined ) asset.material.materials[i].roughness = options.materials[i].roughness;
                    if ( options.materials[i].side != undefined ) asset.material.materials[i].side = options.materials[i].side;
                    if ( options.materials[i].color != undefined ) asset.material.materials[i].color.setHex( options.materials[i].color );
                    if ( options.materials[i].emissive != undefined ) asset.material.materials[i].emissive.setHex( options.materials[i].emissive );
                    if ( options.materials[i].bumpScale != undefined ) asset.material.materials[i].bumpScale = options.materials[i].bumpScale;
                    if ( options.materials[i].displacementBias != undefined ) asset.material.materials[i].displacementBias  = options.materials[i].displacementBias;
                    if ( options.materials[i].displacementScale != undefined ) asset.material.materials[i].displacementScale = options.materials[i].displacementScale;
                    if ( options.materials[i].transparent != undefined ) asset.material.materials[i].transparent = options.materials[i].transparent;
                });
                
                resolve( Avatars[ name ] );
    
            });

        });

    }

//  "textureLoader" is for use inside the w3getOutfit options object.

    function textureLoader( asset ){

        if (!asset) {
            var error = [
                "asset", this.name, "not defined."
            ].join(" ");
            throw Error( error );
        }

    //  Asset map options.
        var options = this;
        var index = this.map.index;

    //  Set imgur url.
        var url = imgurQualityUrl( this.map );

    //  Load texture.
        var img = new Image(this.img.width, this.img.height);
        img.crossOrigin = this.img.cors || "anonymous"; // IMPORTANT: "anonymous";  //
        $(img).on("load", function(){
            var canvas = makePowerOfTwo( this );     // IMPORTANT: texture size must be power of 2. //
            var texture = new THREE.Texture(canvas); // img or canvas //
            texture.name = options.map.name;
            texture.sourceFile = url;       // IMPORTANT: Texture must carry sourceFile everywhere. //
            options.textures.forEach(function( name, i ){
                applyTexture( asset, texture, name, index );
            });
            $(this).remove();
        });

        img.src = url;

    }

/*
    //  Material settings.
        var index = this.map.index;

        this.materials.forEach( ( material, i ) => {
            if ( this.materials[i].metalness != undefined ) asset.material.materials[i].metalness = this.materials[i].metalness;
            if ( this.materials[i].roughness != roughness ) asset.material.materials[i].roughness = this.materials[i].roughness;
            if ( this.materials[i].side != undefined ) asset.material.materials[i].side = this.materials[i].side;
            if ( this.materials[i].color != undefined ) asset.material.materials[i].color.setHex( this.materials[i].color );
            if ( this.materials[i].emissive != undefined ) asset.material.materials[i].emissive.setHex( this.materials[i].emissive );
            if ( this.materials[i].bumpScale != undefined ) asset.material.materials[i].bumpScale = this.materials[i].bumpScale;
            if ( this.materials[i].displacementBias != undefined ) asset.material.materials[i].displacementBias  = this.materials[i].displacementBias;
            if ( this.materials[i].displacementScale != undefined ) asset.material.materials[i].displacementScale = this.materials[i].displacementScale;
            if ( this.materials[i].transparent != undefined ) asset.material.materials[i].transparent = this.materials[i].transparent;
        });
*/


    function textureMapLoader( options ){

        var url   = options.url;
        var map   = options.map;
        var name  = options.name;
        var index = options.index;
        var asset = options.asset;

        var img = new Image();
        img.crossOrigin = "anonymous";   //  IMPORTANT  //
        $(img).on("load", function (){
            var canvas = makePowerOfTwo( this );     // IMPORTANT: texture size must be power of 2. //
            var texture = new THREE.Texture(canvas); // img or canvas //
            texture.name = name;
            texture.sourceFile = url;       // IMPORTANT: Texture must carry sourceFile everywhere. //
            applyTexture( asset, texture, map, index );
            $(this).remove();
        });

        img.src = url;
    }

    function applyTexture( asset, texture, map, index ){

        if ( !texture ){
            var msg = "Outfit texture have not defined!";
            debugMode && console.error(msg);
            try { bootboxErrorAlert( msg ); } catch(err){ alert(msg); }
            return;
        }

        if ( !asset ) {
            var name = name || "asset";
            var msg = "Outfit <b>" + name + "</b> have not been defined!";
            debugMode && console.error(msg);
            try { bootboxErrorAlert( msg ); } catch(err){ alert(msg); }
            return;
        }

        if ( !asset.material.materials ) {
            var msg = "Outfit material is not of type multimaterial.";
            debugMode && console.error(msg);
            try { bootboxErrorAlert( msg ); } catch(err){ alert(msg); }
            return;
        } 

        if ( asset.material.materials.length == 0 ) {
            var msg = "Outfit multimaterial does not have materials.";
            debugMode && console.error(msg);
            try { bootboxErrorAlert( msg ); } catch(err){ alert(msg); }
            return;
        }

        var map = map || "map";

        if ( !! texture && asset.material.materials.length > 0 ) {

            if ( index == null || isNaN(index) ) index = 0;

        //  Dispose old texture.
            if ( !!asset.material.materials[index][map] 
            &&  asset.material.materials[index][map] instanceof THREE.Texture ){

                asset.material.materials[index][map].dispose();
                asset.material.materials[index][map] = null;
    
            }

            asset.material.materials[index][map] = texture;
            asset.material.materials[index][map].needsUpdate = true;
            asset.material.materials[index].needsUpdate = true;

        }
    }

    function initSkinnedAsset( json, url ){

        var loader = new THREE.JSONLoader();
        var object = loader.parse( json );

    //  Material.

        if ( !!object.materials ) {

            object.materials.forEach( function ( material ) {
                material.skinning = true;     // IMPORTANT //
            }); 
        }

    //  Switching to multimaterials.

    //  var multimaterial = new THREE.MeshFaceMaterial(); // <-- MultiMaterial. //

        if ( !!object.materials && object.materials.length > 0 ) {

            var multimaterial = new THREE.MeshFaceMaterial( object.materials );  // <-- MultiMaterial.
            for (var i = 0; i < multimaterial.materials.length; i++){
                if ( !multimaterial.materials[i].skinning ) {
                    multimaterial.materials[i].skinning = true;                   //  IMPORTANT  //
                }
            }

        } else {

            var multimaterial = new THREE.MeshFaceMaterial([
                new THREE.MeshStandardMaterial({skinning:true})
            ]);
        }

        if ( !multimaterial ) console.error("MultiMaterial did not defined:", multimaterial);

    //  Geometry.

        var geometry = object.geometry;
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();
        geometry.name = json.name;

        if ( !!json.sourceFile ) {
            geometry.sourceFile = json.sourceFile;  // IMPORTANT //
        } else if ( !!url ) {
            geometry.sourceFile = url;              // IMPORTANT //
        }

    //  Skinned mesh.

        var skinned = new THREE.SkinnedMesh( geometry, multimaterial );

        skinned.renderDepth = 1;
        skinned.frustumCulled = false;              // IMPORTANT //
        skinned.scale.set( 1, 1, 1 );
        skinned.position.set( 0, 0, 0 );
        skinned.rotation.set( 0, 0, 0 ); 

        return skinned;
    }

    function initMeshAsset( json, url ){

        var loader = new THREE.JSONLoader();
        var object = loader.parse( json );

    //  Material.

    //  Switching to multimaterials.

        if ( !!object.materials && object.materials.length > 0 ) {

            var multimaterial = new THREE.MeshFaceMaterial( object.materials );  // <-- MultiMaterial.
            for (var i = 0; i < multimaterial.materials.length; i++){
                if ( multimaterial.materials[i].skinning ) {
                    multimaterial.materials[i].skinning = false;                   //  IMPORTANT  //
                }
            }

        } else {

            var multimaterial = new THREE.MeshFaceMaterial([ 
                new THREE.MeshStandardMaterial({skinning:false}) 
            ]);
        }

        if ( !multimaterial ) console.error("MultiMaterial did not defined:", multimaterial);

    //  Geometry.

        var geometry = object.geometry;
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();
        geometry.name = json.name;

        if ( !!json.sourceFile ) {
            geometry.sourceFile = json.sourceFile;  // IMPORTANT //
        } else if ( !!url ) {
            geometry.sourceFile = url;              // IMPORTANT //
        }

    //  Mesh.

        var mesh = new THREE.Mesh( geometry, multimaterial );

        mesh.renderDepth = 1;
        mesh.frustumCulled = false;                 // IMPORTANT //
        mesh.scale.set( 1, 1, 1 );
        mesh.position.set( 0, 0, 0 );
        mesh.rotation.set( 0, 0, 0 ); 

        return mesh;
    }

    function imgurQualityUrl(options){

        if (!options.id) return "https://i.imgur.com/ODeftia.jpg";

        var dot    = ".";
        var ext    = options.ext || "jpg";
        var id     = options.id || "ODeftia";
        var q      = options.quality || "original";
        var imgur  = "https://i.imgur.com/";

        return imgur + imgurId( id, q ) + dot + ext;
    }

    function imgurId(id, quality){

        switch (quality) {

            case null:
            case undefined:
            case "original":
                break;
    
            case "small":
                id += "s";
                break;
    
            case "big":
                id += "b";
                break;
    
            case "thumb":
                id += "t";
                break;
    
            case "medium":
                id += "m";
                break;
    
            case "large":
                id += "l";
                break;

            case "huge":
                id += "h";
                break;

            default:
                id;
        }

        return id;
    }

    function makePowerOfTwo( image, natural ) {
        var canvas = document.createElement( "canvas" );

        if ( natural ){
            canvas.width = THREE.Math.nearestPowerOfTwo( image.naturalWidth );
            canvas.height = THREE.Math.nearestPowerOfTwo( image.naturalHeight );
        } else {
            canvas.width = THREE.Math.nearestPowerOfTwo( image.width );
            canvas.height = THREE.Math.nearestPowerOfTwo( image.height );
        }
        var context = canvas.getContext( "2d" );
        context.drawImage( image, 0, 0, canvas.width, canvas.height );

        debugMode && console.warn( "outfitLoader:makePowerOfTwo(img):", 
            "Image resized to:", canvas.width, "x", canvas.height, 
        );

        return canvas;
    }

    function getAvatarAssetPromise( url, name ){

        console.warn("DEPRECTED:", 
            "getAvatarAssetPromise(url, name) is deprecated.",
            "Use instead $.getJSON( url ).then(function(json){});" ,
            "or w3.getHttpObject( url, function(json){});"
        );

        return new Promise( function( resolve, reject ){
            w3.getHttpObject( url, function( json ){
            //  debugMode && console.log("json:", json);
                Avatars[ name ] = initSkinnedAsset( json );
            //  debugMode && console.log( name, Avatars[ name ] );
                resolve( Avatars[ name ] );
            });
        });
    }

    function $getOutfit(options, loadTextures, loadStamp){

        console.warn("DEPRECTED:", 
            "$getOutfit(options, loadTextures, loadStamp) is deprecated.",
            "Use instead w3getOutfit(options);",
        );

        var url  = options.url;
        var key  = options.key;
        var name = options.name;

        w3.getHttpObject(url, function( json ){
        //  debugMode && console.log( "json:", json );

            json.sourceFile = url;  //  IMPORTANT  //

            Avatars[ name ] = initSkinnedAsset( json, url );
            if ( !Avatars[ name ].geometry.sourceFile ) {
                Avatars[ name ].geometry.sourceFile = url; //  IMPORTANT  //
            }

            if ( !!options.loadStamp )   options.loadStamp( Avatars[ name ] );
            if ( !!options.loadTextures) options.loadTextures( Avatars[ name ] );

            if ( !!loadStamp ) {
                console.warn("DEPRECTED:", 
                    "$getOutfit(options, loadStamp) callback is deprecated.",
                    "Use instead options.loadStamp: function(asset){}",
                    loadStamp( Avatars[ name ] )
                );
            }

            if ( !!loadTextures ) {
                console.warn("DEPRECTED:", 
                    "$getOutfit(options, loadTextures) callback is deprecated.",
                    "Use instead options.loadTextures: function(asset){}",
                    loadTextures( Avatars[ name ] )
                );
            }

        });

    }

/*
//  OutfitLoader.js (zargodb)

    function $getOutfit( options ){

//        var url = options.url;
//        var col = options.col;
//        var name = options.name;
//        var object = options.obj;
//        var loadTextures = options.loadTextures;

        db.open(function(err, database){
            if (err) console.error( "db.error:", err );
        }).then( function(){

        //  var collection = db.collection( options.collection );
        //  console.log( "collection:", collection );
            options.collection = db.collection( options.col );
            console.log( "options:", options );

            $getJSON(options);

            function $getJSON(options){

                var url  = options.url;
                var name = options.name;
            //  var object = options.obj;
                var collection = options.collection;
                var loadTextures = options.loadTextures;

                collection.findOne({url:options.url}, function( err ){
                    if (err) { throw err; }
                }).then( function( result ){
                    console.log( "result:", result );

                    if ( !!result ) {

                        debugMode && console.log("%s: Getting from %s.", url, collection.name);
                        //object[ name ] = result[ name ];
                        Avatars[ name ] = initSkinnedAsset( result[ name ], url ); // object: Avatars.
                        if ( !Avatars[ name ].geometry.sourceFile ) {
                            Avatars[ name ].geometry.sourceFile = url;       //  IMPORTANT  //
                        }

                        if (!!loadTextures) loadTextures( Avatars[ name ] );


                    } else {

                        debugMode && console.log("%s: Getting from web.", url);
            
                        $.getJSON( url, function( json ){
                            console.log( url, json );
                        }).then( function( json ){

                            var data = {};
                            data._id = generateSalt(13);
                            data.url = url;    // IMPORTANT //
                            data.name = name;  // IMPORTANT //                            
                            data[ name ] = json; // or data.json ???

                            collection.insert(data, function(err){
                                if (err) { throw err; }
                            }).then( function(){
                                debugMode && console.log("%s: saved in %s", url, collection.name);
                            }).then( function(){
                                $getOutfit( options );
                            }).catch( function(err){
                                console.error(err);
                            });
        
                        });

                    }

                }).catch( function(err){
                    console.error(err);
                });

            }

        });

    } // end $getOutfit().

*/


/*
    function toLocalStore( key, data ){
        if (!window.localStorage) return;
        return localStorage[key] = JSON.stringify(data);
    }

    function fromLocalStore( key ){
        if (!window.localStorage) return;
        if ( !localStorage[key] ) return;
        return JSON.parse( localStorage[key] );
    }
*/




/*
    if ( index != null && !isNaN(index) ) {
        asset.material.materials[index][map] = texture;
        asset.material.materials[index][map].needsUpdate = true;
        asset.material.materials[index].needsUpdate = true;
    } else {
        asset.material.materials[0][map] = texture;
        asset.material.materials[0][map].needsUpdate = true;
        asset.material.materials[0].needsUpdate = true;
    }
*/

/*
    var material;
    if ( object.materials.length == 1 ) {
        material = object.materials[0];
        material.skinning = true;                                    //  IMPORTANT  //
    } else if ( object.materials.length > 1 ) {
        material = new THREE.MeshFaceMaterial(object.materials);     // <-- MultiMaterial //
        for (var i=0; i < material.materials.length; i++){
            material.materials[i].skinning = true;                   //  IMPORTANT  //
        }
    } else {
        material = new THREE.MeshStandardMaterial({skinning:true});  //  IMPORTANT  //
    }
*/

/*
    var material;
    if ( object.materials.length == 1 ) {
        material = object.materials[0];
        material.skinning = false;                                    // IMPORTANT //
    } else if ( object.materials.length > 1 ) {
        material = new THREE.MeshFaceMaterial(object.materials);
        for (var i=0; i < material.materials.length; i++){
            material.materials[i].skinning = false;                   // IMPORTANT //
        }
    } else {
        material = new THREE.MeshStandardMaterial({skinning:false});  // IMPORTANT //
    }
*/





/*
    if ( !!window.CacheStorage ) {
        console.warn("CacheStorage is deprecated.");
    
        CacheStorage.getItem(url).then(function( result ){ 
    
            if ( !result || JSON.stringify(result) == "{}" ) {
    
                debugMode && console.log("Outfit:", "Getting from web.");
    
                return $getJSON(options);
    
            } else {
    
                debugMode && console.log("Outfit:", "Getting from cache.");
    
                result.sourceFile = url;                             //  IMPORTANT  //
    
                Avatars[ name ] = initSkinnedAsset( result, url );
    
                if ( !Avatars[ name ].geometry.sourceFile ) {
                    Avatars[ name ].geometry.sourceFile = url;       //  IMPORTANT  //
                }
    
                if (!!loadTextures) loadTextures( Avatars[ name ] );
    
            }
    
        }).catch(function(err) {
            console.error(err);
        });
    }
*/

/*
    if ( !!window.CacheStorage ) {
        console.warn("CacheStorage is deprecated.");
    
        CacheStorage.setItem(url, json).then(function(result){
    
            if (!result) {
    
                var err = [ 
                    "AW3D Cache Error:", 
                    "No result returned:", 
                    result,
                ].join(" ");
                console.error(err);
                throw Error(err);
    
            } else if ( JSON.stringify(result) == "{}" ) {
    
                var err = [ 
                    "AW3D Cache Warning:", 
                    "empty object returned:", 
                    JSON.stringify(result),
                ].join(" ");
                console.warn(err);
                throw Error(err);
    
            } else {
    
                console.log("AW3D Cache:", "success!");
    
                Avatars[ name ] = initSkinnedAsset( result, url );
                if ( !Avatars[ name ].geometry.sourceFile ) {
                    Avatars[ name ].geometry.sourceFile = url;       //  IMPORTANT  //
                }
    
                if ( !!loadStamp )  loadStamp( Avatars[ name ] );
                if (!!loadTextures) loadTextures( Avatars[ name ] );
    
            }
    
        }).catch(function(err) {
            console.log(err);
            throw Error(err);
        });
    }
*/


/*
    //  return $getJSON(options); // deprecated

        function $getJSON(options){

            var url  = options.url;
            var key  = options.key;
            var name = options.name;

            $.getJSON( url ).then( function(json){

                json.sourceFile = url;  //  IMPORTANT  //

                Avatars[ name ] = initSkinnedAsset( result, url );
                if ( !Avatars[ name ].geometry.sourceFile ) {
                    Avatars[ name ].geometry.sourceFile = url; //  IMPORTANT  //
                }

                if ( !!loadStamp )  loadStamp( Avatars[ name ] );
                if (!!loadTextures) loadTextures( Avatars[ name ] );

            }).fail(function(err){
                console.error(err);
                throw Error(err);
            });

        }
*/
