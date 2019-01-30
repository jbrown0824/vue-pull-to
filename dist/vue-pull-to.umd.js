(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.VuePullTo = {})));
}(this, (function (exports) { 'use strict';

	// http://www.alloyteam.com/2012/11/javascript-throttle/

	function throttle(fn, delay, mustRunDelay) {
		if ( mustRunDelay === void 0 ) mustRunDelay = 0;

		var timer = null;
		var tStart;
		return function() {
			var context = this;
			var args = arguments;
			var tCurr = +new Date();
			clearTimeout(timer);
			if (!tStart) {
				tStart = tCurr;
			}
			if (mustRunDelay !== 0 && tCurr - tStart >= mustRunDelay) {
				fn.apply(context, args);
				tStart = tCurr;
			} else {
				timer = setTimeout(function() {
					fn.apply(context, args);
				}, delay);
			}
		};
	}

	var TOP_DEFAULT_CONFIG = {
		pullText: '下拉刷新',
		triggerText: '释放更新',
		loadingText: '加载中...',
		doneText: '加载完成',
		failText: '加载失败',
		loadedStayTime: 400,
		stayDistance: 50,
		triggerDistance: 70,
	};

	var BOTTOM_DEFAULT_CONFIG = {
		pullText: '上拉加载',
		triggerText: '释放更新',
		loadingText: '加载中...',
		doneText: '加载完成',
		failText: '加载失败',
		loadedStayTime: 400,
		stayDistance: 50,
		triggerDistance: 70,
	};

	(function(){ if(typeof document !== 'undefined'){ var head=document.head||document.getElementsByTagName('head')[0], style=document.createElement('style'), css=" .vue-pull-to-wrapper[data-v-81faaf1a]{ display:flex; flex-direction:column; height:100%; } .scroll-container[data-v-81faaf1a]{ flex:1; overflow-x:hidden; overflow-y:scroll; -webkit-overflow-scrolling:touch; } .vue-pull-to-wrapper .action-block[data-v-81faaf1a]{ position:relative; width:100%; } .default-text[data-v-81faaf1a]{ height:100%; line-height:50px; text-align:center; } "; style.type='text/css'; if (style.styleSheet){ style.styleSheet.cssText = css; } else { style.appendChild(document.createTextNode(css)); } head.appendChild(style); } })();

	var component = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vue-pull-to-wrapper",style:({ height: _vm.wrapperHeight, transform: ("translate3d(0, " + (_vm.diff) + "px, 0)") })},[(_vm.topLoadMethod)?_c('div',{staticClass:"action-block",style:({ height: ((_vm.topBlockHeight) + "px"), marginTop: ((-_vm.topBlockHeight) + "px") })},[_vm._t("top-block",[_c('p',{staticClass:"default-text"},[(_vm.icon !== null)?_c('span',{class:_vm.icon}):_vm._e(),_vm._v(" "+_vm._s(_vm.topText))])],{state:_vm.state,stateText:_vm.topText,triggerDistance:_vm._topConfig.triggerDistance,diff:_vm.diff})],2):_vm._e(),_vm._v(" "),_c('div',{staticClass:"scroll-container"},[_vm._t("default")],2),_vm._v(" "),(_vm.bottomLoadMethod)?_c('div',{staticClass:"action-block",style:({ height: ((_vm.bottomBlockHeight) + "px"), marginBottom: ((-_vm.bottomBlockHeight) + "px") })},[_vm._t("bottom-block",[_c('p',{staticClass:"default-text"},[_vm._v(_vm._s(_vm.bottomText))])],{state:_vm.state,stateText:_vm.bottomText,triggerDistance:_vm._bottomConfig.triggerDistance,diff:_vm.diff})],2):_vm._e()])},staticRenderFns: [],_scopeId: 'data-v-81faaf1a',
		name: 'vue-pull-to',
		props: {
			distanceIndex: {
				type: Number,
				default: 2,
			},
			topBlockHeight: {
				type: Number,
				default: 50,
			},
			bottomBlockHeight: {
				type: Number,
				default: 50,
			},
			wrapperHeight: {
				type: String,
				default: '100%',
			},
			topLoadMethod: {
				type: Function,
			},
			bottomLoadMethod: {
				type: Function,
			},
			isThrottleTopPull: {
				type: Boolean,
				default: true,
			},
			isThrottleBottomPull: {
				type: Boolean,
				default: true,
			},
			isThrottleScroll: {
				type: Boolean,
				default: true,
			},
			isTopBounce: {
				type: Boolean,
				default: true,
			},
			isBottomBounce: {
				type: Boolean,
				default: true,
			},
			topConfig: {
				type: Object,
				default: function () {
					return {};
				},
			},
			bottomConfig: {
				type: Object,
				default: function () {
					return {};
				},
			},
		},
		data: function data() {
			return {
				scrollEl: null,
				startScrollTop: 0,
				startY: 0,
				startX: 0,
				currentY: 0,
				currentX: 0,
				pullDistance: 0,
				direction: 0,
				diff: 0,
				beforeDiff: 0,
				topText: '',
				bottomText: '',
				state: '',
				bottomReached: false,
				throttleEmitTopPull: null,
				throttleEmitBottomPull: null,
				throttleEmitScroll: null,
				throttleOnInfiniteScroll: null,
			};
		},
		computed: {
			_topConfig: function() {
				return Object.assign({}, TOP_DEFAULT_CONFIG, this.topConfig);
			},
			_bottomConfig: function() {
				return Object.assign({}, BOTTOM_DEFAULT_CONFIG, this.bottomConfig);
			},

			icon: function icon() {
				var config = this.direction === 'down'
					? this.topConfig
					: this.bottomConfig;

				return config.icons ? config.icons[ this.state ] : null;
			},
		},
		watch: {
			state: function state(val) {
				if (this.direction === 'down') {
					this.$emit('top-state-change', val);
				} else {
					this.$emit('bottom-state-change', val);
				}
			},
		},
		methods: {
			actionPull: function actionPull() {
				this.state = 'pull';
				this.direction === 'down'
					? this.topText = this._topConfig.pullText
					: this.bottomText = this._bottomConfig.pullText;
			},
			actionTrigger: function actionTrigger() {
				this.state = 'trigger';
				this.direction === 'down'
					? this.topText = this._topConfig.triggerText
					: this.bottomText = this._bottomConfig.triggerText;
			},
			actionLoading: function actionLoading() {
				this.state = 'loading';
				if (this.direction === 'down') {
					this.topText = this._topConfig.loadingText;
					/* eslint-disable no-useless-call */
					this.topLoadMethod.call(this, this.actionLoaded);
					this.scrollTo(this._topConfig.stayDistance);
				} else {
					this.bottomText = this._bottomConfig.loadingText;
					this.bottomLoadMethod.call(this, this.actionLoaded);
					this.scrollTo(-this._bottomConfig.stayDistance);
				}
			},
			actionLoaded: function actionLoaded(loadState) {
				var this$1 = this;
				if ( loadState === void 0 ) loadState = 'done';

				this.state = "loaded-" + loadState;
				var loadedStayTime;
				if (this.direction === 'down') {
					this.topText = loadState === 'done'
						? this._topConfig.doneText
						: this._topConfig.failText;
					loadedStayTime = this._topConfig.loadedStayTime;
				} else {
					this.bottomText = loadState === 'done'
						? this._bottomConfig.doneText
						: this._bottomConfig.failText;
					loadedStayTime = this._bottomConfig.loadedStayTime;
				}
				setTimeout(function () {
					this$1.scrollTo(0);

					// reset state
					setTimeout(function () {
						this$1.state = '';
					}, 200);
				}, loadedStayTime);
			},
			scrollTo: function scrollTo(y, duration) {
				var this$1 = this;
				if ( duration === void 0 ) duration = 200;

				this.$el.style.transition = duration + "ms";
				this.diff = y;
				setTimeout(function () {
					this$1.$el.style.transition = '';
				}, duration);
			},

			checkBottomReached: function checkBottomReached() {
				return this.scrollEl.scrollTop + this.scrollEl.offsetHeight + 1 >= this.scrollEl.scrollHeight;
			},

			handleTouchStart: function handleTouchStart(event) {
				this.startY = event.touches[ 0 ].clientY;
				this.startX = event.touches[ 0 ].clientX;
				this.beforeDiff = this.diff;
				this.startScrollTop = this.scrollEl.scrollTop;
				this.bottomReached = this.checkBottomReached();
			},

			handleTouchMove: function handleTouchMove(event) {
				this.currentY = event.touches[ 0 ].clientY;
				this.currentX = event.touches[ 0 ].clientX;
				this.pullDistance = (this.currentY - this.startY) / this.distanceIndex + this.beforeDiff;
				// judge pan gesture direction, if not vertival just return
				// make sure that if some components embeded can handle horizontal pan gesture in here
				if (Math.abs(this.currentY - this.startY) < Math.abs(this.currentX - this.startX)) { return; }
				this.direction = this.pullDistance > 0 ? 'down' : 'up';

				if (this.startScrollTop === 0 && this.direction === 'down' && this.isTopBounce) {
					event.preventDefault();
					event.stopPropagation();
					this.diff = this.pullDistance;
					this.isThrottleTopPull ? this.throttleEmitTopPull(this.diff) : this.$emit('top-pull', this.diff);

					if (typeof this.topLoadMethod !== 'function') { return; }

					if (this.pullDistance < this._topConfig.triggerDistance &&
						this.state !== 'pull' && this.state !== 'loading') {
						this.actionPull();
					} else if (this.pullDistance >= this._topConfig.triggerDistance &&
						this.state !== 'trigger' && this.state !== 'loading') {
						this.actionTrigger();
					}
				} else if (this.bottomReached && this.direction === 'up' && this.isBottomBounce) {
					event.preventDefault();
					event.stopPropagation();
					this.diff = this.pullDistance;
					this.isThrottleBottomPull ? this.throttleEmitBottomPull(this.diff) : this.$emit('bottom-pull', this.diff);

					if (typeof this.bottomLoadMethod !== 'function') { return; }

					if (Math.abs(this.pullDistance) < this._bottomConfig.triggerDistance &&
						this.state !== 'pull' && this.state !== 'loading') {
						this.actionPull();
					} else if (Math.abs(this.pullDistance) >= this._bottomConfig.triggerDistance &&
						this.state !== 'trigger' && this.state !== 'loading') {
						this.actionTrigger();
					}
				}
			},

			handleTouchEnd: function handleTouchEnd() {
				if (this.diff === 0) { return; }
				if (this.state === 'trigger') {
					this.actionLoading();
					return;
				}
				// pull cancel
				this.scrollTo(0);
			},

			handleScroll: function handleScroll(event) {
				this.isThrottleScroll ? this.throttleEmitScroll(event) : this.$emit('scroll', event);
				this.throttleOnInfiniteScroll();
			},

			onInfiniteScroll: function onInfiniteScroll() {
				if (this.checkBottomReached()) {
					this.$emit('infinite-scroll');
				}
			},

			throttleEmit: function throttleEmit(delay, mustRunDelay, eventName) {
				if ( mustRunDelay === void 0 ) mustRunDelay = 0;

				var throttleMethod = function() {
					var i = arguments.length, argsArray = Array(i);
					while ( i-- ) argsArray[i] = arguments[i];

					var args = [].concat( argsArray );
					args.unshift(eventName);
					this.$emit.apply(this, args);
				};

				return throttle(throttleMethod, delay, mustRunDelay);
			},

			bindEvents: function bindEvents() {
				this.scrollEl.addEventListener('touchstart', this.handleTouchStart);
				this.scrollEl.addEventListener('touchmove', this.handleTouchMove);
				this.scrollEl.addEventListener('touchend', this.handleTouchEnd);
				this.scrollEl.addEventListener('scroll', this.handleScroll);
			},

			createThrottleMethods: function createThrottleMethods() {
				this.throttleEmitTopPull = this.throttleEmit(200, 300, 'top-pull');
				this.throttleEmitBottomPull = this.throttleEmit(200, 300, 'bottom-pull');
				this.throttleEmitScroll = this.throttleEmit(100, 150, 'scroll');
				this.throttleOnInfiniteScroll = throttle(this.onInfiniteScroll, 400);
			},

			init: function init() {
				this.createThrottleMethods();
				this.scrollEl = this.$el.querySelector('.scroll-container');
				this.bindEvents();
			},
		},
		mounted: function mounted() {
			this.init();
		},
	};

	// Import vue component

	// Declare install function executed by Vue.use()
	function install(Vue) {
		if (install.installed) { return; }
		install.installed = true;
		Vue.component('MyComponent', component);
	}

	// Create module definition for Vue.use()
	var plugin = {
		install: install,
	};

	// Auto-install when vue is found (eg. in browser via <script> tag)
	var GlobalVue = null;
	if (typeof window !== 'undefined') {
		GlobalVue = window.Vue;
	} else if (typeof global !== 'undefined') {
		GlobalVue = global.Vue;
	}
	if (GlobalVue) {
		GlobalVue.use(plugin);
	}

	exports.install = install;
	exports.default = component;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
