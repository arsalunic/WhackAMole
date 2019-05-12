//This code performs the game mechanics of the whack-a-mole game.
//Responding to user interactions, and timer events. This game
//dyanmically requests json-encoded information from a server 
//to display "moles" on the game board. 
////mole structure:
/*{
	x:value from left,
	y:value from top,
	life:duration to show gopher,
	next:time til next gopher
}*/
//Mole objects are generated at random by the server at request time.
//successful clicks are reported back to the server to adjust a difficulty parameter.
//The file has been revamped to use jquery!
//Author: Andrew Runka

var score = 0;

$(document).ready(function(){
	
	//initialize start button
	$('startButton').click(function(){
		$(this).hide();
		$('#gameBoard').show();
		getMole();
	});	
});

function getMole(){
	$.get("/mole",function(mole){
		console.log("got: ", mole);
		var moleDiv = $("<div class='mole'></div>");
		moleDiv.css({left:mole.x+"px", top:mole.y+"px"});
		moleDiv.click(whack);
		
		//delayed recursive call for next mole
		window.setTimeout(mole.next);
		
		
		$("#gameBoard").append(moleDiv);
		moleDiv.animate({
			width:"50px",  //start at 0
			height:"50px",
			top:"-=25px",  //make it look like its growing from the center
			left:"-=25px"
		},500,function(){window.setTimeout(destroyMole,mole.life,moleDiv);});
			//start the life counter after appearance animation completes
		
	},"json");
}

function whack(ev){
	var clickedMole = $(this);
	clickedMole.stop(); //stop any active animations
	clickedMole.off('click'); //disable further clicks
	clickedMole.css("backgroundColor","red");
	clickedMole.fadeOut(500,function(){
		console.log($(this)); 
		clickedMole.remove();
	});
	
	score+=1;
		
	
	$.ajax({
		method:"POST",
		url:"/Mole",
		data: JSON.stringify({"score":score}),
		contentType:'application/json',
		success: $.noop //no-operation, put here for place holder
	});
}

function destroyMole(moleDiv){
	
	moleDiv.animate({
	  width:"0px",
	  height:"0px",
	  top:"+=25px",
	  left:"+=25px"
	},500,function(){	moleDiv.remove();});
}