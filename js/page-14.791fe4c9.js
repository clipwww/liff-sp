(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["page-14"],{"1c3c":function(t,e,a){var r=a("9e69"),n=a("2474"),i=a("9638"),o=a("a2be"),s=a("edfa"),c=a("ac41"),u=1,f=2,l="[object Boolean]",d="[object Date]",h="[object Error]",v="[object Map]",m="[object Number]",p="[object RegExp]",b="[object Set]",g="[object String]",y="[object Symbol]",_="[object ArrayBuffer]",w="[object DataView]",x=r?r.prototype:void 0,I=x?x.valueOf:void 0;function j(t,e,a,r,x,j,k){switch(a){case w:if(t.byteLength!=e.byteLength||t.byteOffset!=e.byteOffset)return!1;t=t.buffer,e=e.buffer;case _:return!(t.byteLength!=e.byteLength||!j(new n(t),new n(e)));case l:case d:case m:return i(+t,+e);case h:return t.name==e.name&&t.message==e.message;case p:case g:return t==e+"";case v:var C=s;case b:var D=r&u;if(C||(C=c),t.size!=e.size&&!D)return!1;var E=k.get(t);if(E)return E==e;r|=f,k.set(t,e);var O=o(C(t),C(e),r,x,j,k);return k["delete"](t),O;case y:if(I)return I.call(t)==I.call(e)}return!1}t.exports=j},"31f2":function(t,e,a){"use strict";a.r(e);var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("van-panel",{attrs:{title:t.theaterInfo.name,desc:t.theaterInfo.address}},[a("div",{attrs:{slot:"footer"},slot:"footer"},[a("van-tag",{staticClass:"margin-r-5 margin-bt-5",attrs:{plain:""}},[t._v("營業時間 "+t._s(t.theaterInfo.openingHours))]),a("van-tag",{staticClass:"margin-r-5 margin-bt-5",attrs:{plain:""}},[t._v("電話 "+t._s(t.theaterInfo.telephone))]),a("a",{staticClass:"margin-bt-5",attrs:{href:t.theaterInfo.url,target:"_blank"}},[a("van-tag",{attrs:{plain:""}},[t._v("網站")])],1)],1)]),a("van-cell",{staticClass:"margin-t-5",attrs:{value:t.formatDate,"is-link":""},on:{click:function(e){t.showCalendar=!0}}}),a("van-calendar",{attrs:{"show-confirm":!1,"max-date":t.maxDate,"close-on-popstate":""},on:{confirm:t.onDateChange},model:{value:t.showCalendar,callback:function(e){t.showCalendar=e},expression:"showCalendar"}}),t._l(t.movies,(function(e){return a("van-card",{key:e.id,attrs:{title:e.title},on:{"click-thumb":function(a){return t.goMovie(e)}}},[a("div",{attrs:{slot:"thumb"},slot:"thumb"},[a("van-image",{attrs:{height:"88",fit:"cover",src:e.image,"lazy-load":""}}),a("div",{staticClass:"margin-t-5"},[a("van-image",{staticClass:"square",attrs:{width:"35",fit:"contain",src:e.cerImg,"lazy-load":""}})],1)],1),a("div",{attrs:{slot:"desc"},slot:"desc"},[a("div",[t._v("片長: "+t._s(e.runtime)+" 分")]),t._l(e.versions,(function(e,r){return a("div",{key:r},[a("van-divider",{attrs:{"content-position":"left"}},[t._v(t._s(e.name||"數位"))]),t._l(e.times,(function(e,r){return a("van-tag",{key:r,staticClass:"margin-a-5",attrs:{type:t.isExpired(e)?"default":"success",plain:""}},[t._v(t._s(e))])}))],2)}))],2)])})),t.movies.length||t.isEmpty?t._e():t._l(3,(function(t){return a("van-card",{key:t},[a("van-skeleton",{attrs:{slot:"desc",title:"",avatar:"","avatar-size":"88px","avatar-shape":"square",row:3},slot:"desc"})],1)}))],2)},n=[],i=(a("99af"),a("4de4"),a("4160"),a("caad"),a("b0c0"),a("b64b"),a("2532"),a("159b"),a("96cf"),a("1da1")),o=a("c1df"),s=a.n(o),c=a("63ea"),u=a.n(c),f=a("08ba"),l=a("7f7f"),d={metaInfo:function(){return{title:this.$route.query.title||this.theaterInfo.name}},data:function(){return{theaterInfo:{},movies:[],date:s()(),showCalendar:!1,isEmpty:!1}},computed:{theaterId:function(){return this.$route.params.id},cityId:function(){return this.$route.query.cityId},formatDate:function(){return this.date.format("YYYYMMDD")},maxDate:function(){return new Date(s()().add(7,"day"))},isToday:function(){return s()().isSame(this.date,"day")}},watch:{formatDate:{immediate:!0,handler:function(t,e){var a=this;this.movies=[],l["a"].child("theater-".concat(this.theaterId,"-").concat(e)).off(),l["a"].child("theater-".concat(this.theaterId,"-").concat(t)).off(),l["a"].child("theater-".concat(this.theaterId,"-").concat(this.formatDate)).on("value",(function(t){var e=t.val();e&&(a.theaterInfo=e.item,a.movies=e.items)}))}},showCalendar:{immediate:!0,handler:function(t){var e,a;t||(null===(e=document.body)||void 0===e||null===(a=e.classList)||void 0===a||a.remove("van-overflow-hidden"))}}},created:function(){l["a"].on("value",(function(t){var e=Object.keys(t.val());e.filter((function(t){return t.includes("theater-")})).forEach((function(e){var a=t.child(e).val();s()().isAfter(a.dateCreated,"day")&&l["a"].child(e).remove()}))})),this.getTheaterById()},beforeDestroy:function(){l["a"].child("theater-".concat(this.theaterId,"-").concat(this.formatDate)).off(),l["a"].off()},methods:{getTheaterById:function(){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function e(){var a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t.isEmpty=!1,e.next=3,f["c"].getTheaterById(t.theaterId,t.cityId,t.formatDate);case 3:if(a=e.sent,a.success){e.next=6;break}return e.abrupt("return");case 6:a.items.length||(t.isEmpty=!0),u()(t.movies,a.items)||l["a"].child("theater-".concat(t.theaterId,"-").concat(t.formatDate)).set({item:a.item,items:a.items,dateCreated:+s()()});case 8:case"end":return e.stop()}}),e)})))()},onDateChange:function(t){this.date=s()(t),this.showCalendar=!1,this.getTheaterById()},isExpired:function(t){return s()().isAfter(s()(t,"HH：mm"))},goMovie:function(t){var e=t.id;this.$router.push({name:"MovieDetails",params:{id:e}})}}},h=d,v=(a("5d2b"),a("2877")),m=Object(v["a"])(h,r,n,!1,null,"8c5396ca",null);e["default"]=m.exports},"35db":function(t,e,a){},4284:function(t,e){function a(t,e){var a=-1,r=null==t?0:t.length;while(++a<r)if(e(t[a],a,t))return!0;return!1}t.exports=a},"5d2b":function(t,e,a){"use strict";var r=a("35db"),n=a.n(r);n.a},"63ea":function(t,e,a){var r=a("c05f");function n(t,e){return r(t,e)}t.exports=n},"7b97":function(t,e,a){var r=a("7e64"),n=a("a2be"),i=a("1c3c"),o=a("b1e5"),s=a("42a2"),c=a("6747"),u=a("0d24"),f=a("73ac"),l=1,d="[object Arguments]",h="[object Array]",v="[object Object]",m=Object.prototype,p=m.hasOwnProperty;function b(t,e,a,m,b,g){var y=c(t),_=c(e),w=y?h:s(t),x=_?h:s(e);w=w==d?v:w,x=x==d?v:x;var I=w==v,j=x==v,k=w==x;if(k&&u(t)){if(!u(e))return!1;y=!0,I=!1}if(k&&!I)return g||(g=new r),y||f(t)?n(t,e,a,m,b,g):i(t,e,w,a,m,b,g);if(!(a&l)){var C=I&&p.call(t,"__wrapped__"),D=j&&p.call(e,"__wrapped__");if(C||D){var E=C?t.value():t,O=D?e.value():e;return g||(g=new r),b(E,O,a,m,g)}}return!!k&&(g||(g=new r),o(t,e,a,m,b,g))}t.exports=b},"7ed2":function(t,e){var a="__lodash_hash_undefined__";function r(t){return this.__data__.set(t,a),this}t.exports=r},a2be:function(t,e,a){var r=a("d612"),n=a("4284"),i=a("c584"),o=1,s=2;function c(t,e,a,c,u,f){var l=a&o,d=t.length,h=e.length;if(d!=h&&!(l&&h>d))return!1;var v=f.get(t);if(v&&f.get(e))return v==e;var m=-1,p=!0,b=a&s?new r:void 0;f.set(t,e),f.set(e,t);while(++m<d){var g=t[m],y=e[m];if(c)var _=l?c(y,g,m,e,t,f):c(g,y,m,t,e,f);if(void 0!==_){if(_)continue;p=!1;break}if(b){if(!n(e,(function(t,e){if(!i(b,e)&&(g===t||u(g,t,a,c,f)))return b.push(e)}))){p=!1;break}}else if(g!==y&&!u(g,y,a,c,f)){p=!1;break}}return f["delete"](t),f["delete"](e),p}t.exports=c},ac41:function(t,e){function a(t){var e=-1,a=Array(t.size);return t.forEach((function(t){a[++e]=t})),a}t.exports=a},b1e5:function(t,e,a){var r=a("a994"),n=1,i=Object.prototype,o=i.hasOwnProperty;function s(t,e,a,i,s,c){var u=a&n,f=r(t),l=f.length,d=r(e),h=d.length;if(l!=h&&!u)return!1;var v=l;while(v--){var m=f[v];if(!(u?m in e:o.call(e,m)))return!1}var p=c.get(t);if(p&&c.get(e))return p==e;var b=!0;c.set(t,e),c.set(e,t);var g=u;while(++v<l){m=f[v];var y=t[m],_=e[m];if(i)var w=u?i(_,y,m,e,t,c):i(y,_,m,t,e,c);if(!(void 0===w?y===_||s(y,_,a,i,c):w)){b=!1;break}g||(g="constructor"==m)}if(b&&!g){var x=t.constructor,I=e.constructor;x!=I&&"constructor"in t&&"constructor"in e&&!("function"==typeof x&&x instanceof x&&"function"==typeof I&&I instanceof I)&&(b=!1)}return c["delete"](t),c["delete"](e),b}t.exports=s},c05f:function(t,e,a){var r=a("7b97"),n=a("1310");function i(t,e,a,o,s){return t===e||(null==t||null==e||!n(t)&&!n(e)?t!==t&&e!==e:r(t,e,a,o,i,s))}t.exports=i},c584:function(t,e){function a(t,e){return t.has(e)}t.exports=a},d612:function(t,e,a){var r=a("7b83"),n=a("7ed2"),i=a("dc0f");function o(t){var e=-1,a=null==t?0:t.length;this.__data__=new r;while(++e<a)this.add(t[e])}o.prototype.add=o.prototype.push=n,o.prototype.has=i,t.exports=o},dc0f:function(t,e){function a(t){return this.__data__.has(t)}t.exports=a},edfa:function(t,e){function a(t){var e=-1,a=Array(t.size);return t.forEach((function(t,r){a[++e]=[r,t]})),a}t.exports=a}}]);
//# sourceMappingURL=page-14.791fe4c9.js.map