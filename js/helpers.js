function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSignedNumber(theNumber){
    if(theNumber > 0){
        return "+" + theNumber;
    }
    else if (theNumber == 0){
        return "+" + theNumber;
    }
    else{
        return theNumber.toString();
    }
}

function hideElement(element){
    fadeElement(0, element);
    $(element).hide();
}

function showElement(element){
    $(element).show();   
    fadeElement(1, element);
}

function fadeElement(alpha, element){
    $(element).animate({opacity: alpha}, 200);
};

function clearInput(inputField){
    $(inputField).val("");
};

function setQuestion(a, b, questionField){
    $(questionField).text(a.toString() + getSignedNumber(b) + "=");
};

function flashStatus(status, statusField){
    if (status){
        $(statusField).removeClass().addClass('glyphicon glyphicon-ok');
    }
    else{
        $(statusField).removeClass().addClass('glyphicon glyphicon-remove');
    }

    $(statusField).animate({opacity: 1}, 200, function(){
        $(statusField).animate({opacity: 0}, 400);
    });
};