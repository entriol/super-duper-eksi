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
        }
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

// FEATURE: All author entries about title.
var title = document.getElementById("title") ? document.getElementById("title").textContent.trim() : null;

Array.prototype.forEach.call(document.querySelectorAll("div.info .entry-author"), function(el, i){
    el.insertAdjacentHTML('afterend', '<a class="entry-author" title="Yazarın bu başlıktaki düşünceleri" href="https://eksisozluk.com/?q=' + title + '/@' + el.textContent +'">[^]</a>')
});

// FEATURE: If title is about a dictionary writer, then add link to profile.
$.ajax({
    type: "GET",
    url: "https://eksisozluk.com/biri/"+ title,
    complete: function(xhr, textStatus) {
        if (xhr.status === 200 && document.getElementById("topic")) {
            document.getElementById('aside').insertAdjacentHTML('beforebegin', '<h2><a href="https://eksisozluk.com/biri/'+title+'">yazar profili</a></h2>');
        }
    }
});


// FEATURE: Messaging tools.
// Credit - fn.setCaretToPos: http://stackoverflow.com/questions/499126/jquery-set-cursor-position-in-text-area
function setSelectionRange(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
    }
    else if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionStart);
        range.select();
    }
}

function setCaretToPos (input, pos) {
    setSelectionRange(input, pos, pos);
}

// Credit - fn.wrapText: http://stackoverflow.com/questions/32414659/wrap-only-selected-text-with-a-html-tag-using-javascript
function wrapText(openTag, closeTag) {
    var textArea = document.querySelectorAll('textarea[name=Message]')[0];    
    var len = textArea.value.length;
    var start = textArea.selectionStart;
    var end = textArea.selectionEnd;
    var selectedText = textArea.value.substring(start, end);
    
    var replacement = openTag + selectedText + closeTag;
    textArea.value = textArea.value.substring(0, start) + replacement + textArea.value.substring(end, len);
    
    setCaretToPos(textArea, start + replacement.length);
}

if (window.location.pathname.indexOf('/mesaj/') > -1) {
    var editTools = [
        '<button type="button" title="bkz" tabindex="-1">(bkz: hede)</button>',
        '<button type="button" title="hede" tabindex="-1">hede</button>',
        '<button type="button" title="yildiz" tabindex="-1">*</button>',
        '<button type="button" title="spoiler" tabindex="-1">-spoiler-</button>',
        '<button type="button" title="http" tabindex="-1">http://</button>'
    ]
    
    document.getElementById('cevapla').insertAdjacentHTML('afterend', editTools.join(" "));
            
    $('div#message-thread button').on('click', function(){
        switch (this.getAttribute('title')) {
            case 'bkz':
                wrapText('(bkz: ', ')');
                break;
            case 'hede':
                wrapText('`', '`');
                break;
            case 'yildiz':
                wrapText('`:', '`');
                break;
            case 'spoiler':
                wrapText('\n--- `spoiler` ---\n', '\n--- `spoiler` ---\n');
                break;
            case 'http':
                var textArea = document.querySelectorAll('textarea[name=Message]')[0];
                var start = textArea.selectionStart;
                var end = textArea.selectionEnd;
                
                var link = prompt("Verilecek bağlantı adresi", "http://");
                
                if (start == end) {
                    var linkTitle = prompt("Verilecek bağlantının adını giriniz", "");
                    if (link != null && linkTitle != null) wrapText('['+link+ ' ', linkTitle + ']');                    
                }
                else {
                    if (link != null) wrapText('['+link + ' ', ']');
                }
                break;
        }
    });
}


    
    