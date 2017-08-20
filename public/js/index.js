'use strict';

window.onload = function(){
// 轮播效果
banner();
// 搜索区域颜色变化
search();
// 倒计时
daojishi();
};

// 移动端轮播图
function banner(){
	// 1.自动轮播滚动起来(定时器+过渡transition  + 位移transform: translate)
	
	// 1.先获取  .jd_banner
	var banner = document.querySelector(".jd_banner");
	//console.log(banner);
	// 2.再获取banner的可见宽度
	var w = banner.offsetWidth;console.log(w);
	// 3.再获banner下的第一个ul，保存在imageBox
	var imageBox = banner.children[0];
	// 4.在获取banner下的第二个ul，保存在 pointBox
	var pointBox = banner.children[1];
	// 5.在获取pointBox 下所有的 li，保存在points中
	var points = pointBox.querySelectorAll("li");console.log(imageBox);

	// 添加过渡方法
	var addTransition = function(){
		imageBox.style.transition = "all .8s";
		imageBox.style.webkitTransition = "all .8s"; //兼容写法;
	};
	// 添加删除过渡方法
	var remTransition = function(){
		imageBox.style.transition = "none";
		imageBox.style.webkitTransition = "none";
	};
	// 添加 X轴方向位移 方法
	var setTranslate = function(translateX){
		imageBox.style.transform = "translateX("+ translateX +"px)"
		imageBox.style.webkitTransform = "translateX("+ translateX +"px)"
	}
	// 添加定时器 自动滚动起来
	var index = 1; //记录滚动次数	

	var timer = setInterval(function(){
		// 滚动次数+1
		index++;
		// 调用之前的 过渡 和位移的方法;
		// 过渡
		addTransition();
		// 位移
		setTranslate(-index*w)

	},3000);
	// 绑定一个过渡结束事件
	itcast.transitionEnd(imageBox,function(){
		if(index>=9){
			index=1;
			// 删除过渡
			remTransition();
			// 继续调用位移
			setTranslate(-index*w)
		}else if(index<=0){
			index = 8;
			// 删除过渡
			remTransition();
			// 调用位移
			setTranslate(-index*w);
		};
		// index 1-8
		// index 0-7
		setPoint();
	});

	//点随之滚动起来(改变当前元素li)
	function setPoint(){
		// 所有点的样式清掉
		for(var i=0;i<points.length;i++){
			points[i].className = "";
		};
	points[index-1].className = "now";	
	};

	// 图片滑动事件
	var startX = 0; //当前触摸时 X轴的坐标值;
	var moveX = 0;  //手移动时 X轴 实时 坐标
	var distanceX =0; //  moveX - startX  滑动距离;
	var ismove = false;// 表示是否正在移动;一开始没有移动

	imageBox.addEventListener("touchstart",function(e){
		// 关掉定时器
		clearInterval(timer);
		// 获得当前触摸X轴坐标
		startX = e.touches[0].clientX;//console.log(startX);
	});

	imageBox.addEventListener("touchmove",function(e){
		// 设置 ismouse = ture;
		ismove = true;
		// 移动时 x轴的实时坐标
		moveX = e.touches[0].clientX;//console.log(moveX);
		// 滑动距离
		distanceX = moveX - startX; //右滑动为正，左滑动为负;
		// 要去计算在滑动时图片需要滚动实际距离
		var currX = -index*w + distanceX;

		// 删除过渡事件
		remTransition();
		
		// 调用位移事件
		setTranslate(currX);

	});

	imageBox.addEventListener("touchend",function(e){
		// Math.abs();获取绝对值;
		// 当滑动的距离超过1/3的屏幕宽度，就换到下一张或上一张；
		if(ismove && Math.abs(distanceX) > w/3){
			// 如果移动的距离是正，向右滑动
			if(distanceX>0){
				index--   //向右滑动  上一张
			}else{
				index++   //向左滑动  下一张；
			}
			addTransition();
			setTranslate(-index*w);
		}else{
			//滑动距离小于1/3，图片被吸附回去，定位回去
			addTransition();
			setTranslate(-index*w);
		}

		// 重置初始变量
		startX = 0;
		moveX =0;
		distanceX = 0;
		ismove = false;

		// 重新启动是定时器
		// clearInterval(timer);
		timer = setInterval(function(){
			index++;
			addTransition();
			setTranslate(-index*w);

		},3000)

	});
	
};

// 搜索区域颜色变化
function search(){
	// 1.透明度随着页面滚动逐渐加深
	// 2.当滚动的距离超过轮播图的高度，透明度保持不变为1
	
	// 1.获取.jd_header_box 保存在searchBox
	var searchBox = document.querySelector(".jd_header_box");
	//2.获取.jd_banner 的可见高度 
	var h = document.querySelector(".jd_banner").offsetHeight;
	console.log(h);
	// 监听 window 的滚动事件 
	window.onscroll = function(){
		var top = document.body.scrollTop;//console.log(top);
		// 设置透明底
		var opacity = 0;
		// 如果滚动距离top<h
		if(top<h){
			// 透明度是随着页面的滚动而增加的
			opacity = top/h;
		}else{
			// 当超过 轮播时，透明度为1;
			opacity = .9
		};

		searchBox.style.background = "rgba(201,21,35,"+opacity+")";
	};
};

// 倒计时秒杀
function daojishi(){
	var alltime = (24*60*60)-1;//console.log(alltime);

	var sk_time = document.querySelector(".sk_time");//console.log(sk_time.children[0]);

	function Time(){
		var h1 = Math.floor((alltime/60/60%24)/10);//console.log(h1);
		var h2 = Math.floor((alltime/60/60%24)%10);//console.log(h2);

		var m1 = Math.floor((alltime/60%60)/10);//console.log(m1);
		var m2 = Math.floor((alltime/60%60)%10);//console.log(m2);

		var s1 = Math.floor((alltime%60)/10);//console.log(s1);
		var s2 = Math.floor((alltime%60)%10);//console.log(s2);
		
		if(alltime==0){
			clearInterval(t);	
			return false;
		}else{
			alltime--;//console.log(alltime);

			sk_time.children[0].innerHTML = h1;
			sk_time.children[1].innerHTML = h2;

			sk_time.children[3].innerHTML = m1;
			sk_time.children[4].innerHTML = m2;

			sk_time.children[6].innerHTML = s1;
			sk_time.children[7].innerHTML = s2;

		};
	};
	Time();	
	var t = setInterval(Time,1000);	

};

// function daojishi(){

// 	var endtime = new Date("2017/6/23 17:30:00").getTime();//console.log(endtime);
// 	var nowtime = new Date().getTime();//console.log(nowtime);

// 	var alltime = (endtime - nowtime)/1000;//console.log(alltime);

// 	var sk_time = document.querySelector(".sk_time");//console.log(sk_time.children[0]);

// 	function Time(){
// 		var h1 = Math.floor((alltime/60/60%24)/10);//console.log(h1);
// 		var h2 = Math.floor((alltime/60/60%24)%10);//console.log(h2);

// 		var m1 = Math.floor((alltime/60%60)/10);//console.log(m1);
// 		var m2 = Math.floor((alltime/60%60)%10);//console.log(m2);

// 		var s1 = Math.floor((alltime%60)/10);//console.log(s1);
// 		var s2 = Math.floor((alltime%60)%10);//console.log(s2);
		
// 		if(alltime==0){
// 			clearInterval(t);	
// 		}else{
// 			alltime--;//console.log(alltime);

// 			sk_time.children[0].innerHTML = h1;
// 			sk_time.children[1].innerHTML = h2;

// 			sk_time.children[3].innerHTML = m1;
// 			sk_time.children[4].innerHTML = m2;

// 			sk_time.children[6].innerHTML = s1;
// 			sk_time.children[7].innerHTML = s2;

// 		};


// 	};
// 	Time();	
// 	var t = setInterval(Time,1000);	

// };

//底部点击切换效果

