var req = new XMLHttpRequest();
var url = 'http://localhost:3000/searchQuery';
req.open('GET',url,true);
var btn = document.querySelector('#country-submit');
  btn.addEventListener('click', handleClick);
  req.send();
var answer = document.querySelector('#answer');
function handleClick() {
	var answerInnerHTML = '';
	var country = document.querySelector('#country').value;
	if (req.status >= 200 && req.status <= 400) {
    var adaptations = JSON.parse(req.responseText);
    for(var i=0;i<adaptations.length;i++) {
    	if(adaptations[i].country==country) {
    		
    		answerInnerHTML = answerInnerHTML + '<div>' + adaptations[i].name + ' ' + adaptations[i].year + ' <a href = "'+adaptations[i].link+'">Click Here</a>' + '</div> ';
    		
    		
    	}
    }

    answer.innerHTML = answerInnerHTML;
   } 
	
}
