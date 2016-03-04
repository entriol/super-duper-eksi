"use strict";

// FEATURE: Auto-read-more.
var readMores = document.querySelectorAll("span.read-more-link-wrapper a");
Array.prototype.forEach.call(readMores, function(el, i){
  el.click();
});

// FEATURE: When adding it to trolls, note entry id to author profile.
function initTrollSequence(author, entryLink) {
  $.ajax({
    type: "GET",
    url: "https://eksisozluk.com/biri/"+ author,
    success: function(data){
        let toGetEntryId = entryLink.lastIndexOf("/");
        let getEntryId = entryLink.substring(toGetEntryId + 1);
        
        if ($(data).find('#user-note').first().val().indexOf("(bkz: #" + getEntryId + ")") >= 0){
            console.log("Notlarıma bakıyorum... Evet, böyle bir notu daha önce almışız.")
            return;
        }
        else {
        postTrollNote(
            author,
            $(data).find('#user-note-form input').first().val(),
            $(data).find('#user-note').first().text(),
            "troll entrysi (bkz: #" + getEntryId + ")"
        );
        }
    },
  });
}

function postTrollNote (author, who, oldNotes, trollEntry) {
  $.ajax({
    type: "POST",
    url: "https://eksisozluk.com/biri/" + author + "/note",
    data: { usernote: oldNotes + "\r\n"+trollEntry, who: who},
    success: function(res){console.log("Not sure if trolling or stupid.")},
    dataType: "text"
  });
}

Array.prototype.forEach.call(document.querySelectorAll("div.other ul.dropdown-menu li"), function(el, i){
  if (el.textContent != "engelle") return;
  else {
    el.addEventListener("click", function(){
        initTrollSequence(
            this.parentNode.parentNode.parentNode.querySelectorAll('.entry-author')[0].textContent,
            this.parentNode.parentNode.parentNode.querySelectorAll('.permalink')[0].href
            );
    }, true);  
  }
});