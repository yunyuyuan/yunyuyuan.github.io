(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0f25bcba"],{"2eeb":function(n,t,i){"use strict";var e=i("1c8b"),r=i("5dfd").map,a=i("1ea7"),o=i("ff9c"),c=a("map"),f=o("map");e({target:"Array",proto:!0,forced:!c||!f},{map:function(n){return r(this,n,arguments.length>1?arguments[1]:void 0)}})},4194:function(n,t,i){"use strict";var e=i("1c8b"),r=i("5dfd").find,a=i("258f"),o=i("ff9c"),c="find",f=!0,s=o(c);c in[]&&Array(1)[c]((function(){f=!1})),e({target:"Array",proto:!0,forced:f||!s},{find:function(n){return r(this,n,arguments.length>1?arguments[1]:void 0)}}),a(c)},"8e13":function(n,t,i){},"93c6":function(n,t,i){"use strict";i.r(t);var e=function(){var n=this,t=n.$createElement,i=n._self._c||t;return i("div",{staticClass:"config",attrs:{flex:""}},[i("div",{staticClass:"head",attrs:{flex:""}},[i("svg-icon",{attrs:{name:"config"}}),i("b",[n._v("修改配置信息")])],1),i("div",{staticClass:"list",attrs:{flex:""}},[n._l(n.keys,(function(t){return i("float-input",{attrs:{name:t,value:n.info[t]||"",id:t,size:1,isArea:"describe"===t},on:{input:n.input}})})),i("label",{attrs:{flex:""}},[i("span",{class:{active:"img"===n.info.backgroundImg},on:{click:function(t){return n.changeBg("img")}}},[n._v("图片背景")]),i("span",{class:{active:"color"===n.info.backgroundImg},on:{click:function(t){return n.changeBg("color")}}},[n._v("彩色背景")]),i("span",{class:{active:"random"===n.info.backgroundImg},on:{click:function(t){return n.changeBg("random")}}},[n._v("随机")])]),i("div",{staticClass:"friends",attrs:{flex:""}},[n._l(n.info.friends,(function(t){return i("div",{key:t.id,staticClass:"item",attrs:{flex:""}},[i("float-input",{attrs:{name:"简介",value:t.summary,id:t.id,size:.85},on:{input:n.friendsSummary}}),i("float-input",{attrs:{name:"github名字",value:t.github,id:t.id,size:.85},on:{input:n.friendsGithub}}),i("float-input",{attrs:{name:"网站",value:t.site,id:t.id,size:.85},on:{input:n.friendsSite}}),i("single-button",{staticClass:"del-btn",attrs:{text:"删除"},nativeOn:{click:function(i){return n.friendsDel(t)}}})],1)})),i("loading-button",{attrs:{loading:!1,icon:"add",text:"添加",size:1.1},nativeOn:{click:function(t){return n.friendsNew(t)}}})],2)],2),i("loading-button",{attrs:{loading:n.updating,text:"上传",icon:"save"},nativeOn:{click:function(t){return n.commitConfig(t)}}})],1)},r=[],a=(i("4194"),i("fe59"),i("ecb4"),i("2eeb"),i("ea69"),i("e18c"),i("08ba"),i("af86"),i("19d5")),o=(i("6a61"),i("327b")),c=i("df3b");function f(n){if(Array.isArray(n))return Object(c["a"])(n)}i("f3dd"),i("0a51"),i("9b11"),i("98e0"),i("96db");function s(n){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(n))return Array.from(n)}var u=i("db29");function d(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function l(n){return f(n)||s(n)||Object(u["a"])(n)||d()}var b=i("b993"),g=i("44b8"),m=i("fa7d"),h=i("8e8da"),p=i("2a7d"),v={name:"Config",components:{SingleButton:p["a"],LoadingButton:h["a"],FloatInput:g["a"]},data:function(){return{updating:!1,info:{},keys:["name","describe","copyright","github","email"]}},computed:{config:function(){return this._config()},gitUtil:function(){return this._gitUtil()}},watch:{config:{immediate:!0,deep:!0,handler:function(){this.info=JSON.parse(JSON.stringify(this.config)),this.info.friends.forEach((function(n,t){n.id=t}))}}},inject:["_config","_gitUtil"],methods:{input:function(n){this.info[n[0]]=n[1]},changeBg:function(n){this.info.backgroundImg=n},friendsSummary:function(n){var t=Object(b["a"])(n,2),i=t[0],e=t[1];this.info.friends.find((function(n){return n.id===i})).summary=e},friendsGithub:function(n){var t=Object(b["a"])(n,2),i=t[0],e=t[1];this.info.friends.find((function(n){return n.id===i})).github=e},friendsSite:function(n){var t=Object(b["a"])(n,2),i=t[0],e=t[1];this.info.friends.find((function(n){return n.id===i})).site=e},friendsDel:function(n){this.info.friends.splice(this.info.friends.indexOf(n),1)},friendsNew:function(){this.info.friends.push({summary:"",github:"",site:"",id:Math.max.apply(Math,l(this.info.friends.map((function(n){return n.id}))))+1})},commitConfig:function(){var n=this;return Object(o["a"])(regeneratorRuntime.mark((function t(){var i,e,r,o;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(!n.gitUtil){t.next=13;break}n.updating=!0,i=Object(a["a"])(n.keys);try{for(i.s();!(e=i.n()).done;)r=e.value,n.config[r]=n.info[r]}catch(c){i.e(c)}finally{i.f()}return n.config.backgroundImg=n.info.backgroundImg,n.config.friends=n.info.friends.map((function(n){var t={};for(var i in n)"id"!==i&&(t[i]=n[i]);return t})),t.next=8,n.gitUtil.updateJsonFile("config.json",n.config);case 8:o=t.sent,n.updating=!1,o[0]?n.$message.success("更新成功!"):n.$message.error(Object(m["c"])(o[1])),t.next=15;break;case 13:n.$message.warning("请先登录!"),n.$emit("login");case 15:case"end":return t.stop()}}),t)})))()}}},y=v,k=(i("db1b"),i("9ca4")),w=Object(k["a"])(y,e,r,!1,null,"0bc6d075",null);t["default"]=w.exports},b993:function(n,t,i){"use strict";function e(n){if(Array.isArray(n))return n}i.d(t,"a",(function(){return c}));i("f3dd"),i("0a51"),i("9b11"),i("e18c"),i("96db"),i("af86");function r(n,t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(n)){var i=[],e=!0,r=!1,a=void 0;try{for(var o,c=n[Symbol.iterator]();!(e=(o=c.next()).done);e=!0)if(i.push(o.value),t&&i.length===t)break}catch(f){r=!0,a=f}finally{try{e||null==c["return"]||c["return"]()}finally{if(r)throw a}}return i}}var a=i("db29");function o(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function c(n,t){return e(n)||r(n,t)||Object(a["a"])(n,t)||o()}},db1b:function(n,t,i){"use strict";var e=i("8e13"),r=i.n(e);r.a}}]);