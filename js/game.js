function MathGame() {

    var self=this;

    this.setStatus =  function (status){
        if (status){
            $('#'+self.statusField).removeClass().addClass('glyphicon glyphicon-ok');
        }
        else{
            $('#'+self.statusField).removeClass().addClass('glyphicon glyphicon-remove');
        }

        $('#'+self.statusField).animate({opacity: 1}, 200, function(){
            $('#'+self.statusField).animate({opacity: 0}, 400);
        });
    };

    this.displayElement = function (alpha, element){
        $('#'+element).animate({opacity: alpha}, 200);
    };

    this.clearInput = function (){
        $('#'+self.inputField).val("");
    };

    this.setQuestion = function (a, b){
        $('#'+self.questionField).text(a.toString() + getSignedNumber(b) + "=");
    };

    this.checkInput = function(e, answer){
        var time = new Date().getTime() - self.lastScrambleTime;
        if (answer == self.currentSolution){
            self.timeResults[self.questionId] = time;
            self.setStatus(true);
            self.scramble();
        }
        else{
            self.missesResults[self.questionId]++;
            self.missed++;
            self.setStatus(false);
        }
    }

    this.scramble = function(){
        var a = getRandomInt(-99, 99);
        var b = a+getRandomInt(-99, 99);
        var solution = a+b;

        this.currentSolution = solution;
        this.setQuestion(a, b);
        this.clearInput();
        
        this.questionId++;
        this.questions[this.questionId] = a.toString() + getSignedNumber(b);
        this.missesResults[self.questionId] = 0;
        
        this.lastScrambleTime = new Date().getTime();
    };

    this.startGame = function() {
        this.startTime = new Date().getTime();
        this.started = true;
        
        this.mainTimerHandler = setInterval(this.mainTimer, 1000);
        this.gauge.refresh(self.timeAvailable);
        this.scramble();

        // Hide welcome screen
        this.displayElement(0, "frmWelcome");
        $('#frmWelcome').hide();

        this.displayElement(1, this.gameField);

        $('#'+this.inputField).focus()
    }

    this.endGame = function() {
        this.started = false;

        $('#lblScored').html(self.questionId-1);
        $('#lblMissed').html(self.missed);

        // Hide game
        this.displayElement(0, this.gameField);
        
        // Show results screen
        $('#frmResults').show();
        this.displayElement(1, "frmResults");
    };

    this.resetGame = function() {
        this.timeAvailable = 60;
        this.timeResults = {};
        this.missesResults = {};
        this.questions = {};
        this.missed = 0;
        this.questionId = 0;
        $('#'+this.statusField).removeClass();
    };

    this.newGame = function() {
        this.resetGame();

        this.displayElement(0, "frmResults");
        $('#frmResults').hide();
        
        $('#frmWelcome').show();
        this.displayElement(1, "frmWelcome");
    };

    this.init = function(){
        this.questionField = 'question';
        this.inputField = 'input';
        this.statusField = 'status';
        this.gameField = 'game';
        
        this.resetGame();

        this.gauge = new JustGage({
            id: "gauge", 
            value: 60, 
            min: 0,
            max: this.timeAvailable,
            title: "Time left:",
            levelColors: ['#E81700', '#FF530D', '#FFED60', '#CAFFD1']
        });

        $('#'+this.inputField).keydown(function (e){
            if (self.started && e.keyCode == 13){
                answer = $('#'+self.inputField).val();
                self.checkInput(e, answer);
            }
        })

        this.displayElement(1, "frmWelcome");
    }

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

    this.init();
};