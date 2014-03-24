function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSign(theNumber){
    if(theNumber >= 0){
        return "+";
    }
    else{
        return "-";
    }
}

function formatNegative(theNumber){
    return theNumber<0?'('+theNumber.toString()+')':theNumber.toString();
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

function setQuestion(question, questionField){
    $(questionField).text(question);
};

function survivalStatus(isGood, statusField){
    if (isGood){
        $(statusField).css("color", "darkgreen");
        $(statusField).text("+3");
    }
    else{
        $(statusField).css("color", "darkred");
        $(statusField).text("-1");
    }

    $(statusField).animate({opacity: 1}, 200, function(){
        $(statusField).animate({opacity: 0}, 400);
    });
}

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