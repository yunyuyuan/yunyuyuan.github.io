(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-11db1eb5"],{"054b":function(t,e,n){"use strict";var a=n("69ea"),i=n.n(a);i.a},"0d68":function(t,e,n){},"38a8":function(t,e,n){},"3c79":function(t,e,n){t.exports=n.p+"img/default-cover.6b0534ab.png"},4114:function(t,e,n){"use strict";var a=n("b00b"),i=n.n(a);i.a},"44b8":function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"float-input"},[n("input",{class:{inputed:""!==t.text},style:{height:2*t.size+"rem",fontSize:.95*t.size+"rem"},attrs:{id:"float-input-"+t._uid},domProps:{value:t.value},on:{input:t.input}}),n("label",{style:{lineHeight:2*t.size+"rem",fontSize:1.4*t.size+"rem"},attrs:{for:"login-"+t._uid}},[t._v(t._s(t.name))]),n("div",{staticClass:"bar"})])},i=[],r={name:"FloatInput",props:["name","id","value","size"],data:function(){return{text:this.$props.value,inputed:!1}},watch:{"$props.value":function(){this.text=this.$props.value}},methods:{input:function(t){this.text=t.target.value,this.$emit("input",[this.$props.id,this.text])}}},s=r,c=(n("4114"),n("9ca4")),o=Object(c["a"])(s,a,i,!1,null,"ea743020",null);e["a"]=o.exports},"69ea":function(t,e,n){},"7cf6":function(t,e,n){"use strict";var a=n("0d68"),i=n.n(a);i.a},"8e8da":function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"loading-button",class:{loading:t.loading},on:{click:function(e){return t.$emit("click")}}},[n("svg-icon",{attrs:{name:t.loading?"loading":t.icon}}),n("span",[t._v(t._s(t.text))])],1)},i=[],r={name:"LoadingButton",props:{loading:{type:Boolean,default:!1},text:{type:String,default:""},icon:{type:String,default:""}}},s=r,c=(n("7cf6"),n("9ca4")),o=Object(c["a"])(s,a,i,!1,null,"255e2fcd",null);e["a"]=o.exports},b00b:function(t,e,n){},beb6:function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-detail"},[n("div",{staticClass:"operate"},[n("div",{staticClass:"back",on:{click:function(e){return t.$router.push({name:"backend.md"})}}},[n("svg-icon",{attrs:{name:"back"}}),n("span",[t._v("返回")])],1),n("loading-button",{attrs:{loading:t.saving,text:"上传",icon:"save"},on:{click:t.save}})],1),n("div",{staticClass:"head"},[n("float-input",{attrs:{name:"标题",size:1.3,value:t.getInfo()?t.getInfo().name:""},on:{input:t.inputTitle}}),n("float-input",{staticClass:"summary",attrs:{name:"简介",size:1,value:t.getInfo()?t.getInfo().summary:""},on:{input:t.inputSummary}})],1),n("div",{staticClass:"info"},[n("div",{staticClass:"cover"},[n("img",{attrs:{src:t.getInfo()?t.getInfo().cover:t.defaultCover}}),n("label",[n("span",[t._v("封面链接:")]),n("input",{on:{focusout:t.changeCover}})])]),n("div",{staticClass:"tags"},[n("span",{staticClass:"tag-icon"},[n("svg-icon",{attrs:{name:"tag"}})],1),t._l(t.getInfo()?t.getInfo().tags:[],(function(e,a){return n("div",{key:e,class:{editing:t.tagEditIndex===a}},[n("input",{attrs:{disabled:t.tagEditIndex!==a,"data-old":e,"data-idx":a},domProps:{value:e},on:{focusout:t.editTag}}),n("div",[n("span",{on:{click:function(e){return t.clickTrash(a)}}},[n("svg-icon",{attrs:{name:"trash"}})],1),n("span",{attrs:{"data-idx":a},on:{click:t.clickEdit}},[n("svg-icon",{attrs:{name:"edit"}})],1)])])})),n("span",{staticClass:"add",on:{click:t.addTag}},[n("svg-icon",{attrs:{name:"add"}})],1)],2)]),n("div",{staticClass:"text"},[n("div",{staticClass:"markdown"},[n("textarea",{directives:[{name:"model",rawName:"v-model",value:t.mdText,expression:"mdText"}],domProps:{value:t.mdText},on:{input:function(e){e.target.composing||(t.mdText=e.target.value)}}})]),n("div",{staticClass:"html"},[n("span",{staticClass:"--markdown",domProps:{innerHTML:t._s(t.htmlText)}})])])])},i=[],r=(n("b4fb"),n("ea69"),n("053b"),n("e18c"),n("1c2e"),n("6a61"),n("cf7f")),s=n("52ef"),c=n("e793"),o=n("56d7"),u=n("025e"),d=n("9f3a"),l=n("44b8"),f=(n("38a8"),n("8e8da")),g=n("3c79"),m=n.n(g),p={name:"MdDetail",components:{LoadingButton:f["a"],FloatInput:l["a"]},data:function(){return{defaultCover:m.a,tagEditIndex:-1,mdText:"",saving:!1,newInfo:{name:"编辑标题",file:"",cover:"",time:"",summary:"编辑简介",tags:[]}}},computed:Object(c["a"])(Object(c["a"])({},Object(d["b"])(["gitUtil","config"])),{},{id:function(){return this.$route.params.id},info:function(){var t,e=Object(s["a"])(this.config.md);try{for(e.s();!(t=e.n()).done;){var n=t.value;if(n.file===this.id)return n}}catch(a){e.e(a)}finally{e.f()}},htmlText:function(){return Object(u["e"])(this.mdText)}}),created:function(){var t=this;return Object(r["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.init();case 2:case"end":return e.stop()}}),e)})))()},watch:{$route:function(){var t=this;return Object(r["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.init();case 2:case"end":return e.stop()}}),e)})))()}},methods:{init:function(){var t=this;return Object(r["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t.mdText="","backend.md.detail"!==t.$route.name){e.next=6;break}if(document.title+=t.id,"new"===t.$route.params.id){e.next=6;break}return e.next=6,t.getMdText();case 6:case"end":return e.stop()}}),e)})))()},getMdText:function(){var t=this;return Object(r["a"])(regeneratorRuntime.mark((function e(){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(u["c"])("".concat(o["staticFolder"],"/md/").concat(t.id,"/index.md"));case 2:n=e.sent,n[0]?t.mdText=n[1]:t.$message.error(Object(u["d"])(n[1]));case 4:case"end":return e.stop()}}),e)})))()},getInfo:function(){return"new"===this.id?this.newInfo:this.info},inputTitle:function(t){var e=this.getInfo();e.name=t[1]},inputSummary:function(t){var e=this.getInfo();e.summary=t[1]},changeCover:function(t){var e=this.getInfo();e.cover=t.target.value},clickTrash:function(t){var e=this.getInfo();e.tags.splice(t,1)},clickEdit:function(t){var e=t.currentTarget;this.tagEditIndex=parseInt(e.getAttribute("data-idx")),this.$nextTick((function(){e.parentElement.previousElementSibling.focus()}))},editTag:function(t){var e=this.getInfo(),n=t.target;this.tagEditIndex=-1;var a,i=Object(s["a"])(e.tags);try{for(i.s();!(a=i.n()).done;){var r=a.value;if(r!==n.getAttribute("data-old")&&r===n.value)return this.$message.warning("标签不能重复!")}}catch(c){i.e(c)}finally{i.f()}e.tags.splice(parseInt(n.getAttribute("data-idx")),1,n.value)},addTag:function(){var t=this.getInfo();t.tags.push("输入标签"+t.tags.length)},save:function(){var t=this;return Object(r["a"])(regeneratorRuntime.mark((function e(){var n,a,i,r,s;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!t.saving){e.next=2;break}return e.abrupt("return");case 2:if(!t.gitUtil){e.next=24;break}if(n=t.getInfo(),n.name&&n.summary&&n.tags.length&&n.cover){e.next=6;break}return e.abrupt("return",t.$message.warning("标题,简介,标签和封面均不能为空!"));case 6:return t.saving=!0,a=(new Date).getTime(),"new"!==t.id?a=t.id:(i=t.config.md,i.push(JSON.parse(JSON.stringify(t.newInfo))),n.file=a.toString()),n.time=a,e.next=12,t.gitUtil.updateConfig(t.config);case 12:if(r=e.sent,!r[0]){e.next=20;break}return e.next=16,t.gitUtil.updateMd({folder:a,md:Object(u["f"])(t.mdText),html:Object(u["f"])(t.htmlText)});case 16:s=e.sent,s[0]?(t.$message.success("上传成功!"),t.$router.push({name:"backend.md"})):t.$message.error(Object(u["d"])(s[1])),e.next=21;break;case 20:t.$message.error(Object(u["d"])(r[1]));case 21:t.saving=!1,e.next=26;break;case 24:t.$message.warning("请先登录!"),t.$emit("login");case 26:case"end":return e.stop()}}),e)})))()}}},v=p,h=(n("054b"),n("9ca4")),b=Object(h["a"])(v,a,i,!1,null,"617261e8",null);e["default"]=b.exports}}]);
//# sourceMappingURL=chunk-11db1eb5.8dce2433.js.map