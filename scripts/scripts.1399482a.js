"use strict";!function(){PDFJS.workerSrc="bower_components/pdfjs-dist/build/pdf.worker.js"}(),angular.module("lilybook",["ngAnimate","ngAria","ngMaterial","ngSanitize","ngTouch","pdf","ui.bootstrap","ui.router","ui.utils","xeditable","youtube-embed"]),angular.module("lilybook").config(["$locationProvider",function(a){a.html5Mode(!1).hashPrefix("!")}]),angular.module("lilybook").config(["$stateProvider","$urlRouterProvider",function(a,b){a.state("app",{"abstract":!0,url:"",templateUrl:"views/layout.html"}).state("app.splash",{url:"/",templateUrl:"views/splash.html",controller:"SplashCtrl",controllerAs:"splash"}).state("app.login",{url:"/login",templateUrl:"views/pages/login.html"}).state("app.signup",{url:"/signup",templateUrl:"views/pages/signup.html"}).state("app.home",{url:"/home",templateUrl:"views/home.html",controller:"HomeCtrl",controllerAs:"home",resolve:{auth:["userSvc",function(a){return a.isAuthenticated()}]}}).state("app.composers",{url:"/composers",templateUrl:"views/composers.html",controller:"ComposersCtrl",controllerAs:"composers",resolve:{auth:["userSvc",function(a){return a.isAuthenticated()}]}}).state("app.composer",{url:"/composer/:vanity",templateUrl:"views/pages/composer.html",controller:"ComposerCtrl",controllerAs:"composer"}).state("app.composition",{url:"/composition/:vanity/:id",templateUrl:"views/pages/composition.html",controller:"CompositionCtrl",controllerAs:"composition"}),b.otherwise("/")}]),angular.module("lilybook").run(["editableOptions",function(a){a.theme="bs3"}]),angular.module("lilybook").config(["$stateProvider",function(a){a.state("admin",{"abstract":!0,url:"/admin",template:"<ui-view/>"}).state("admin.composition",{"abstract":!0,url:"/composition/:id",params:{id:{value:null,squash:!0}},templateUrl:"views/admins/composition.html",controller:"AdminCompositionCtrl",controllerAs:"composition",resolve:{auth:["userSvc",function(a){return a.isAuthenticated()}],composition:["$stateParams","compositionSvc",function(a,b){return a.id?b.getCompositionById(a.id):void 0}]}}).state("admin.composition.detail",{url:"",resolve:{composition:["composition",function(a){return a}]},views:{detail:{templateUrl:"views/admins/composition-detail.html",controller:"AdminCompositionDetailCtrl",controllerAs:"detail"},video:{templateUrl:"views/admins/composition-video.html",controller:"AdminCompositionVideoCtrl",controllerAs:"video"},sheet:{templateUrl:"views/admins/composition-sheet.html",controller:"AdminCompositionSheetCtrl",controllerAs:"sheet"}}})}]),angular.module("lilybook").controller("AdminCompositionCtrl",["composition",function(a){this.composition=a,this.hasId=function(){return void 0===a||null===a}}]),angular.module("lilybook").controller("AdminCompositionDetailCtrl",["composition","compositionSvc","composerSvc","definitionSvc",function(a,b,c,d){var e=this;e.composition=a,c.getAllComposers().then(function(b){e.composers=b,a&&b.some(function(b){return b.fullname===a.composer.fullname?(e.composerSelected=b,!0):void 0})}),d.getCompositionTypes().then(function(b){e.types=b,a&&b.some(function(b){return b.name===a.type?(e.typeSelected=b,!0):void 0})}),d.getKeys().then(function(b){e.keys=b,a&&b.some(function(b){return b.name===a.key?(e.keySelected=b,!0):void 0})}),d.getInstruments().then(function(b){e.instruments=b,a&&b.some(function(b){return b.name===a.instrumentation?(e.instrumentSelected=b,!0):void 0})}),d.getRCM().then(function(b){e.rcm=b,a&&b.some(function(b){return b.name===a.rcm?(e.rcmSelected=b,!0):void 0})}),d.getABRSM().then(function(b){e.abrsm=b,a&&b.some(function(b){return b.name===a.abrsm?(e.abrsmSelected=b,!0):void 0})}),d.getHenle().then(function(b){e.henle=b,a&&b.some(function(b){return b.name===a.henle?(e.henleSelected=b,!0):void 0})}),e.submit=function(){var a={id:e.composition.id,title:e.composition.title,composer:e.composerSelected,opus:e.composition.opus,number:e.composition.number,type:e.typeSelected,key:e.keySelected,instrumentation:e.instrumentSelected,rcm:e.rcmSelected,abrsm:e.abrsmSelected,henle:e.henleSelected,wikipedia:e.composition.wikipedia,imslp:e.composition.imslp};a.id?b.updateComposition(a).then(function(a){e.composition=a}):b.createComposition(a).then(function(a){e.composition=a})}}]),angular.module("lilybook").controller("AdminCompositionSheetCtrl",["composition","sheetSvc",function(a,b){var c=this;c.composition=a,a&&b.getSheetByComposition(a).then(function(a){c.sheet=a}),c.save=function(a){b.updateSheet(a)}}]),angular.module("lilybook").controller("AdminCompositionVideoCtrl",["composition","videoSvc",function(a,b){var c=this;c.composition=a,a&&b.getVideosByComposition(a).then(function(a){c.videos=a}),c.save=function(c){c.composition=a,c.id?b.updateVideo(c):b.createVideo(c).then(function(a){c.id=a.id})},c.add=function(){c.videos.push({})},c.remove=function(d){b.deleteVideo(d).then(function(){b.getVideosByComposition(a).then(function(a){c.videos=a})})}}]),angular.module("lilybook").directive("lbUploadSheet",["mapperSvc",function(a){return{restrict:"E",template:'<input type="file" />',scope:{composition:"=",sheet:"="},link:function(b,c){c.find("input").on("change",function(){if(this.files.length){var c=this.files[0],d=new Parse.File("sheet.pdf",c);d.save().then(function(){var c=new Parse.Object("Sheet");c.set("pdf",d),c.set("composition",b.composition.base),c.save().then(function(c){b.sheet=a.sheetMapper(c),b.$apply()})})}})}}}]),angular.module("lilybook").controller("AddComposerCtrl",["$location","$modalInstance","composerSvc",function(a,b,c){var d=this;d.root=a.protocol()+"://"+a.host()+"/",d.submit=function(){c.getComposer(d.vanity).then(function(a){a?alert("vanity exist!"):c.createComposer({vanity:d.vanity,fullname:d.fullname,image:d.image,description:d.description}).then(function(){b.close()})})}}]),angular.module("lilybook").controller("ComposerCtrl",["$stateParams","composerSvc","compositionSvc",function(a,b,c){var d=this;b.getComposer(a.vanity).then(function(a){console.log(a),d.composer=a,c.getCompositionsByComposer(a).then(function(a){console.log(a),d.compositions=a})})}]),angular.module("lilybook").controller("ComposersCtrl",["$modal","composerSvc",function(a,b){var c=this;c.open=function(){a.open({templateUrl:"views/modals/add-composer.html",size:"lg",controller:"AddComposerCtrl",controllerAs:"addComposer",backdrop:"static"})},b.getComposers(0,20).then(function(a){c.list=a})}]),angular.module("lilybook").controller("CompositionCtrl",["$stateParams","youtubeEmbedUtils","pdfDelegate","compositionSvc","videoSvc","sheetSvc",function(a,b,c,d,e,f){var g=this;d.getCompositionById(a.id).then(function(a){g.composition=a,g.getEditUrl=function(){return"/admin/composition/"+a.id},e.getVideosByComposition(a).then(function(a){a.forEach(function(a){a.vid=b.getIdFromURL(a.embed),a.thumbnail="https://img.youtube.com/vi/"+a.vid+"/hqdefault.jpg"}),g.videos=a}),f.getSheetByComposition(a).then(function(a){g.sheet=a,g.totalPages=a.lastPage-a.firstPage+1,g.basePage=a.firstPage-1})}),g.pageChanged=function(){c.$getByHandle("sheetMusic").goToPage(g.basePage+g.currentPage)}}]),angular.module("lilybook").controller("HomeCtrl",function(){}),angular.module("lilybook").controller("MainCtrl",["$rootScope","$state","userSvc",function(a,b,c){var d=this;Parse.initialize("fHO4LtJRfsdhQBBicYZpdpj3BQHHQCVEiDPkS4ZI","3gzRyAZnxtQLn1IofC4Layn6cc487e4n5Jin6FzM"),c.current().then(function(b){a.user=b}),d.signup=function(e,f,g,h){c.signUp(e,f,g,h).then(function(c){d.error=null,a.user=c,b.go("app.home")},function(a){d.error=a})},d.login=function(e,f){c.logIn(e,f).then(function(c){d.error=null,a.user=c,b.go("app.home")},function(a){d.error=a})},d.logout=function(){c.logOut().then(function(){a.user=null,b.go("app.splash")})},a.$on("$stateChangeError",function(a,c,d,e,f,g){console.log("$stateChangeError",arguments,g),"AUTH_REQUIRED"===g&&b.go("app.login")})}]),angular.module("lilybook").controller("SplashCtrl",["composerSvc",function(a){var b=this;b.heros=[{image:"images/hero1.jpg",headline:"Example headline.",text:'Note: If you\'re viewing this page via a file:// URL, the "next" and "previous" Glyphicon buttons on the left and right might not load/display properly due to web browser security rules.',action:'<a class="btn btn-lg btn-primary" href="/signup">Sign up today</a>'},{image:"images/hero2.jpg",headline:"Another example headline.",text:"Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id",action:'<a class="btn btn-lg btn-primary" href="#">Learn more</a>'},{image:"images/hero3.jpg",headline:"One more for good measure.",text:"dolor id nibh ultricies vehicula ut id elit..",action:'<a class="btn btn-lg btn-primary" href="#">Browse gallery</a>'}],a.getFeaturedComposers().then(function(a){b.composers=a})}]),angular.module("lilybook").factory("composerSvc",["$q",function(a){var b=Parse.Object.extend("Composer"),c=function(a){return{base:a,id:a.id,fullname:a.get("fullName"),shortname:a.get("shortName"),bio:a.get("description"),vanity:a.get("vanity"),image:a.get("image")?a.get("image").url():""}},d=function(d){var e=a.defer(),f=new b;return f.set("fullName",d.fullname),f.set("shortName",d.shortname),f.set("description",d.bio),f.set("vanity",d.vanity),f.save().then(function(a){e.resolve(c(a))},function(a){e.reject(a)}),e.promise},e=function(d){var e=a.defer(),f=new Parse.Query(b);return f.equalTo("vanity",d),f.first().then(function(a){a?e.resolve(c(a)):e.reject("NOT_FOUND")},function(a){e.reject(a)}),e.promise},f=function(d,e){var f=a.defer(),g=new Parse.Query(b);return g.skip(d||0),g.limit(e||10),g.find().then(function(a){f.resolve(a.map(c))},function(a){f.reject(a)}),f.promise},g=function(){var d=a.defer(),e=new Parse.Query(b);return e.exists("image"),e.ascending("vanity"),e.limit(3),e.find().then(function(a){d.resolve(a.map(c))},function(a){d.reject(a)}),d.promise},h=function(){var c=a.defer(),d=new Parse.Query(b);return d.find().then(function(a){c.resolve(a.map(function(a){return{base:a,id:a.id,fullname:a.get("fullName")}}))},function(a){c.reject(a)}),c.promise};return{createComposer:d,getComposer:e,getComposers:f,getFeaturedComposers:g,getAllComposers:h}}]),angular.module("lilybook").factory("compositionSvc",["$q","mapperSvc",function(a,b){var c=Parse.Object.extend("Composition"),d=function(a){var b=a.split(" ").join("_");return b=b.replace(/,/g,""),b=b.replace(/\./g,""),b=b.replace(/♯/g,"_sharp"),b=b.replace(/♭/g,"_flat"),b.toLowerCase()},e=function(d){var e=a.defer(),f=new Parse.Query(c);return f.equalTo("composer",d.base),f.include("key"),f.include("instrumentation"),f.include("type"),f.find().then(function(a){e.resolve(a.map(b.compositionMapper))},function(a){e.reject(a)}),e.promise},f=function(d){var e=a.defer(),f=new Parse.Query(c);return f.equalTo("objectId",d),f.include("key"),f.include("instrumentation"),f.include("type"),f.include("rcm"),f.include("abrsm"),f.include("henle"),f.include("composer"),f.first().then(function(a){a?e.resolve(b.compositionMapper(a)):e.reject("NOT_FOUND")},function(a){e.reject(a)}),e.promise},g=function(e){console.log("create",e);var f=a.defer(),g=new c;return g.save({title:e.title,vanity:d(e.title),opus:e.opus,number:e.number,key:e.key.base,instrumentation:e.instrumentation.base,type:e.type.base,wikipedia:e.wikipedia,imslp:e.imslp,rcm:e.rcm?e.rcm.base:null,abrsm:e.abrsm?e.abrsm.base:null,henle:e.henle?e.henle.base:null,composer:e.composer.base}).then(function(a){f.resolve(b.compositionMapper(a))},function(a){f.reject(a)}),f.promise},h=function(e){console.log("update",e);var f=a.defer(),g=new Parse.Query(c);return g.equalTo("objectId",e.id),g.first().then(function(a){a.save({title:e.title,vanity:d(e.title),opus:e.opus,number:e.number,key:e.key.base,instrumentation:e.instrumentation.base,type:e.type.base,wikipedia:e.wikipedia,imslp:e.imslp,rcm:e.rcm?e.rcm.base:null,abrsm:e.abrsm?e.abrsm.base:null,henle:e.henle?e.henle.base:null,composer:e.composer.base}).then(function(a){f.resolve(b.compositionMapper(a))})},function(a){f.reject(a)}),f.promise};return{getCompositionsByComposer:e,getCompositionById:f,createComposition:g,updateComposition:h}}]),angular.module("lilybook").factory("definitionSvc",["$q",function(a){var b=Parse.Object.extend("RCM"),c=Parse.Object.extend("ABRSM"),d=Parse.Object.extend("Henle"),e=Parse.Object.extend("Key"),f=Parse.Object.extend("CompositionType"),g=Parse.Object.extend("Instrumentation"),h=function(){var c=a.defer(),d=new Parse.Query(b);return d.find().then(function(a){c.resolve(a.map(function(a){return{base:a,id:a.id,name:a.get("name")}}))},function(a){c.reject(a)}),c.promise},i=function(){var b=a.defer(),d=new Parse.Query(c);return d.find().then(function(a){b.resolve(a.map(function(a){return{base:a,id:a.id,name:a.get("name")}}))},function(a){b.reject(a)}),b.promise},j=function(){var b=a.defer(),c=new Parse.Query(d);return c.find().then(function(a){b.resolve(a.map(function(a){return{base:a,id:a.id,name:a.get("name")}}))},function(a){b.reject(a)}),b.promise},k=function(){var b=a.defer(),c=new Parse.Query(e);return c.find().then(function(a){b.resolve(a.map(function(a){return{base:a,id:a.id,name:a.get("name")}}))},function(a){b.reject(a)}),b.promise},l=function(){var b=a.defer(),c=new Parse.Query(f);return c.find().then(function(a){b.resolve(a.map(function(a){return{base:a,id:a.id,name:a.get("name")}}))},function(a){b.reject(a)}),b.promise},m=function(){var b=a.defer(),c=new Parse.Query(g);return c.find().then(function(a){b.resolve(a.map(function(a){return{base:a,id:a.id,name:a.get("name")}}))},function(a){b.reject(a)}),b.promise};return{getRCM:h,getABRSM:i,getHenle:j,getKeys:k,getCompositionTypes:l,getInstruments:m}}]),angular.module("lilybook").factory("mapperSvc",function(){var a=function(a){return{base:a,id:a.id,title:a.get("title"),vanity:a.get("vanity"),opus:a.get("opus"),number:a.get("number"),key:a.get("key").get("name"),instrumentation:a.get("instrumentation").get("name"),type:a.get("type").get("name"),wikipedia:a.get("wikipedia"),imslp:a.get("imslp"),composer:a.get("composer")?b(a.get("composer")):null,rcm:a.get("rcm")?a.get("rcm").get("name"):null,abrsm:a.get("abrsm")?a.get("abrsm").get("name"):null,henle:a.get("henle")?a.get("henle").get("name"):null}},b=function(a){return{base:a,id:a.id,fullname:a.get("fullName"),shortname:a.get("shortName"),bio:a.get("description"),vanity:a.get("vanity"),image:a.get("image")?a.get("image").url():null}},c=function(a){return{base:a,id:a.id,embed:a.get("embed"),source:a.get("source"),title:a.get("title")}},d=function(a){return{base:a,id:a.id,firstPage:a.get("firstPage"),lastPage:a.get("lastPage"),pdfUrl:a.get("pdf")?a.get("pdf").url():null}};return{compositionMapper:a,composerMapper:b,videoMapper:c,sheetMapper:d}}),angular.module("lilybook").factory("sheetSvc",["$q","mapperSvc",function(a,b){var c=Parse.Object.extend("Sheet"),d=function(d){var e=a.defer(),f=new Parse.Query(c);return f.equalTo("composition",d.base),f.first().then(function(a){a?e.resolve(b.sheetMapper(a)):e.reject("NOT_FOUND")},function(a){e.reject(a)}),e.promise},e=function(d){var e=a.defer(),f=new Parse.Query(c);return f.equalTo("objectId",d.id),f.first().then(function(a){a.save({firstPage:d.firstPage,lastPage:d.lastPage}).then(function(a){e.resolve(b.sheetMapper(a))})},function(a){e.reject(a)}),e.promise};return{getSheetByComposition:d,updateSheet:e}}]),angular.module("lilybook").factory("userSvc",["$q",function(a){var b=function(){var b=a.defer(),c=Parse.User.current();return b.resolve(c?{uid:c.id,email:c.get("email"),firstname:c.get("firstname"),lastname:c.get("lastname")}:null),b.promise},c=function(b,c,d,e){var f=a.defer();return Parse.User.signUp(b,c,{email:b,firstname:d,lastname:e}).then(function(a){f.resolve({uid:a.id,email:a.get("email"),firstname:a.get("firstname"),lastname:a.get("lastname")})},function(a){f.reject(a)}),f.promise},d=function(b,c){var d=a.defer();return Parse.User.logIn(b,c).then(function(a){d.resolve({uid:a.id,email:a.get("email"),firstname:a.get("firstname"),lastname:a.get("lastname")})},function(a){d.reject(a)}),d.promise},e=function(){var b=a.defer();return Parse.User.logOut().then(function(){b.resolve()},function(a){b.reject(a)}),b.promise},f=function(){var b=Parse.User.current();return b&&b.authenticated()?a.when(!0):a.reject("AUTH_REQUIRED")};return{current:b,signUp:c,logIn:d,logOut:e,isAuthenticated:f}}]),angular.module("lilybook").factory("videoSvc",["$q","mapperSvc",function(a,b){var c=Parse.Object.extend("Video"),d=function(d){var e=a.defer(),f=new Parse.Query(c);return f.equalTo("composition",d.base),f.find().then(function(a){e.resolve(a.map(b.videoMapper))},function(a){e.reject(a)}),e.promise},e=function(d){var e=a.defer(),f=new c;return f.save({title:d.title,embed:d.embed,composition:d.composition.base}).then(function(a){e.resolve(b.videoMapper(a))},function(a){e.reject(a)}),e.promise},f=function(d){var e=a.defer(),f=new Parse.Query(c);return f.equalTo("objectId",d.id),f.first().then(function(a){a.save({title:d.title,embed:d.embed,composition:d.composition.base}).then(function(a){e.resolve(b.videoMapper(a))})},function(a){e.reject(a)}),e.promise},g=function(b){var d=a.defer(),e=new Parse.Query(c);return e.equalTo("objectId",b.id),e.first().then(function(a){a.destroy().then(function(a){d.resolve(a.id)})},function(a){d.reject(a)}),d.promise};return{getVideosByComposition:d,createVideo:e,updateVideo:f,deleteVideo:g}}]);