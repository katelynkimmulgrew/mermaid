
var btn = document.querySelector('#country-submit');
  btn.addEventListener('click', handleClick);
  
var answer = document.querySelector('#answer');
function handleClick() {
  
  var req = new XMLHttpRequest();
  var country = document.querySelector('#country').value;
  
  var url = 'http://localhost:3000/searchQuery?country='+country;
  
  req.open('GET',url,true);
  var answerInnerHTML = '';
  req.addEventListener('load', function() {
    if (req.status >= 200 && req.status <= 400) {
      var adaptations = JSON.parse(req.responseText);
      for(var i=0;i<adaptations.length;i++) {
      
        
        answerInnerHTML = answerInnerHTML + '<div>' + adaptations[i].name + ' ' + adaptations[i].year + ' <a href = "'+adaptations[i].link+'">Click Here</a>' + '</div> ';
        
        
      
      }

      answer.innerHTML = answerInnerHTML;

   } 
   
   
 });
  
 req.send(); 
}
