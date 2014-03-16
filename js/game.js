function MathGame() {

    var self=this;

    this.setStatus =  function (status){
        $('#'+self.statusField).text(status);
        $('#'+self.statusField).fadeIn(200, function() {
            $('#'+self.statusField).fadeOut(400);
        })
    };

    this.clearInput = function (){
        $('#'+self.inputField).val("");
    };

    this.setQuestion = function (a, b){
        $('#'+self.questionField).text(a.toString() + getSignedNumber(b) + "=");
    };

    this.nextRound = function(){
        $('#'+self.inputField).keydown(function (e){
            if(e.keyCode == 13){
                answer = $('#'+self.inputField).val();
                self.checkInput(e, answer);
            }
        })	
    };

    this.checkInput = function(e, answer){
        var time = new Date().getTime() - self.lastScrambleTime;
        if (answer == self.currentSolution){
            self.timeResults[self.questionId] = time;
            self.missesResults[self.questionId] = self.currentMisses;
            self.setStatus("Good!");
            self.scramble();
        }
        else{
            self.currentMisses++;
            self.setStatus("Wrong!!");
        }
    }

    this.scramble = function(){
        var a = getRandomInt(-99, 99);
        var b = a+getRandomInt(-99, 99);
        var solution = a+b;

        this.currentSolution = solution;
        this.currentMisses = 0;
        this.setQuestion(a, b);
        this.clearInput();
        this.lastScrambleTime = new Date().getTime();
        this.questionId++;
    };

    this.startGame = function() {
        this.startTime = new Date().getTime();
        this.questionId = 0;
        this.scramble();
        this.nextRound();
    }

    this.endGame = function(){
        alert("Game over!");
    };

    this.timeAvailable = 60;
    this.questionField = 'question';
    this.inputField = 'input';
    this.statusField = 'status';
    this.timeResults = {};
    this.missesResults = {};

    this.gauge = new JustGage({
        id: "gauge", 
        value: 60, 
        min: 0,
        max: this.timeAvailable,
        title: "Time left",
        levelColors: ['#E81700', '#FF530D', '#FFED60', '#CAFFD1']
    });

    this.stopMainTimer = function(){
        clearInterval(self.mainTimerHandler);
    };

    this.mainTimer = function(){
        if (self.timeAvailable-->0){
            self.gauge.refresh(self.timeAvailable);
        }
        else{
            self.stopMainTimer();
            self.clearInput();
            self.endGame();
        }           
    };

    this.mainTimerHandler = setInterval(this.mainTimer, 1000);

    this.startGame();
};

new MathGame();