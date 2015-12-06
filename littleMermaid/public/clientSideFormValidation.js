$(document).ready(function() {
	$('#link').on('input', function() {
					var input=$(this);
					var re = /^((https|http)?:\/\/)/;
					var is_url=re.test(input.val());
					div = document.querySelector('#aboutLink');
					if(is_url){
						div.innerText="Valid Link";
					}
					else{
						div.innerText="Invalid Link!";
						//alert("Invalid Link!");
					}
				});

});
