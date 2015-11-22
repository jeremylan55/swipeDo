angular.module('starter.controllers', ['ti-segmented-control'])

.controller('TodoCtrl', function($scope, $timeout) {
//===========================CANVAS======================================== //
var lc = LC.init(
	document.getElementsByClassName('literally')[0],
	{
		imageURLPrefix: '/canvas',
    	tools: [LC.tools.Pencil, LC.tools.Eraser]
	}
);
//============================CANVAS======================================= //

	function itemClass() {
		this.id =0;
  		this.text_ = '';
  		this.done = false;
  		this.drawing = '';
	}
	$scope.keyboardHeight = 216;
	var canvasOn = false;
	var colors = ['#000','#20E286', '#FF855A', '#2382EA'];
	var currentColor = 0;
window.addEventListener('native.keyboardshow', keyboardShowHandler);
window.addEventListener('native.keyboardhide', keyboardHideHandler);

function keyboardShowHandler(e){
	if(!canvasOn){
		$scope.keyboardHeight = e.keyboardHeight;
		$('#footer1').animate({marginBottom: e.keyboardHeight + 'px'}, 300, 'swing');
	}
}
function keyboardHideHandler(e){
	$('#footer1').animate({marginBottom: ''}, 260, 'swing');
}


	$scope.seg = '';
	$scope.list = new Array();
	$(document).ready( function(){
		pull();
	});

	function saveAll() {
	  window.localStorage['list'] = JSON.stringify($scope.list);
	}

	function pull() {
	  var temp = JSON.parse(window.localStorage['list'] || false);
	  if(temp == false)
	  	saveAll();
	  else
	  	$scope.list = temp;
	}


	function synchronize() {
	  saveAll();
	  pull();
	}

	$scope.check = function() {
		var index = event.target.id;
		index = index.split('check-');
		index = index[1];
		var temp = $scope.list[index];
		if(temp.done)
			temp.done = false;
		else
			temp.done = true;
		$scope.list.splice(index,1,temp);
		synchronize();
	}

	$scope.checkSlide = function(index) {
		var temp = $scope.list[index];
		if(temp.done)
			temp.done = false;
		else
			temp.done = true;
		$scope.list.splice(index,1,temp);
		synchronize();
	}
	function removeFromList(index) {
		$scope.list.splice(index,1);
		for( var i=index; i<$scope.list.length; i++) {
			var temp = $scope.list[i];
			temp.id = i;
			$scope.list[i] = temp;
		}
		synchronize();
	}


	$scope.onItemDrag = function() {
		var id = event.target.id.split('-');
		var item = $('#'+event.target.id);
		if(event.gesture.deltaX < 20 && event.gesture.deltaX > -20)
			item.css('left','0px');
		else if(id[0] == 'white') {
			if(event.gesture.deltaX < 100 && event.gesture.deltaX >= 0) {
				var fraction = event.gesture.deltaX/86;
				item.css('left', event.gesture.deltaX+'px');
				$('.prompt>.checkIt').css('opacity', fraction.toString());
			}
				else if(event.gesture.deltaX < 0 ){
					item.css('left', event.gesture.deltaX+'px');
					var fraction = event.gesture.deltaX*-1/175;
					$('.prompt>.checkIt').css('opacity', '0.0');
					$('.prompt>.deleteIt').css('opacity', fraction.toString());
				}
		}
			
	}
	$scope.releaseItem = function() {
		var id = event.target.id.split('-');
		if( id[0] == 'white') {
			var item = $('#'+event.target.id);
			var index = event.target.id;
			index = index.split('white-');
			index = parseInt(index[1]);
			
			var left = item.attr('style');
			left = left.split(' ');
			left = left[1].split('px;');
			left = parseFloat(left[0]);

			if(left >= -175) {
				if(left >= 76) {
					$scope.checkSlide(index);
				}
				item.animate({left: '0px'});
			}
				else if(left < -175) {
					item.animate({left: '-100%'},300);
					setTimeout(function(){
						$('#item-'+index).slideUp(100);
						setTimeout( function(){
							removeFromList(index);
							$timeout(function(){
								$('#item-'+index).removeAttr('style');	
							},300);
							$('#white-'+index).attr('style','left: 0px;');
						},100);
					},300);
				}
		}
	}


	$('#footer1>input').focus( function(){
		$('#footer1>input').attr('placeholder','');
	});
	$('#footer1>input').blur( function(){
		$('#footer1>input').attr('placeholder','New to do');
	});

	$scope.saveNewTodo = function() {
		$('ion-content').removeClass('blur');
		$('ion-header-bar').removeClass('blur');
		$('#drawButton').removeClass('filled');
		$('#footer1').animate({height: '50px'}, 200, 'swing');
		$('#footer1').css('padding-top', '5px');
		$('#footer1>input').css('color', '#000');
		$('#myCanvas').css('visibility', 'hidden');
		$('#myCanvas>button').css('visibility', 'hidden');
		$('#footer1').removeClass('dark');
		canvasOn = false;
		var text = $('#footer1>input').val();
		if(text !='') {
			newTodo = new itemClass();
			newTodo.text_ = text;
			newTodo.drawing = lc.getSVGString();
			lc.clear();
			newTodo.id = $scope.list.length;
			$scope.list.push(newTodo);
			$timeout( function(){
				$('#item-'+newTodo.id).addClass('animated bounceIn');
				setTimeout( function(){
					$('#item-'+newTodo.id).removeClass()
				},600);
			},10);
			$('#footer1>input').val('');
			synchronize();
		}
	}

	$scope.segment = function(id) {
		if(id == 3)
			$scope.seg = true;
		else if(id == 2)
			$scope.seg = false;
		else {
			$scope.seg = '';
		}
	}


	// $('#footer1>input').keyup(function(event){
	// 	if($('#footer1>input').val() == '')
	// 		$('#footer1>#drawButton').css('visibility','hidden');
	// 	else
	// 		$('#footer1>#drawButton').css('visibility','visible');
	// });

	$scope.showCanvas = function() {
		if(!canvasOn){
			$('ion-content').addClass('blur');
			$('ion-header-bar').addClass('blur');
			$('#footer1').css('height','100vh');
			$('#footer1').css('padding-top', '20px');
			$('#footer1').addClass('dark');
			$('#footer1>input').css('color', '#fff');
			$('#drawButton').addClass('filled');
			$('#myCanvas').css('visibility', 'visible');
			$('#myCanvas>button').css('visibility', 'visible');
			canvasOn = true;
		}
		else {
			$('ion-content').removeClass('blur');
			$('ion-header-bar').removeClass('blur');
			$('#drawButton').removeClass('filled');
			$('#footer1').css('padding-top', '5px');
			$('#footer1').css('height', '50px');
			$('#footer1>input').css('color', '#000');
			$('#footer1').removeClass('dark');
			$('#myCanvas').css('visibility', 'hidden');
			$('#myCanvas>button').css('visibility', 'hidden');
			canvasOn = false;
		}
	}

	$scope.switchColor = function() {
		currentColor = (currentColor+1)%4
		lc.setColor('primary', colors[currentColor]);
		$('#myCanvas>button').css('background-color', colors[currentColor])
	}

});

















