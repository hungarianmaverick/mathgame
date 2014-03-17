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

    this.clearInput = function (){
        $('#'+self.inputField).val("");
    };

    this.setQuestion = function (a, b){
        $('#'+self.questionField).text(a.toString() + getSignedNumber(b) + "=");
    };

    this.nextRound = function(){
        $('#'+self.inputField).keydown(function (e){
            if (self.started && e.keyCode == 13){
                answer = $('#'+self.inputField).val();
                self.checkInput(e, answer);
            }
        })	
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
        this.questionId = 0;
        this.started = true;
        
        this.mainTimerHandler = setInterval(this.mainTimer, 1000);
        self.gauge.refresh(self.timeAvailable);
        this.scramble();
        this.nextRound();
        $('#startDialog').modal('hide');
        $('#endDialog').modal('hide');

        $('#'+self.gameField).animate({opacity: 1}, 200);
        $('#'+this.inputField).focus()
    }

    this.endGame = function() {
        this.started = false;

        var resultList = [];
        var answered = self.questionId;

        for(var i=1; i<self.questionId; i++){
          resultList.push('<li>[' + i + '.] ' + this.questions[i] + ': ' + self.missesResults[i] +
           ' misses, in ' + self.timeResults[i]/1000 + ' s</li>');  
        }

        $('#results').html(resultList.join(''));

        $('#endDialog').modal({
            backdrop: 'static',
            keyboard: false
        });
    };

    this.restartGame = function() {
        this.timeAvailable = 60;
        this.timeResults = {};
        this.missesResults = {};
        this.questions = {};

        this.startGame();
    };

    this.init = function(){
        this.timeAvailable = 20;
        this.questionField = 'question';
        this.inputField = 'input';
        this.statusField = 'status';
        this.gameField = 'game';
        this.timeResults = {};
        this.missesResults = {};
        this.questions = {};

        this.gauge = new JustGage({
            id: "gauge", 
            value: 60, 
            min: 0,
            max: this.timeAvailable,
            title: "Time left",
            levelColors: ['#E81700', '#FF530D', '#FFED60', '#CAFFD1']
        });
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
    $('#startDialog').modal({
        backdrop: 'static',
        keyboard: false
    });
};