(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["page-16"],{"068b":function(e,t,r){"use strict";r.r(t);var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"movie-list"},[r("div",{staticClass:"list__container"},[r("van-search",{attrs:{placeholder:"請輸入關鍵字搜尋"},model:{value:e.keyword,callback:function(t){e.keyword="string"===typeof t?t.trim():t},expression:"keyword"}}),r("div",{staticClass:"list__content padding-b-30"},[e._l(e.filterMoviesGroupByDate,(function(t,n){return r("van-cell-group",{key:n},[r("van-tag",{attrs:{slot:"title",type:"primary",size:"large",plain:""},slot:"title"},[e._v(e._s(t.releaseDate))]),r("MovieListCell",{attrs:{items:t.movies}})],1)})),r("div",{directives:[{name:"show",rawName:"v-show",value:!e.moviesGroupByDate.length,expression:"!moviesGroupByDate.length"}]},e._l(10,(function(e){return r("van-cell",{key:e},[r("van-skeleton",{attrs:{row:1}})],1)})),1)],2)],1)])},a=[],i=(r("4de4"),r("caad"),r("d81d"),r("b0c0"),r("2532"),r("96cf"),r("c964")),o=r("f3f3"),c=r("c1df"),s=r.n(c),u=r("63ea"),f=r.n(u),l=r("08ba"),v=r("7f7f"),d=r("63c7"),p={components:{MovieListCell:d["a"]},data:function(){return{keyword:"",moviesGroupByDate:[]}},computed:{filterMoviesGroupByDate:function(){var e,t=this;return null===(e=this.moviesGroupByDate)||void 0===e?void 0:e.map((function(e){return Object(o["a"])(Object(o["a"])({},e),{},{movies:e.movies.filter((function(e){return!t.keyword||e.name.includes(t.keyword)}))})}))}},created:function(){var e=this;v["a"].child("movies-next").on("value",(function(t){var r=t.val();r&&(e.moviesGroupByDate=r.items)})),this.getMoviesGroupBtDate()},beforeDestroy:function(){v["a"].child("movies-next").off()},methods:{getMoviesGroupBtDate:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){var r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,l["d"].getMovieNextList();case 2:if(r=t.sent,r.success){t.next=5;break}return t.abrupt("return");case 5:f()(e.moviesGroupByDate,r.items)||v["a"].child("movies-next").set({items:r.items,dateCreated:+s()()});case 6:case"end":return t.stop()}}),t)})))()}}},h=p,b=r("2877"),m=Object(b["a"])(h,n,a,!1,null,"ba6690c2",null);t["default"]=m.exports},"159b":function(e,t,r){var n=r("da84"),a=r("fdbc"),i=r("17c2"),o=r("9112");for(var c in a){var s=n[c],u=s&&s.prototype;if(u&&u.forEach!==i)try{o(u,"forEach",i)}catch(f){u.forEach=i}}},"17c2":function(e,t,r){"use strict";var n=r("b727").forEach,a=r("a640"),i=r("ae40"),o=a("forEach"),c=i("forEach");e.exports=o&&c?[].forEach:function(e){return n(this,e,arguments.length>1?arguments[1]:void 0)}},"1c3c":function(e,t,r){var n=r("9e69"),a=r("2474"),i=r("9638"),o=r("a2be"),c=r("edfa"),s=r("ac41"),u=1,f=2,l="[object Boolean]",v="[object Date]",d="[object Error]",p="[object Map]",h="[object Number]",b="[object RegExp]",m="[object Set]",y="[object String]",g="[object Symbol]",_="[object ArrayBuffer]",w="[object DataView]",L=n?n.prototype:void 0,x=L?L.valueOf:void 0;function k(e,t,r,n,L,k,j){switch(r){case w:if(e.byteLength!=t.byteLength||e.byteOffset!=t.byteOffset)return!1;e=e.buffer,t=t.buffer;case _:return!(e.byteLength!=t.byteLength||!k(new a(e),new a(t)));case l:case v:case h:return i(+e,+t);case d:return e.name==t.name&&e.message==t.message;case b:case y:return e==t+"";case p:var S=c;case m:var D=n&u;if(S||(S=s),e.size!=t.size&&!D)return!1;var M=j.get(e);if(M)return M==t;n|=f,j.set(e,t);var E=o(S(e),S(t),n,L,k,j);return j["delete"](e),E;case g:if(x)return x.call(e)==x.call(t)}return!1}e.exports=k},4160:function(e,t,r){"use strict";var n=r("23e7"),a=r("17c2");n({target:"Array",proto:!0,forced:[].forEach!=a},{forEach:a})},4284:function(e,t){function r(e,t){var r=-1,n=null==e?0:e.length;while(++r<n)if(t(e[r],r,e))return!0;return!1}e.exports=r},"63c7":function(e,t,r){"use strict";var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",e._l(e.items,(function(t,n){return r("van-cell",{key:t.id,attrs:{title:t.name,label:t.description},on:{click:function(r){return e.goDetails(t)}}},[r("van-image",{staticClass:"margin-r-10",attrs:{slot:"icon",width:"65",src:t.poster,"lazy-load":n>0},slot:"icon"}),t.cerImg?r("van-image",{staticClass:"margin-l-5",attrs:{slot:"right-icon",width:"35",fit:"contain",src:t.cerImg,"lazy-load":n>0},slot:"right-icon"}):e._e()],1)})),1)},a=[],i=(r("b0c0"),{props:{items:{type:Array,default:function(){return[]}}},methods:{goDetails:function(e){this.$router.push({name:"MovieDetails",params:{id:e.id},query:{title:e.name}})}}}),o=i,c=r("2877"),s=Object(c["a"])(o,n,a,!1,null,null,null);t["a"]=s.exports},"63ea":function(e,t,r){var n=r("c05f");function a(e,t){return n(e,t)}e.exports=a},"7b97":function(e,t,r){var n=r("7e64"),a=r("a2be"),i=r("1c3c"),o=r("b1e5"),c=r("42a2"),s=r("6747"),u=r("0d24"),f=r("73ac"),l=1,v="[object Arguments]",d="[object Array]",p="[object Object]",h=Object.prototype,b=h.hasOwnProperty;function m(e,t,r,h,m,y){var g=s(e),_=s(t),w=g?d:c(e),L=_?d:c(t);w=w==v?p:w,L=L==v?p:L;var x=w==p,k=L==p,j=w==L;if(j&&u(e)){if(!u(t))return!1;g=!0,x=!1}if(j&&!x)return y||(y=new n),g||f(e)?a(e,t,r,h,m,y):i(e,t,w,r,h,m,y);if(!(r&l)){var S=x&&b.call(e,"__wrapped__"),D=k&&b.call(t,"__wrapped__");if(S||D){var M=S?e.value():e,E=D?t.value():t;return y||(y=new n),m(M,E,r,h,y)}}return!!j&&(y||(y=new n),o(e,t,r,h,m,y))}e.exports=m},"7ed2":function(e,t){var r="__lodash_hash_undefined__";function n(e){return this.__data__.set(e,r),this}e.exports=n},a2be:function(e,t,r){var n=r("d612"),a=r("4284"),i=r("c584"),o=1,c=2;function s(e,t,r,s,u,f){var l=r&o,v=e.length,d=t.length;if(v!=d&&!(l&&d>v))return!1;var p=f.get(e),h=f.get(t);if(p&&h)return p==t&&h==e;var b=-1,m=!0,y=r&c?new n:void 0;f.set(e,t),f.set(t,e);while(++b<v){var g=e[b],_=t[b];if(s)var w=l?s(_,g,b,t,e,f):s(g,_,b,e,t,f);if(void 0!==w){if(w)continue;m=!1;break}if(y){if(!a(t,(function(e,t){if(!i(y,t)&&(g===e||u(g,e,r,s,f)))return y.push(t)}))){m=!1;break}}else if(g!==_&&!u(g,_,r,s,f)){m=!1;break}}return f["delete"](e),f["delete"](t),m}e.exports=s},ac41:function(e,t){function r(e){var t=-1,r=Array(e.size);return e.forEach((function(e){r[++t]=e})),r}e.exports=r},b1e5:function(e,t,r){var n=r("a994"),a=1,i=Object.prototype,o=i.hasOwnProperty;function c(e,t,r,i,c,s){var u=r&a,f=n(e),l=f.length,v=n(t),d=v.length;if(l!=d&&!u)return!1;var p=l;while(p--){var h=f[p];if(!(u?h in t:o.call(t,h)))return!1}var b=s.get(e),m=s.get(t);if(b&&m)return b==t&&m==e;var y=!0;s.set(e,t),s.set(t,e);var g=u;while(++p<l){h=f[p];var _=e[h],w=t[h];if(i)var L=u?i(w,_,h,t,e,s):i(_,w,h,e,t,s);if(!(void 0===L?_===w||c(_,w,r,i,s):L)){y=!1;break}g||(g="constructor"==h)}if(y&&!g){var x=e.constructor,k=t.constructor;x==k||!("constructor"in e)||!("constructor"in t)||"function"==typeof x&&x instanceof x&&"function"==typeof k&&k instanceof k||(y=!1)}return s["delete"](e),s["delete"](t),y}e.exports=c},b64b:function(e,t,r){var n=r("23e7"),a=r("7b0b"),i=r("df75"),o=r("d039"),c=o((function(){i(1)}));n({target:"Object",stat:!0,forced:c},{keys:function(e){return i(a(e))}})},c05f:function(e,t,r){var n=r("7b97"),a=r("1310");function i(e,t,r,o,c){return e===t||(null==e||null==t||!a(e)&&!a(t)?e!==e&&t!==t:n(e,t,r,o,i,c))}e.exports=i},c584:function(e,t){function r(e,t){return e.has(t)}e.exports=r},d612:function(e,t,r){var n=r("7b83"),a=r("7ed2"),i=r("dc0f");function o(e){var t=-1,r=null==e?0:e.length;this.__data__=new n;while(++t<r)this.add(e[t])}o.prototype.add=o.prototype.push=a,o.prototype.has=i,e.exports=o},d81d:function(e,t,r){"use strict";var n=r("23e7"),a=r("b727").map,i=r("1dde"),o=r("ae40"),c=i("map"),s=o("map");n({target:"Array",proto:!0,forced:!c||!s},{map:function(e){return a(this,e,arguments.length>1?arguments[1]:void 0)}})},dc0f:function(e,t){function r(e){return this.__data__.has(e)}e.exports=r},edfa:function(e,t){function r(e){var t=-1,r=Array(e.size);return e.forEach((function(e,n){r[++t]=[n,e]})),r}e.exports=r},fdbc:function(e,t){e.exports={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}}}]);
//# sourceMappingURL=page-16.cef1b465.js.map