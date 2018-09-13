//  anywheredb.js

    var db_VERSION = 2;
    var db_NAME = "anywheredb";
    
    var db = new zango.Db( db_NAME, db_VERSION, {
        user: true,
        objects: true,
        geometries: true,
        materials: true,
        textures: true,
        images: true,
        files: true,
        assets: true,
        avatars: true,
        outfits: true,
        bones: true,
        poses: true,
        animations: true,
        gallery: true,        
        snapshots: true,
        skyboxes: true,
        players: true,
        scenes: true,
        demo: true,
        scratchpad: true,
    });

    db.open(function(err, database){
        if (err) console.log( err );
    }).then( function(){
/*
    //  console.log("Collections:");
        USER = db.collection('user');              //  console.log(db._cols.user._name );
        OBJECTS = db.collection('objects');        //  console.log(db._cols.objects._name );
        GEOMETRIES = db.collection('geometries');  //  console.log(db._cols.geometries._name );
        MATERIALS = db.collection('materials');    //  console.log(db._cols.materials._name );
        TEXTURES = db.collection('textures');      //  console.log(db._cols.textures._name );
        IMAGES = db.collection('images');          //  console.log(db._cols.images._name );
        FILES = db.collection('files');            //  console.log(db._cols.files._name );
        ASSETS = db.collection('assets');          //  console.log(db._cols.assets._name );
        AVATARS = db.collection('avatars');        //  console.log(db._cols.avatars._name );
        OUTFITS = db.collection('outfits');        //  console.log(db._cols.outfits._name );
        BONES = db.collection('bones');            //  console.log(db._cols.bones._name );
        POSES = db.collection('poses');            //  console.log(db._cols.poses._name );
        ANIMATIONS = db.collection('animations');  //  console.log(db._cols.animations._name );
        GALLERY = db.collection('gallery');        //  console.log(db._cols.gallery._name );
        SNAPSHOTS = db.collection('snapshots');    //  console.log(db._cols.snapshots._name );
        SKYBOXES = db.collection('skyboxes');      //  console.log(db._cols.skyboxes._name );
        PLAYERS = db.collection('players');        //  console.log(db._cols.players._name );
        SCENES = db.collection('scenes');          //  console.log(db._cols.scenes._name );
        DEMO = db.collection('demo');              //  console.log(db._cols.demo._name );
        SCRATCHPAD = db.collection('scratchpad');  //  console.log(scratchpad._name );
*/
        debugMode && console.log("Database %s ready for use.", db.name);

    });
















