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