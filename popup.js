// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Search the bookmarks when entering the search keyword.
//function addPopupLink(){
//  document.getElementById("new-window").onClicked.addListener(function() {
//    var w = 440;
//    var h = 220;
//    var left = (screen.width/2)-(w/2);
//    var top = (screen.height/2)-(h/2); 

//    chrome.windows.create({'url': 'redirect.html', 'type': 'popup', 'width': w, 'height': h, 'left': left, 'top': top} , function(window) {
//    });
//  };
//}


//function to initialize the page
//document.addEventListener('DOMContentLoaded', buildPresentation());

//function to present the page to the user (first run there will be no data - second run should be filled with queried data)
function buildPresentation (inUserArrayOfJSONObjs) {
  console.log("buildPresentation function START");
  

  if(inUserArrayOfJSONObjs != null){
    console.log("buildPresentation -> inUserArray LENGTH : " + inUserArrayOfJSONObjs.length );
    console.log("buildPresentation -> inUserArray TYPE : " + typeof(inUserArrayOfJSONObjs));
    console.log("buildPresentation -> inUserArray CONTENT : " + inUserArrayOfJSONObjs);
    
    var peopleDiv = document.getElementById("people");
    peopleDiv.innerHTML = '';
    var pageDiv = document.getElementById("page-container");
    if(inUserArrayOfJSONObjs[0]["id"] != "error"){
      for(i=0; i<inUserArrayOfJSONObjs.length; i++)
      {
        var person = {};
        console.log("buildPresentation -> index of returned results : " + i);
        console.log("buildPresentation -> person name value: " + inUserArrayOfJSONObjs[0]["id"]);//[i]["firstName"]);
        
        person.firstName=inUserArrayOfJSONObjs[i]["firstName"];
        person.lastName=inUserArrayOfJSONObjs[i]["lastName"];
        person.email=inUserArrayOfJSONObjs[i]["email"];
        person.department=inUserArrayOfJSONObjs[i]["department"];
        person.mailbox=inUserArrayOfJSONObjs[i]["mailbox"];
        person.personTitle = inUserArrayOfJSONObjs[i]["title"]; 
        person.phone=inUserArrayOfJSONObjs[i]["phone"];
        person.office=inUserArrayOfJSONObjs[i]["office"];

        var personDiv = document.createElement("div");
        var nastring = "N/A";
        
        //person_string2 = "<li>";
        person_string2 = "<p>";
        person_string2 += person.firstName + " " + person.lastName + "<br>";
        person_string2 += person.personTitle + "<br>";
        person_string2 += person.department + "<br>";
        if(person.phone == ""){
          person_string2 += "Phone number not listed<br>";      
        }else{
          person_string2+= person.phone +"<br>";
        }
        person_string2 += person.email + "<br>";
        if(person.mailbox == ""){
          person_string2 += "Mailbox not listed<br>";      
        }else{
          person_string2+= person.mailbox +"<br>";
        }
        person_string2 += person.office + "<br>";
        person_string2 += "</p>";
        //person_string2 += "</li>";

        person_string = "<div class=\"person\">";
        person_string += "<table>";
        person_string +=  "<tr><th colspan=\"2\">"+person.firstName + " " + person.lastName + "<\/th><\/tr>";    
        person_string +=  "<tr><td>Email<\/td><td>"+person.email+"<\/td><\/tr>"; 
        person_string +=  "<tr><td>Phone<\/td>"; 
        if(person.phone==null){
          person_string+="<td>"+nastring+"<\/td><\/tr>";      
        }else{
          person_string+="<td>"+person.phone+"<\/td><\/tr>";
        }
        person_string +=  "<tr><td>Title<\/td><td>"+person.personTitle+"<\/td><\/tr>";
        person_string +=  "<tr><td>Department<\/td><td>"+person.department+"<\/td><\/tr>";   
        person_string += "<table\/>";
        person_string += "<\/div>";
        
        peopleDiv.innerHTML += person_string2;

        }
      }
      else{
        peopleDiv.innerHTML += "No results found";
      }
  }else{
    console.log("buildPresentation -> no seach query present");
  }
}
// Traverse the bookmark tree, and print the folder and nodes.
function reqListener () {
  console.log("reqListener function START");
  
    console.log("reqListener -> responseText VALUE : "+this.responseText);
    var obj = this.responseText;
    objJSON = '';
    console.log("reqListener -> obj LENGTH : " + obj.length);
    console.log("reqListener -> obj TYPE : " + typeof(obj));
    console.log("reqListener -> obj CONTENT : " + obj);
  try{
    var objJSON = JSON.parse(obj);
  }catch(err){
    var peopleDiv = document.getElementById("people");
    //peopleDiv.innerHTML += "No results found";
    peopleDiv.innerHTML = "No results found";
    console.log("Error caught:" + err.message);
    return;

  }
  if(objJSON.count != 0){
    console.log("reqListener -> objJSON COUNT : " + objJSON.count);
    console.log("reqListener -> objJSON TYPE : " + typeof(objJSON));
    console.log("reqListener -> objJSON CONTENT : " + objJSON);
    console.log("reqListener -> objJSON TEST " + objJSON.items[1]);
    console.log("reqListener -> objJSON index COUNT \"ITEMS\" : " + objJSON["items"][0].length);
    console.log("reqListener -> objJSON index TYPE \"ITEMS\" : " + typeof(objJSON["items"][0]));
    console.log("reqListener -> objJSON index CONTENT \"ITEMS\" : " + objJSON["items"][0]);

    var final_obj = objJSON["items"];
    
    console.log("reqListener -> objJSON stringified : " + JSON.stringify(final_obj));
    console.log("reqListener -> objJSON length: " + final_obj.length);
    console.log("reqListener -> buildPresentation call...");

    buildPresentation(final_obj);
  }else{
    console.log("reqListener -> objJSON object return count is 0 " + objJSON["items"]);

  }
}
function fireQuery(inQuery){
  if(inQuery != null){

    console.log("fireQuery function START");
    console.log("fireQuery -> query LENGTH: " + inQuery.length);
    console.log("fireQuery -> query TYPE: " + typeof(inQuery));
    console.log("fireQuery -> query CONTENT: " + inQuery);

    var queryInput = inQuery;
    console.log('fireQuery -> URL query used :  https://my.champlain.edu/api/people/query/'+queryInput)

    var queryUrl='https://my.champlain.edu/api/people/query/'+queryInput;
    console.log("fireQuery -> queryUrl LENGTH: " + queryUrl.length);
    console.log("fireQuery -> queryUrl TYPE: " + typeof(queryUrl));
    console.log("fireQuery -> queryUrl CONTENT: " + queryUrl);


    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", queryUrl);
    oReq.send();
    
    console.log("Query response text "+oReq.responseText);
  }
  else{
    console.log("fireQuery -> NULL query value provided");
  }
}

function resize(){
  document.documentElement.style.height = "%100";
}
function buildZehPage() {
  setTimeout(resize, 200);

  /* add event listener to search box*/
  var elem = document.getElementById('search');
  elem.addEventListener('keypress', function(e){
    if (e.keyCode == 13) {
      var queryString = elem.value;
      console.log('buildZehPage -> Enter key pressed');
      console.log('buildZehPage -> innerHTML values passed to fireQuery -> ' + queryString);
            
      fireQuery(queryString);   
    }
  });
  var searchElem = document.getElementById('searchButton');
  searchElem.addEventListener("click", function(){
      var queryString = elem.value;
      console.log('buildZehPage -> Button pressed');
      console.log('buildZehPage -> innerHTML values passed to fireQuery -> ' + queryString);          
      fireQuery(queryString); 
    });
  /* place focus on search box - users can start typing right away! */
  document.getElementById("search").focus();
}

document.addEventListener('DOMContentLoaded', function () {
  buildZehPage();
});
