function MathGame() {
    this.setStatus =  function (status){
        $('#'+this.statusField).text(status);
        $('#'+this.statusField).fadeIn(200, function() {
            $('#'+this.statusField).fadeOut(400);
        })
    };

    this.clearInput = function (){
        $('#'+this.inputField).val("");
    };

    this.setQuestion = function (a, b){
        $('#'+this.questionField).text(a.toString() + getSignedNumber(b) + "=");
    };

    this.nextRound = function(){
        res = this.scramble();
        before = new Date().getTime();
        $('#txt').keydown(function (e){
            if(e.keyCode == 13){
                var time = new Date().getTime() - before
                if ($('#txt').val() == res){
                    setStatus("Good!");
                    res = scramble();
                    before = new Date().getTime();
                }
                else{
                    setStatus("Wrong!!");
                }
            }
        })	
    };

    this.scramble = function(){
        var a = getRandomInt(-99, 99);
        var b = a+getRandomInt(-99, 99);
        var res = a+b;

        this.setQuestion(a, b);
        this.clearInput();

        return res;
    };

    this.mainTimer = function()
    {
        if (this.timeAvailable-->0){
            this.gauge.refresh(this.timeAvailable);
        }
        else{
            stopMainTimer();
            endGame();
        }			
    };

    this.stopMainTimer = function()
    {
        clearInterval(this.mainTimerHandler);
    };

    this.endGame = function()
    {
        alert("Game over!");
    };

    this.startGame = function() {
        
        this.nextRound();
    }

    this.timeAvailable = 60;
    this.questionField = 'question';
    this.inputField = 'input';
    this.statusField = 'status';
    

    this.gauge = new JustGage({
        id: "gauge", 
        value: 60, 
        min: 0,
        max: this.timeAvailable,
        title: "Time left",
        levelColors: ['#E81700', '#FC95FF', '#E1E859', '#CAFFD1']
    });

    this.mainTimerHandler = setInterval(this.mainTimer(),1000);

    this.startGame();
};