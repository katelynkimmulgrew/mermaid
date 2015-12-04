$(document).ready(function() {
	//check if this works
	$('#link').on('input', function() {
					var input=$(this);
					if (input.val().substring(0,4)=='www.'){input.val('http://www.'+input.val().substring(4));}
					var re = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
					var is_url=re.test(input.val());
					if(is_url){}
					else{alert("Invalid Link!");}
				});

});
