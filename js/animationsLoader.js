//  animationsLoader.js

    var debugMode;

    var Animations       = {}; // object.
    var MaleAnimations   = {}; // object.
    var FemaleAnimations = {}; // object.
    
    var animationsFolder = "/animations/";

    function $getAnimation( options ){

    //  version: 1.0
        var url = options.url;
        var key = options.key;
        var name = options.name;
        var object = options.obj;

        return $.getJSON( url, function( json ){

            object[ name ] = json;

            if ( !!localPlayer && !!localPlayer.outfit ) {
                localPlayer.outfit.AnimationsHandler.refresh();
            }

        });

    }

//  Skeleton.
    var idleUrl = animationsFolder + "basic_idle_animation_3sec.js";
    var walkUrl = animationsFolder + "basic_walkcycle_animation_1sec_v1.js";
    var runUrl  = animationsFolder + "basic_walkcycle_animation_1sec.js";
    var jumpUrl = animationsFolder + "basic_jumping_animation_1.5sec.js";

    $getAnimation({
        url:idleUrl, 
        key:"idle", 
        name:"idle", 
        obj:Animations
    });

    $getAnimation({
        url:walkUrl, 
        key:"walk", 
        name:"walk", 
        obj:Animations
    });

    $getAnimation({
        url:runUrl, 
        key:"run", 
        name:"run", 
        obj:Animations
    });

    $getAnimation({
        url:jumpUrl, 
        key:"jump", 
        name:"jump", 
        obj:Animations
    });

//  Male.
    var hmIdleUrl = animationsFolder + "male_idle_animation_3sec.js";
    var hmWalkUrl = animationsFolder + "male_walkcycle_animation_1sec_v1.js";
    var hmRunUrl  = animationsFolder + "male_walkcycle_animation_1sec.js";
    var hmJumpUrl = animationsFolder + "male_jumping_animation_2sec_v5.js";

    $getAnimation({
        url:hmIdleUrl, 
        key:"aw3d.animation.male.idle", 
        name:"idle", 
        obj:MaleAnimations
    });

    $getAnimation({
        url:hmWalkUrl, 
        key:"aw3d.animation.male.walk", 
        name:"walk", 
        obj:MaleAnimations
    });

    $getAnimation({
        url:hmRunUrl, 
        key:"aw3d.animation.male.run", 
        name:"run", 
        obj:MaleAnimations
    });

    $getAnimation({
        url:hmJumpUrl, 
        key:"aw3d.animation.male.jump", 
        name:"jump", 
        obj:MaleAnimations
    });

//  Female.
    var hfIdleUrl = animationsFolder + "female_idle_animation_3sec_v2.js";
    var hfWalkUrl = animationsFolder + "female_walkcycle_animation_1sec_v4.js";
    var hfRunUrl  = animationsFolder + "female_walkcycle_animation_1sec_v3.js";
    var hfJumpUrl = animationsFolder + "female_jumping_animation_2sec_v8.js";

    $getAnimation({
        url:hfIdleUrl, 
        key:"aw3d.animation.female.idle", 
        name:"idle", 
        obj:FemaleAnimations
    });

    $getAnimation({
        url:hfWalkUrl, 
        key:"aw3d.animation.female.walk", 
        name:"walk", 
        obj:FemaleAnimations
    });

    $getAnimation({
        url:hfRunUrl, 
        key:"aw3d.animation.female.run", 
        name:"run", 
        obj:FemaleAnimations
    });

    $getAnimation({
        url:hfJumpUrl, 
        key:"aw3d.animation.female.jump", 
        name:"jump", 
        obj:FemaleAnimations
    });


// --------------------------------------- DEPRECATED --------------------------------------- //
/*
    function $getAnimation( options ){
    
    //  version: 0.9
        console.warn( "DEPRECATED: This version of $getAnimation() is deprecated." );
        return;

        var url = options.url;
        var key = options.key;
        var name = options.name;
        var object = options.obj;

        CacheStorage.getItem(url).then(function(result){

        //  debugMode && console.log("result:", result);

            if ( !result || JSON.stringify(result) == "{}" ) {

                debugMode && console.log("Animations:", "Getting from web.");

                return $getJSON( options );

            } else {

                debugMode && console.log("Animations:", "Getting from cache.");

                object[ name ] = result;
                if ( !!localPlayer && !!localPlayer.outfit ) {
                    localPlayer.outfit.AnimationsHandler.refresh();
                }
            }

        }).catch(function(err) {
            console.error(err);
        });

        function $getJSON(options){

            var url = options.url;
            var key = options.key;
            var name = options.name;
            var object = options.obj;

            return $.getJSON( url, function(data){

                CacheStorage.setItem(url, data).then(function(result){

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
                        object[ name ] = result;
                        if ( !!localPlayer && !!localPlayer.outfit ) {
                            localPlayer.outfit.AnimationsHandler.refresh();
                        }
                    }
                    
                }).catch(function(err) {
                    console.log(err);
                    throw Error(err);
                });

            });
        }
    }
*/
