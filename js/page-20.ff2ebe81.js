(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["page-20"],{4743:function(e,t,r){},"8f1e":function(e,t,r){"use strict";var a=r("4743"),s=r.n(a);s.a},d84d:function(e,t,r){"use strict";r.r(t);var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"group"},[r("div",{staticClass:"margin-bt-15"},[r("van-tabs",{attrs:{type:"card"},model:{value:e.activeTab,callback:function(t){e.activeTab=t},expression:"activeTab"}},[r("van-tab",{attrs:{title:"全部",name:"all"}}),r("van-tab",{attrs:{title:"已加入",name:"joined"}}),r("van-tab",{attrs:{title:"未加入",name:"notjoin"}})],1)],1),r("van-cell-group",e._l(e.filterGroupList,(function(t){return r("van-cell",{key:t.id,attrs:{title:t.name,center:"","is-link":"",clickable:""},on:{click:function(r){return e.goDetails(t)}}},[r("div",{attrs:{slot:"label"},slot:"label"},[r("span",{staticClass:"margin-r-10 little-text"},[e._v(e._s(t.password?"私密":"公開")+"群組")]),r("van-icon",{attrs:{name:"user-o"}}),r("span",{staticClass:"margin-l-5"},[e._v(e._s(t.members.length))])],1),r("div",{staticClass:"margin-r-15",attrs:{slot:"icon"},slot:"icon"},[t.members.includes(e.profile.userId)?r("van-tag",{attrs:{type:"success",plain:""}},[e._v("已加入")]):r("van-tag",{attrs:{plain:""}},[e._v("未加入")])],1)])})),1),r("div",{staticClass:"plus-btn",on:{click:function(t){e.showEditor=!0}}},[r("van-icon",{attrs:{name:"plus"}})],1),r("van-popup",{style:{height:"70%"},attrs:{position:"bottom",closeable:""},model:{value:e.showEditor,callback:function(t){e.showEditor=t},expression:"showEditor"}},[r("div",{staticClass:"padding-t-30"},[r("van-divider",[e._v("建立群組")]),r("van-form",{on:{submit:e.onSubmit}},[r("van-field",{attrs:{name:"群組名稱",label:"群組名稱",placeholder:"請填寫群組名稱",rules:[{required:!0,message:"請填寫群組名稱"}]},model:{value:e.groupName,callback:function(t){e.groupName=t},expression:"groupName"}}),r("van-field",{attrs:{name:"switch",label:"私密群組"},scopedSlots:e._u([{key:"input",fn:function(){return[r("van-switch",{attrs:{size:"20"},model:{value:e.isPrivate,callback:function(t){e.isPrivate=t},expression:"isPrivate"}})]},proxy:!0}])}),e.isPrivate?r("van-field",{attrs:{name:"群組密碼",label:"群組密碼",placeholder:"請填寫群組密碼",rules:[{required:!0,message:"請填寫群組密碼"}]},model:{value:e.password,callback:function(t){e.password=t},expression:"password"}}):e._e(),r("div",{staticClass:"padding-a-15"},[r("van-button",{attrs:{type:"primary",round:"",block:"","native-type":"submit"}},[e._v("送出")])],1)],1)],1)]),r("van-dialog",{attrs:{"show-cancel-button":"","close-on-popstate":"","before-close":e.beforeClose},model:{value:e.showDialog,callback:function(t){e.showDialog=t},expression:"showDialog"}},[r("div",{staticClass:"padding-a-10",attrs:{slot:"title"},slot:"title"},[e._v("您不在群組內，是否要加入群組？")]),r("div",{staticClass:"padding-a-10 fs-14"},[e._v(" 群組名稱："+e._s(e.group.name)+" "),r("br"),e._v("加入群組後菜價資訊將會公開分享給群組內成員。 ")]),e.group.password?r("van-field",{attrs:{label:"群組密碼",placeholder:"請輸入群組密碼"},model:{value:e.joinPassword,callback:function(t){e.joinPassword=t},expression:"joinPassword"}}):e._e()],1)],1)},s=[],n=(r("4de4"),r("caad"),r("2532"),r("96cf"),r("1da1")),i=r("5530"),o=r("2f62"),u=r("08ba"),l={props:{groupList:{type:Array,default:function(){return[]}}},data:function(){return{activeTab:"all",showEditor:!1,groupName:"",password:"",isPrivate:!1,showDialog:!1,group:{},joinPassword:""}},computed:Object(i["a"])({},Object(o["b"])({isLoggedIn:"isLoggedIn",profile:"profile"}),{filterGroupList:function(){var e=this;switch(this.activeTab){case"all":return this.groupList;case"joined":return this.groupList.filter((function(t){return t.members.includes(e.profile.userId)}));case"notjoin":return this.groupList.filter((function(t){return!t.members.includes(e.profile.userId)}));default:return[]}}}),watch:{showDialog:function(e){e||(this.joinPassword="",this.group={})}},methods:{updateProfileByUserId:function(){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,u["e"].updateProfileByUserId(e.profile.userId,e.profile);case 3:t.next=8;break;case 5:t.prev=5,t.t0=t["catch"](0);case 8:case"end":return t.stop()}}),t,null,[[0,5]])})))()},onSubmit:function(){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,u["e"].createGroup({name:e.groupName,password:e.isPrivate?e.password:"",creatorId:e.profile.userId});case 3:e.showEditor=!1,e.updateProfileByUserId(),t.next=10;break;case 7:t.prev=7,t.t0=t["catch"](0);case 10:case"end":return t.stop()}}),t,null,[[0,7]])})))()},goDetails:function(e){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function r(){return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:if(e.members.includes(t.profile.userId)){r.next=4;break}return t.group=e,t.showDialog=!0,r.abrupt("return");case 4:t.$router.push({name:"TurnipGroupDetails",params:{id:e.id}});case 5:case"end":return r.stop()}}),r)})))()},beforeClose:function(e,t){var r=this;return Object(n["a"])(regeneratorRuntime.mark((function a(){return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:if("cancel"!==e){a.next=3;break}return t(),a.abrupt("return");case 3:if(r.joinPassword===r.group.password){a.next=7;break}return r.$notify({type:"danger",message:"Oops... 密碼錯誤"}),t(!1),a.abrupt("return");case 7:return a.prev=7,r.group.members.push(r.profile.userId),a.next=11,u["e"].updateGroup(r.group.id,Object(i["a"])({},r.group));case 11:r.updateProfileByUserId(),t(),r.$router.push({name:"TurnipGroupDetails",params:{id:r.group.id}}),a.next=20;break;case 16:a.prev=16,a.t0=a["catch"](7),t();case 20:case"end":return a.stop()}}),a,null,[[7,16]])})))()}}},c=l,p=(r("8f1e"),r("2877")),d=Object(p["a"])(c,a,s,!1,null,"e4f4e2fe",null);t["default"]=d.exports}}]);
//# sourceMappingURL=page-20.ff2ebe81.js.map