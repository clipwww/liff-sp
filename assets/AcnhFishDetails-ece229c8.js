import{n as l}from"./index-71d8585f.js";const s={props:{item:{type:Object}},data(){return{}},computed:{availability(){var i;return(i=this.item)==null?void 0:i.availability}}};var n=function(){var t=this,a=t._self._c;return a("div",[a("van-panel",[a("div",{staticClass:"text-center padding-bt-10",attrs:{slot:"header"},slot:"header"},[a("b",{staticClass:"fs-20"},[t._v(t._s(t.item.name["name-TWzh"]))])]),a("van-cell",{attrs:{title:"賣價"}},[t._v(" "+t._s(t._f("commafy")(t.item.price))+" ")]),a("van-cell",{attrs:{title:"賣價 (俞司廷)"}},[t._v(" "+t._s(t._f("commafy")(t.item["price-cj"]))+" ")]),a("van-cell",{attrs:{title:"魚影大小"}},[t._v(" "+t._s(t.item.shadow)+" ")]),a("van-cell",{attrs:{title:"出沒地點"}},[t._v(" "+t._s(t.availability.location)+" ")]),a("van-cell",{attrs:{title:"出沒月份 (北半球)"}},[t._v(" "+t._s(t.availability.isAllYear?"全年":t.availability["month-northern"])+" ")]),a("van-cell",{attrs:{title:"出沒月份 (南半球)"}},[t._v(" "+t._s(t.availability.isAllYear?"全年":t.availability["month-southern"])+" ")]),a("van-cell",{attrs:{title:"出沒時間"}},[t._v(" "+t._s(t.availability.isAllDay?"全天":t.availability.time)+" ")]),a("van-cell",{attrs:{title:"稀有度"}},[t._v(" "+t._s(t.availability.rarity)+" ")]),a("van-grid",{attrs:{"column-num":2}},[a("van-grid-item",[a("van-image",{attrs:{src:t.item.icon_uri,width:"50"}})],1),a("van-grid-item",[a("van-image",{attrs:{src:t.item.image_uri,fit:"fill"}})],1)],1),a("div",{attrs:{slot:"footer"},slot:"footer"},t._l(t.item.name,function(e){return a("van-tag",{key:e,staticClass:"margin-a-5",attrs:{plain:""}},[t._v(" "+t._s(e)+" ")])}),1)],1)],1)},r=[],_=l(s,n,r,!1,null,"c8e44e2b",null,null);const c=_.exports;export{c as default};
