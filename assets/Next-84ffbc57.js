import{n as a,h as n}from"./index-71d8585f.js";import{_ as l}from"./isEqual-b2d67feb.js";import{c as m}from"./movie.svc-6f99d645.js";import{m as i}from"./firebase-b7fcb020.js";import"./acnh.svc-a593798b.js";import{M as c}from"./MovieListCell-79c1cd42.js";import"./_getTag-604f503c.js";import"./isArrayLike-e2a72aad.js";const v={components:{MovieListCell:c},data(){return{keyword:"",moviesGroupByDate:[]}},computed:{filterMoviesGroupByDate(){var s;return(s=this.moviesGroupByDate)==null?void 0:s.map(e=>({...e,movies:e.movies.filter(t=>this.keyword?t.name.includes(this.keyword):!0)}))}},created(){i.child("movies-next").on("value",s=>{const e=s.val();e&&(this.moviesGroupByDate=e.items)}),this.getMoviesGroupBtDate()},beforeUnmount(){i.child("movies-next").off()},methods:{async getMoviesGroupBtDate(){const s=await m();s.success&&(l(this.moviesGroupByDate,s.items)||i.child("movies-next").set({items:s.items,dateCreated:+n()}))}}};var u=function(){var e=this,t=e._self._c;return t("div",{staticClass:"movie-list"},[t("div",{staticClass:"list__container"},[t("van-search",{attrs:{placeholder:"請輸入關鍵字搜尋"},model:{value:e.keyword,callback:function(o){e.keyword=typeof o=="string"?o.trim():o},expression:"keyword"}}),t("div",{staticClass:"list__content padding-b-30"},[e._l(e.filterMoviesGroupByDate,function(o,r){return t("van-cell-group",{key:r},[t("van-tag",{attrs:{slot:"title",type:"primary",size:"large",plain:""},slot:"title"},[e._v(" "+e._s(o.releaseDate)+" ")]),t("MovieListCell",{attrs:{items:o.movies}})],1)}),t("div",{directives:[{name:"show",rawName:"v-show",value:!e.moviesGroupByDate.length,expression:"!moviesGroupByDate.length"}]},e._l(10,function(o){return t("van-cell",{key:o},[t("van-skeleton",{attrs:{row:1}})],1)}),1)],2)],1)])},p=[],d=a(v,u,p,!1,null,"7218cad9",null,null);const g=d.exports;export{g as default};
