/**
 * Created by Administrator on 2015/8/9.
 */
/*入口*/
var pageApp = angular.module('pageApp', []);

pageApp.run(function($templateCache) { //缓存模板
	$templateCache.put("./template/hello.html", "<div>AEMC:angular是一个MVVM的MVC框架</div>");
});


pageApp.directive("hello", function($templateCache) {
	return {
		restrict: "AEMC",/*restrict匹配模式 A：属性，默认值。E：元素。M：注释。C：class名。*/
		template: $templateCache.get("./template/hello.html"),//缓存模板
		//templateUrl: "./template/hello.html",
		replace: true
	}
})

pageApp.directive("trans",function(){//不替换内容
	return {
		restrict:"AE",
		template:"<div>这是新增的内容<div ng-transclude></div></div>",
		transclude:true
	}
})

pageApp.controller('loadDataCtrl', ['$scope', function($scope){
	$scope.loadData=function(){
		console.log("数据加载中。。。。。。")
	}
}])
 
pageApp.controller('waitDataCtrl', ['$scope', function($scope){
	$scope.waitData=function(){
		console.log("正在加载数据。。。。。。")
	}
}])

pageApp.directive("load",function(){
	return {
		restrict:"AE",
		link:function(scope,element,attrs){
			element.on("mouseenter",function(){
				//scope.loadData();
				scope.$apply(attrs.toload)
			})
		}
	}
})

pageApp.directive("inactive",function(){
	return {
		scope:{},
		restrict:"AE",
		controller:function($scope){
			$scope.ablitities=[];
			this.addStrength=function(){
				$scope.ablitities.push("strength");
			}
			this.addSpeed=function(){
				$scope.ablitities.push("speed");
			}
			this.addLight=function(){
				$scope.ablitities.push("light");
			}
		},
		link:function(scope,element,attrs){
			element.addClass('btn btn-primary');
			element.on("mouseenter",function(){
				console.log(scope.ablitities);
			})
		}
	}
})
pageApp.directive("strength",function(){
	return {
		require:"^inactive",
		link:function(scope,element,attrs,s){
			s.addStrength()
		}
	}
})
pageApp.directive("speed",function(){
	return {
		require:"^inactive",
		link:function(scope,element,attrs,s){
			s.addSpeed();
		}
	}
})
pageApp.directive("light",function(){
	return {
		require:"^inactive",
		link:function(scope,element,attrs,s){
			s.addLight();
		}
	}
})

pageApp.directive("greet",function(){
	return {
		scope:{},
		restrict:"AE",
		template:"<div><input type='text' class='form-control' ng-model='userName' /><span>{{userName}}</span></div>",
		replace:true
	}
})

/*双向 @ 绑定策略*/

pageApp.controller('fruitCtrl', ['$scope', function(s){
	s.favorite="单向：我最喜欢吃的水果是：苹果";
}])
pageApp.directive("fruit",function(){
	return {
		restrict:"AE",
		scope:{
			favorite:"@"
		},
		template:'<div>{{favorite}}</div>'
		 /*link:function(scope,element,attrs){
		 	scope.favorite=attrs.favorite
		 }*/
	}
})


/*等于号 = 绑定策略*/

pageApp.controller("enjoyCtrl",["$scope",function($scope){
	$scope.enjoySome="美剧"
}])

pageApp.directive("enjoy",function(){
	return {
		restrict:"AE",
		scope:{
			favorite:"="
		},
		template:'<input type="text" class="form-control" ng-model="favorite" />'
	}
})

/*连字符 & 绑定策略*/

pageApp.controller('callCtrl', ['$scope', function($scope){
	$scope.callName=function(name){
		console.log("你好："+name)
	}
}])
pageApp.directive("calling",function(){
	return {
		restrict:"AE",
		scope:{
			call:"&"
		},
		template:'<input type="text" class="form-control" ng-model="userName">\
		<button type="button" class="btn btn-primary" ng-click="call({name:userName})">确认</button>'
	}
})

/*表单验证*/
pageApp.controller("formCtrl",['$scope',function ($scope) {
	$scope.user={
		userName:"小明",
		password:""
	}
	$scope.save=function () {
		console.log("提交表单")
	}
}])

/*是否替换原有内容*/
pageApp.directive("old",function(){
	return {
		restrict:"AEMC",
		replace:true,//设置为false如果是以E模式渲染的还能看到原来的标签，这个标签浏览器是无法识别的,设置为true会将模板中的内容替换标签
		template:'<div class="row">替换后的内容</div>',
	}
})

/*加载远程数据*/
pageApp.controller('loadRemoteData', ['$scope','$http','$timeout',function($scope,$http,$timeout){
	$scope.display=true;
	$scope.loadRemote=function(){
		$scope.display=true;
		$timeout(function(){
			$http({
				method:"POST",
				url:"data/data.json"
			}).success(function(data, status, headers, config){
				$scope.display=false;
				$scope.books=data;
			}).error(function(data, status, headers, config){

			})	
		},300);
	}
		
}])

/*数据加载服务*/
pageApp.factory('getBookList', ['$http', function($http){
	var requestBooks=function(keywords){
		return $http({
			method:"POST",
			url:"data/data.json"
		})
	}
	return {
		books:function(keywords){
			return requestBooks(keywords);
		}
	}
}])


pageApp.controller('getBookListCtrl', ['$scope','$timeout','getBookList', function($scope,$timeout,getBookList){
	var timeout;
	$scope.$watch('keywords', function(newValue, oldValue, scope) {
		if(newValue){
			if(timeout){//清除定时器
				$timeout.cancel(timeout);
			}
			timeout=$timeout(function(){
				getBookList.books(newValue).success(function(data){
					$scope.books=data;
				})
			},350)
		}
	}, true);
}])