define("docker-manager/app",["ember","ember/resolver","ember/load-initializers","docker-manager/config/environment","exports"],function(e,t,s,n,r){"use strict";var a=e["default"],o=t["default"],i=s["default"],u=n["default"];a.MODEL_FACTORY_INJECTIONS=!0;var f=a.Application.extend({modulePrefix:u.modulePrefix,podModulePrefix:u.podModulePrefix,Resolver:o});i(f,u.modulePrefix),r["default"]=f}),define("docker-manager/components/progress-bar",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Component.extend({classNameBindings:[":progress",":progress-striped","active"],active:function(){return 100!==parseInt(this.get("percent"),10)}.property("percent"),barStyle:function(){var e=parseInt(this.get("percent"),10);return e>0?(e>100&&(e=100),"width: "+this.get("percent")+"%"):void 0}.property("percent")})}),define("docker-manager/components/x-console",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Component.extend({classNameBindings:[":logs"],render:function(e){s.isEmpty(this.get("output"))||e.push(this.get("output"))},_outputChanged:function(){s.run.scheduleOnce("afterRender",this,"_scrollBottom"),this.rerender()}.observes("output"),_scrollBottom:function(){this.get("followOutput")&&this.$().scrollTop(this.$()[0].scrollHeight)},_scrollOnInsert:function(){this._scrollBottom()}.on("didInsertElement")})}),define("docker-manager/components/x-tab",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Component.extend({tagName:"li",classNameBindings:["active"],active:function(){return this.get("childViews").anyBy("active")}.property("childViews.@each.active")})}),define("docker-manager/controllers/application",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.ObjectController.extend({showBanner:!1,actions:{dismiss:function(){this.set("showBanner",!1)}}})}),define("docker-manager/controllers/index",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.ObjectController.extend({upgrading:null})}),define("docker-manager/controllers/processes",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.ObjectController.extend({autoRefresh:!1,init:function(){this._super();var e=this;window.setInterval(function(){e.performRefresh()},5e3)},performRefresh:function(){this.get("autoRefresh")&&this.get("model").refresh()}})}),define("docker-manager/controllers/repo",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.ObjectController.extend({needs:["index"],upgradingRepo:s.computed.alias("controllers.index.upgrading"),managerRepo:s.computed.alias("controllers.index.managerRepo"),upgradeDisabled:function(){var e=this.get("upgradingRepo");if(s.isNone(e)){var t=this.get("managerRepo");return t?!t.get("upToDate")&&t!==this.get("model"):!1}return!0}.property("upgradingRepo","model","managerRepo","managerRepo.upToDate")})}),define("docker-manager/controllers/upgrade",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.ObjectController.extend({init:function(){this._super(),this.reset()},complete:s.computed.equal("status","complete"),failed:s.computed.equal("status","failed"),messageReceived:function(e){switch(e.type){case"log":this.set("output",this.get("output")+e.value+"\n");break;case"percent":this.set("percent",e.value);break;case"status":this.set("status",e.value),("complete"===e.value||"failed"===e.value)&&this.set("upgrading",!1),"complete"===e.value&&this.set("version",this.get("latest.version"))}},upgradeButtonText:function(){return this.get("upgrading")?"Upgrading...":"Start Upgrading"}.property("upgrading"),startBus:function(){var e=this;MessageBus.subscribe("/docker/upgrade",function(t){e.messageReceived(t)})},stopBus:function(){MessageBus.unsubscribe("/docker/upgrade")},reset:function(){this.setProperties({output:"",status:null,percent:0})},actions:{start:function(){this.reset();var e=this.get("model");e.get("upgrading")||e.startUpgrade()},resetUpgrade:function(){var e=this;bootbox.confirm("WARNING: You should only reset upgrades that have failed and are not running.\n\nThis will NOT cancel currently running builds and should only be used as a last resort.",function(t){if(t){var s=e.get("model");s.resetUpgrade().then(function(){e.reset()})}})}}})}),define("docker-manager/helpers/fa-icon",["ember","exports"],function(e,t){"use strict";var s=e["default"],n=/^fa\-.+/,r=s.Logger.warn,a=function(e,t){if("string"!==s.typeOf(e)){var a="fa-icon: no icon specified";return r(a),new s.Handlebars.SafeString(a)}var o=t.hash,i=[],u="";return i.push("fa"),e.match(n)||(e="fa-"+e),i.push(e),o.spin&&i.push("fa-spin"),o.flip&&i.push("fa-flip-"+o.flip),o.rotate&&i.push("fa-rotate-"+o.rotate),o.lg&&(r("fa-icon: the 'lg' parameter is deprecated. Use 'size' instead. I.e. {{fa-icon size=\"lg\"}}"),i.push("fa-lg")),o.x&&(r("fa-icon: the 'x' parameter is deprecated. Use 'size' instead. I.e. {{fa-icon size=\""+o.x+'"}}'),i.push("fa-"+o.x+"x")),o.size&&i.push("number"===s.typeOf(o.size)?"fa-"+o.size+"x":"fa-"+o.size),o.fixedWidth&&i.push("fa-fw"),o.listItem&&i.push("fa-li"),o.pull&&i.push("pull-"+o.pull),o.border&&i.push("fa-border"),o.classNames&&!s.isArray(o.classNames)&&(o.classNames=[o.classNames]),s.isEmpty(o.classNames)||Array.prototype.push.apply(i,o.classNames),u+="<i",u+=" class='"+i.join(" ")+"'",o.title&&(u+=" title='"+o.title+"'"),u+="></i>",new s.Handlebars.SafeString(u)};t.faIcon=a,t["default"]=s.Handlebars.makeBoundHelper(a)}),define("docker-manager/helpers/fmt-ago",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.makeBoundHelper(function(e){return s.isEmpty(e)?new s.Handlebars.SafeString("&mdash;"):moment(e).fromNow()})}),define("docker-manager/helpers/fmt-commit",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.makeBoundHelper(function(e,t){return s.isNone(t)?void 0:new s.Handlebars.SafeString("(<a href='"+t+"'>"+e+"</a>)")})}),define("docker-manager/initializers/crsf-token",["ic-ajax","exports"],function(e,t){"use strict";var s=e["default"];t["default"]={name:"findCsrfToken",initialize:function(){return s("/session/csrf").then(function(e){var t=e.csrf;$.ajaxPrefilter(function(e,s,n){e.crossDomain||n.setRequestHeader("X-CSRF-Token",t)})})}}}),define("docker-manager/initializers/export-application-global",["ember","docker-manager/config/environment","exports"],function(e,t,s){"use strict";function n(e,t){var s=r.String.classify(a.modulePrefix);a.exportApplicationGlobal&&(window[s]=t)}var r=e["default"],a=t["default"];s.initialize=n,s["default"]={name:"export-application-global",initialize:n}}),define("docker-manager/models/process-list",["ic-ajax","ember","exports"],function(e,t,s){"use strict";var n=e["default"],r=t["default"],a=r.Object.extend({init:function(){this._super()},refresh:function(){var e=this;return n("/admin/docker/ps").then(function(t){return e.set("output",t),e})}});a.reopenClass({find:function(){var e=a.create();return e.refresh()}}),s["default"]=a}),define("docker-manager/models/repo",["ic-ajax","ember","exports"],function(e,t,s){"use strict";var n=e["default"],r=t["default"],a=[],o=r.Object.extend({upToDate:function(){return!this.get("upgrading")&this.get("version")===this.get("latest.version")}.property("upgrading","version","latest.version"),shouldCheck:function(){if(r.isNone(this.get("version")))return!1;if(this.get("checking"))return!1;var e=this.get("lastCheckedAt");if(e){var t=(new Date).getTime()-e;return t>6e4}return!0}.property()["volatile"](),repoAjax:function(e,t){return t=t||{},t.data=this.getProperties("path","version","branch"),n(e,t)},findLatest:function(){var e=this;return new r.RSVP.Promise(function(t){return e.get("shouldCheck")?(e.set("checking",!0),void e.repoAjax("/admin/docker/latest").then(function(s){e.setProperties({checking:!1,lastCheckedAt:(new Date).getTime(),latest:r.Object.create(s.latest)}),t()})):t()})},findProgress:function(){return this.repoAjax("/admin/docker/progress").then(function(e){return e.progress})},resetUpgrade:function(){var e=this;return this.repoAjax("/admin/docker/upgrade",{type:"DELETE"}).then(function(){e.set("upgrading",!1)})},startUpgrade:function(){var e=this;return this.set("upgrading",!0),this.repoAjax("/admin/docker/upgrade",{type:"POST"})["catch"](function(){e.set("upgrading",!1)})}});o.reopenClass({findAll:function(){return new r.RSVP.Promise(function(e){return a.length?e(a):void n("/admin/docker/repos").then(function(t){a=t.repos.map(function(e){return o.create(e)}),e(a)})})},findUpgrading:function(){return this.findAll().then(function(e){return e.findBy("upgrading",!0)})},find:function(e){return this.findAll().then(function(t){return t.findBy("id",e)})}}),s["default"]=o}),define("docker-manager/router",["ember","docker-manager/config/environment","exports"],function(e,t,s){"use strict";var n=e["default"],r=t["default"],a=n.Router.extend({location:r.locationType});a.map(function(){this.route("processes"),this.resource("upgrade",{path:"/upgrade/:id"})}),s["default"]=a}),define("docker-manager/routes/index",["docker-manager/models/repo","ember","exports"],function(e,t,s){"use strict";var n=e["default"],r=t["default"];s["default"]=r.Route.extend({model:function(){return n.findAll()},setupController:function(e,t){var s=this;e.setProperties({model:t,upgrading:null}),t.forEach(function(t){t.findLatest(),t.get("upgrading")&&e.set("upgrading",t),"docker_manager"===t.get("id")&&e.set("managerRepo",t),"discourse"===t.get("id")&&"origin/master"===t.get("branch")&&s.controllerFor("application").set("showBanner",!0)})},actions:{upgrade:function(e){this.transitionTo("upgrade",e)}}})}),define("docker-manager/routes/processes",["docker-manager/models/process-list","ember","exports"],function(e,t,s){"use strict";var n=e["default"],r=t["default"];s["default"]=r.Route.extend({model:function(){return n.find()}})}),define("docker-manager/routes/upgrade",["docker-manager/models/repo","ember","exports"],function(e,t,s){"use strict";var n=e["default"],r=t["default"];s["default"]=r.Route.extend({model:function(e){return n.find(e.id)},afterModel:function(e){var t=this;return n.findUpgrading().then(function(s){return s&&s!==e?r.RSVP.Promise.reject("wat"):e.findLatest().then(function(){return e.findProgress().then(function(e){t.set("progress",e)})})})},setupController:function(e,t){e.reset(),e.setProperties({model:t,output:this.get("progress.logs"),percent:this.get("progress.percentage")}),e.startBus()},deactivate:function(){this.controllerFor("upgrade").stopBus()}})}),define("docker-manager/templates/application",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,n,r,a){function o(e,t){t.buffer.push('<img src="/assets/images/docker-manager-ea64623b074c8ec2b0303bae846e21e6.png" class="logo">')}function i(e,t){t.buffer.push("Docker Manager")}function u(e,t){var s="";return t.buffer.push('\n    <div id="banner">\n      <div id="banner-content">\n        <div class="close" '),t.buffer.push(g(n.action.call(e,"dismiss",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["STRING"],data:t}))),t.buffer.push('><i class="fa fa-times" title="Dismiss this banner."></i></div>\n        <p><b>WARNING:</b> Your Discourse is tracking the \'master\' branch which may be unstable, <a href="https://meta.discourse.org/t/change-tracking-branch-for-your-discourse-instance/17014">we recommend tracking the \'tests-passed\' branch</a>.</p>\n      </div>\n    </div>\n  '),s}function f(e,t){t.buffer.push("Home")}function p(e,t){t.buffer.push("Processes")}this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,s.Handlebars.helpers),a=a||{};var h,c,l,d="",g=this.escapeExpression,m=this,b=n.helperMissing;return a.buffer.push('<header class="container">\n  '),c=n["link-to"]||t&&t["link-to"],l={hash:{},hashTypes:{},hashContexts:{},inverse:m.noop,fn:m.program(1,o,a),contexts:[t],types:["STRING"],data:a},h=c?c.call(t,"index",l):b.call(t,"link-to","index",l),(h||0===h)&&a.buffer.push(h),a.buffer.push("\n  <h1>"),c=n["link-to"]||t&&t["link-to"],l={hash:{},hashTypes:{},hashContexts:{},inverse:m.noop,fn:m.program(3,i,a),contexts:[t],types:["STRING"],data:a},h=c?c.call(t,"index",l):b.call(t,"link-to","index",l),(h||0===h)&&a.buffer.push(h),a.buffer.push('</h1>\n</header>\n\n<div class="container">\n\n  '),h=n["if"].call(t,"showBanner",{hash:{},hashTypes:{},hashContexts:{},inverse:m.noop,fn:m.program(5,u,a),contexts:[t],types:["ID"],data:a}),(h||0===h)&&a.buffer.push(h),a.buffer.push('\n\n  <ul class="nav nav-tabs">\n    '),c=n["x-tab"]||t&&t["x-tab"],l={hash:{route:"index"},hashTypes:{route:"STRING"},hashContexts:{route:t},inverse:m.noop,fn:m.program(7,f,a),contexts:[],types:[],data:a},h=c?c.call(t,l):b.call(t,"x-tab",l),(h||0===h)&&a.buffer.push(h),a.buffer.push("\n    "),c=n["x-tab"]||t&&t["x-tab"],l={hash:{route:"processes"},hashTypes:{route:"STRING"},hashContexts:{route:t},inverse:m.noop,fn:m.program(9,p,a),contexts:[],types:[],data:a},h=c?c.call(t,l):b.call(t,"x-tab",l),(h||0===h)&&a.buffer.push(h),a.buffer.push("\n    <li><a href='/'>Return to site</a></li>\n    <li><a href='/admin/backups'>Backups</a></li>\n  </ul>\n\n  "),h=n._triageMustache.call(t,"outlet",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["ID"],data:a}),(h||0===h)&&a.buffer.push(h),a.buffer.push("\n</div>\n"),d})}),define("docker-manager/templates/components/progress-bar",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,n,r,a){this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,s.Handlebars.helpers),a=a||{};var o="",i=this.escapeExpression;return a.buffer.push('<div class="progress-bar" '),a.buffer.push(i(n["bind-attr"].call(t,{hash:{style:"barStyle"},hashTypes:{style:"STRING"},hashContexts:{style:t},contexts:[],types:[],data:a}))),a.buffer.push("></div>\n"),o})}),define("docker-manager/templates/components/x-tab",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,n,r,a){function o(e,t){var s;s=n._triageMustache.call(e,"yield",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["ID"],data:t}),t.buffer.push(s||0===s?s:"")}this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,s.Handlebars.helpers),a=a||{};var i,u,f,p="",h=this,c=n.helperMissing;return u=n["link-to"]||t&&t["link-to"],f={hash:{},hashTypes:{},hashContexts:{},inverse:h.noop,fn:h.program(1,o,a),contexts:[t],types:["ID"],data:a},i=u?u.call(t,"route",f):c.call(t,"link-to","route",f),(i||0===i)&&a.buffer.push(i),a.buffer.push("\n"),p})}),define("docker-manager/templates/index",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,n,r,a){function o(e,t){var s,r,a,o="";return t.buffer.push("\n    <tr>\n      <td>\n        "),s=n._triageMustache.call(e,"name",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push("\n        "),t.buffer.push(g((r=n["fmt-commit"]||e&&e["fmt-commit"],a={hash:{},hashTypes:{},hashContexts:{},contexts:[e,e],types:["ID","ID"],data:t},r?r.call(e,"version","url",a):m.call(e,"fmt-commit","version","url",a)))),t.buffer.push("\n      </td>\n      <td>\n        "),s=n["if"].call(e,"checking",{hash:{},hashTypes:{},hashContexts:{},inverse:b.program(4,u,t),fn:b.program(2,i,t),contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push("\n      </td>\n    </tr>\n    "),o}function i(e,t){t.buffer.push("\n          Checking for new version...\n        ")}function u(e,t){var s,r="";return t.buffer.push("\n          "),s=n["if"].call(e,"upToDate",{hash:{},hashTypes:{},hashContexts:{},inverse:b.program(7,p,t),fn:b.program(5,f,t),contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push("\n        "),r}function f(e,t){t.buffer.push("\n            Up to date\n          ")}function p(e,t){var s,r,a,o="";return t.buffer.push("\n            <div class='new-version'>\n              <h4>New Version Available!</h4>\n              <ul>\n                <li>Remote Version: "),t.buffer.push(g((r=n["fmt-commit"]||e&&e["fmt-commit"],a={hash:{},hashTypes:{},hashContexts:{},contexts:[e,e],types:["ID","ID"],data:t},r?r.call(e,"latest.version","url",a):m.call(e,"fmt-commit","latest.version","url",a)))),t.buffer.push("</li>\n                <li>Last Updated: "),t.buffer.push(g((r=n["fmt-ago"]||e&&e["fmt-ago"],a={hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["ID"],data:t},r?r.call(e,"latest.date",a):m.call(e,"fmt-ago","latest.date",a)))),t.buffer.push("</li>\n                <li class='new-commits'>"),s=n._triageMustache.call(e,"latest.commits_behind",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push(" new commits</li>\n              </ul>\n              "),s=n["if"].call(e,"upgrading",{hash:{},hashTypes:{},hashContexts:{},inverse:b.program(10,c,t),fn:b.program(8,h,t),contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push("\n            </div>\n          "),o}function h(e,t){var s="";return t.buffer.push('\n                <button class="btn" '),t.buffer.push(g(n.action.call(e,"upgrade","",{hash:{},hashTypes:{},hashContexts:{},contexts:[e,e],types:["STRING","ID"],data:t}))),t.buffer.push(">Currently Upgrading...</button>\n              "),s}function c(e,t){var s="";return t.buffer.push('\n                <button class="btn" '),t.buffer.push(g(n.action.call(e,"upgrade","",{hash:{},hashTypes:{},hashContexts:{},contexts:[e,e],types:["STRING","ID"],data:t}))),t.buffer.push(" "),t.buffer.push(g(n["bind-attr"].call(e,{hash:{disabled:"upgradeDisabled"},hashTypes:{disabled:"STRING"},hashContexts:{disabled:e},contexts:[],types:[],data:t}))),t.buffer.push(">Upgrade to the Latest Version</button>\n              "),s}this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,s.Handlebars.helpers),a=a||{};var l,d="",g=this.escapeExpression,m=n.helperMissing,b=this;return a.buffer.push("<h3>Repositories</h3>\n\n<table class='table' id='repos'>\n  <tr>\n    <th style='width: 50%'>Name</th>\n    <th>Status</th>\n  </tr>\n  <tbody>\n    "),l=n.each.call(t,"model",{hash:{itemController:"repo"},hashTypes:{itemController:"STRING"},hashContexts:{itemController:t},inverse:b.noop,fn:b.program(1,o,a),contexts:[t],types:["ID"],data:a}),(l||0===l)&&a.buffer.push(l),a.buffer.push("\n  </tbody>\n</table>\n"),d})}),define("docker-manager/templates/loading",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,n,r,a){this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,s.Handlebars.helpers),a=a||{},a.buffer.push("<h3 class='loading'>Loading...</h3>\n")})}),define("docker-manager/templates/processes",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,n,r,a){this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,s.Handlebars.helpers),a=a||{};var o,i,u="",f=n.helperMissing,p=this.escapeExpression;return a.buffer.push("<h3>Processes</h3>\n\n"),a.buffer.push(p((o=n["x-console"]||t&&t["x-console"],i={hash:{output:"output"},hashTypes:{output:"ID"},hashContexts:{output:t},contexts:[],types:[],data:a},o?o.call(t,i):f.call(t,"x-console",i)))),a.buffer.push("\n"),u})}),define("docker-manager/templates/upgrade",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,n,r,a){function o(e,t){t.buffer.push("\n  <p>Upgrade completed successfully!</p>\n  <p>Note: The web server restarts in the background. It's a good idea to wait 30 seconds or so\n     before refreshing your browser to see the latest version of the application.</p>\n")}function i(e,t){t.buffer.push("\n  <p>Sorry, there was an error upgrading Discourse. Please check the logs below.</p>\n")}function u(e,t){var s,r,a,o="";return t.buffer.push("\n  <p>"),s=n._triageMustache.call(e,"name",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push(" is at the newest version "),t.buffer.push(m((r=n["fmt-commit"]||e&&e["fmt-commit"],a={hash:{},hashTypes:{},hashContexts:{},contexts:[e,e],types:["ID","ID"],data:t},r?r.call(e,"version","url",a):g.call(e,"fmt-commit","version","url",a)))),t.buffer.push(".</p>\n"),o}function f(e,t){var s,r="";return t.buffer.push("\n  <div style='clear: both'>\n    <button "),t.buffer.push(m(n.action.call(e,"start",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["STRING"],data:t}))),t.buffer.push(" "),t.buffer.push(m(n["bind-attr"].call(e,{hash:{disabled:"upgrading"},hashTypes:{disabled:"STRING"},hashContexts:{disabled:e},contexts:[],types:[],data:t}))),t.buffer.push(" class='btn'>"),s=n._triageMustache.call(e,"upgradeButtonText",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push("</button>\n    "),s=n["if"].call(e,"upgrading",{hash:{},hashTypes:{},hashContexts:{},inverse:b.noop,fn:b.program(8,p,t),contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push("\n  </div>\n"),r}function p(e,t){var s="";return t.buffer.push("\n      <button "),t.buffer.push(m(n.action.call(e,"resetUpgrade",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["STRING"],data:t}))),t.buffer.push(' class="btn unlock">Reset Upgrade</button>\n    '),s}this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,s.Handlebars.helpers),a=a||{};var h,c,l,d="",g=n.helperMissing,m=this.escapeExpression,b=this;return a.buffer.push("<h3>Upgrade "),h=n._triageMustache.call(t,"name",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["ID"],data:a}),(h||0===h)&&a.buffer.push(h),a.buffer.push("</h3>\n\n"),a.buffer.push(m((c=n["progress-bar"]||t&&t["progress-bar"],l={hash:{percent:"percent"},hashTypes:{percent:"ID"},hashContexts:{percent:t},contexts:[],types:[],data:a},c?c.call(t,l):g.call(t,"progress-bar",l)))),a.buffer.push("\n\n"),h=n["if"].call(t,"complete",{hash:{},hashTypes:{},hashContexts:{},inverse:b.noop,fn:b.program(1,o,a),contexts:[t],types:["ID"],data:a}),(h||0===h)&&a.buffer.push(h),a.buffer.push("\n\n"),h=n["if"].call(t,"failed",{hash:{},hashTypes:{},hashContexts:{},inverse:b.noop,fn:b.program(3,i,a),contexts:[t],types:["ID"],data:a}),(h||0===h)&&a.buffer.push(h),a.buffer.push("\n\n"),h=n["if"].call(t,"upToDate",{hash:{},hashTypes:{},hashContexts:{},inverse:b.program(7,f,a),fn:b.program(5,u,a),contexts:[t],types:["ID"],data:a}),(h||0===h)&&a.buffer.push(h),a.buffer.push("\n\n"),a.buffer.push(m((c=n["x-console"]||t&&t["x-console"],l={hash:{output:"output",followOutput:!0},hashTypes:{output:"ID",followOutput:"BOOLEAN"},hashContexts:{output:t,followOutput:t},contexts:[],types:[],data:a},c?c.call(t,l):g.call(t,"x-console",l)))),a.buffer.push("\n"),d})}),define("docker-manager/config/environment",["ember"],function(e){var t="docker-manager";try{var s=t+"/config/environment",n=e["default"].$('meta[name="'+s+'"]').attr("content"),r=JSON.parse(unescape(n));return{"default":r}}catch(a){throw new Error('Could not read config from meta tag with name "'+s+'".')}}),runningTests?require("docker-manager/tests/test-helper"):require("docker-manager/app")["default"].create({});