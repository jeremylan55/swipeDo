angular.module('starter.controllers', [])

.controller('TodoCtrl', function($scope, $timeout) {
	function itemClass() {
  		this.text_ = '';
  		this.done = false;
	}

	$scope.list = new Array();
	$(document).ready( function(){
		pull();
		console.log($scope.list);
	});
	// for( var i=0; i<15; i++) {
	// 	newTodo = new itemClass();
	// 	newTodo.text_ = 'post'+i;
	// 	newTodo.done = false;
	// 	$scope.list.push(newTodo);
	// 	synchronize();
	// }

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
	  console.log($scope.list);
	}



  

  // $('#hamburgerButton').click( function() {
  // 	$('.hamburgerMenu-container').addClass('active');
  // 	$('.overlay').removeClass('hide').addClass('active');
  // });

  // $('.overlay').on('tap', function(){
  	// console.log('hey')
  // 	$scope.hideMenu();
  // });

	// $scope.setCurrentList = function() {
	//   $scope.list[$scope.currentList].list
	// }

	$scope.check = function(index) {
		index = parseInt(index);
		$('#check-'+index).toggleClass('true');
		var newTodo = $scope.list[index];
		if($('#check-'+index).hasClass('true'))
			newTodo.done = true;
		else
			newTodo.done = false;
		$scope.list.splice(index,1,newTodo);
		synchronize();
	}
	function removeFromList(index) {
		$scope.list.splice(index,1);
		synchronize();
	}

	$scope.onItemDrag = function() {
		console.log(event.gesture.deltaX);
		var id = event.target.id.split('-');
		var item = $('#'+event.target.id);
		if(event.gesture.deltaX < 20 && event.gesture.deltaX > -20)
			item.css('left','0px');
		else if(id[0] == 'white') {
			console.log('white');
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
			console.log(index)
			
			var left = item.attr('style');
			left = left.split(' ');
			left = left[1].split('px;');
			left = parseFloat(left[0]);

			if(left >= -175) {
				if(left >= 86) {
					console.log('check:'+index)
					$scope.check(index);
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

	// $scope.showAddMenu = function() {
	// 	$('.addMenu>input').val('');
	// 	$('.addMenu').css('top', '0px');
	// 	$('.addMenu-container').css('top', '0px');
	// 	$('.addMenu-container').css('visibility', 'visible').addClass('animated slideInUp short');
	// 	$('.overlay').addClass('active');
	// 	$('#footer1').removeClass('animated slideInUp short');
	// 	$('#footer1').addClass('animated slideOutDown short');
	// 	$('#footer2').removeClass('animated slideOutDown short');
	// 	$('#footer2').css('visibility', 'visible').addClass('animated slideInUp short');
	// }

	// $scope.onAddMenuDrag = function() {
	// 	var top = event.gesture.deltaY;
	// 	if(top >= 0){}
	// 	else {}
	// 	$('.addMenu-container').css('top', top+'px');
	// }

	// $scope.releaseAddMenu = function() {
	// 	var top = $('.addMenu-container').attr('style').split(' ');
	// 	top = parseFloat(top[1].split('px;'));
	// 	var vh = $(window).height();
	// 	vh = (vh/2)-150;
	// 	if(top < vh) {
	// 		$('.addMenu-container').animate({top: '0px'});
	// 	}
	// 	else {
	// 		$('.addMenu-container').animate({top: '130%'},400);
	// 		$timeout(function(){
	// 			$scope.hideMenu();
	// 			$scope.saveNewTodo();
	// 		},400);
	// 	}
	// }

	// $scope.hideMenu = function() {
	// 	$('.addMenu').css('top', '0px');
	// 	$('.addMenu-container').css('top', '0px');
	// 	$('.addMenu-container').css('visibility', 'hidden').removeClass('animated slideInUp short');
	// 	$('.overlay').removeClass('active');
	// 	$('#footer1').removeClass('animated slideOutDown short');
	// 	$('#footer1').addClass('animated slideInUp short');
	// 	$('#footer2').css('visibility', 'hidden').removeClass('animated slideInUp short')
	// 	$('#footer2').addClass('animated slideOutDown short');
	// }
	$('#footer1>input').focus( function(){
		$('#footer1>input').attr('placeholder','');
	});
	$('#footer1>input').blur( function(){
		$('#footer1>input').attr('placeholder','New to do');
	});

	$scope.saveNewTodo = function() {
		var text = $('#footer1>input').val();
		if(text !='') {
			newTodo = new itemClass();
			newTodo.text_ = text;
			console.log(newTodo);
			$scope.list.push(newTodo);
			$('#footer1>input').val('');
			synchronize();
		}
	}
// var deltaY =[];
// ==============================PINNING==============================//

// $('.scroll').attrchange({
// 	trackValues: true, /* Default to false, if set to true the event object is 
// 				updated with old and new value.*/
// 	callback: function (event) { 
// 		deltaY = event.newValue.split(', ');
// 		deltaY = deltaY[1].split('px');
// 		deltaY = deltaY[0]*-1;
// 		var length = all[$scope.currentList].list.length

// 		for(var i=0; i<length; i++) {
// 			if(deltaY >= i*81) {
// 				$('#item'+i).css('top',(deltaY-(81*i))+'px');
// 			}
// 		}
// 	    //event    	          - event object
// 	    //event.attributeName - Name of the attribute modified
// 	    //event.oldValue      - Previous value of the modified attribute
// 	    //event.newValue      - New value of the modified attribute
// 	    //Triggered when the selected elements attribute is added/updated/removed
// 	}        
// });



// ==========================================================================================//
//         								CONTROLLER ENDS
// ==========================================================================================//
});

