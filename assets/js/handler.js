//Function for DarkMode
function dkMode() {


    var elem2 = document.getElementsByClassName('darkBg');


    for (var i = 0; i < elem2.length; i++) {
        elem2[i].classList.toggle("bg-light")
        elem2[i].classList.toggle("text-dark")
    }

    var elem = document.getElementById('bodyMain');


    if (elem.classList[0] == "bodyDark" || elem.classList[1] == "bodyDark") {
        elem.classList.remove('bodyDark')
        elem.classList.toggle('bodyLight');
    } else {
        elem.classList.remove('bodyLight');
        elem.classList.toggle('bodyDark')
    }
}


//Function to View SideBar
function sidebarView() {
    document.getElementById('teamDetails').classList.toggle('show');
    document.getElementById('teamDetails').classList.toggle('openBar');
    console.log(document.getElementById('teamDetails').classList)


}


//Function to Read Code File
document.getElementById('inputfile').addEventListener('change', function () {

    console.log("Done")
    var fr = new FileReader();
    fr.onload = function () {
        document.getElementById('codeInput').textContent = fr.result;
        console.log(fr.result)
    }

    fr.readAsText(this.files[0]);

    this.files=null

})


//Function to send Message on Enter press
document.getElementById('messageInput').addEventListener('keypress', function (e) {


    console.log(e.target.value)
    socket.emit('checkEmotion',{
        text:messageInput.value
    })
    

})



//Function to load Saved Messages on Login
function loadMessages(){
    setTimeout(()=>{

        let messages=JSON.parse(localStorage.getItem(`${userName.innerHTML}@${roomName.innerHTML}`))
        console.log(messages)
        messages.map(element => {
            return generateMessage(JSON.parse(element))
        });

    },1000)
}

//Function to Save Messages for next Login
function saveMessage(){
    let lastMsgArray=[]
    for(let i=messageArray.length;i>=messageArray.length-7;i--){
        lastMsgArray.push(messageArray[i])
    }

    lastMsgArray.reverse()
    localStorage.setItem(`${userName.innerHTML}@${roomName.innerHTML}`,JSON.stringify(lastMsgArray))
}


//Function to Add Emoji on Window Load
window.addEventListener('load', () => {
    EmojiButton(document.querySelector('#emoji-button'), function (emoji) {
        messageInput.value += emoji;
    });
});


//Function to Clear Code
function emptyCode(){
    codeInput.value=""
    codeOutput.value=""
}

//Function to Scrolll
scrollChat=(heightOfMessage)=>{
    messageDiv.scrollTop=messageDiv.offsetHeight+heightOfMessage
}



//Function to beep
function playSound(){   
    
    messageTone.play()  
} 


//Function to Show Language dropdown
showDrop=()=>{
    document.getElementById('langDropDown').classList.toggle('d-none')
}

//Setting the Language
var langText=''
setLang=(id)=>{
    langText=document.getElementById(id).innerText
    document.getElementById('dropdownMenuButton').innerHTML=langText
    showDrop()
    codeBtn.classList.remove('fa-spinner')
    codeBtn.classList.remove('fa-spin')
    codeBtn.classList.add('fa-play')
}