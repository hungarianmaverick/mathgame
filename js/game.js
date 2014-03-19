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
        if (answer == self.currentSolution){
            self.setStatus(true);
            self.shuffle();
            if (self.mode == "survival"){
                self.addSeconds(3);
            }
        }
        else{
            self.missed++;
            self.setStatus(false);
            if (self.mode == "survival"){
                self.addSeconds(-1);
            }
        }
    };

    this.addSeconds = function(seconds){
        var futureValue = self.timeAvailable + seconds;

        if (futureValue>60){
            futureValue=60;
        }

        if (futureValue<0){
            futureValue=0;
        }

        self.timeAvailable = futureValue;
        self.gauge.refresh(self.timeAvailable);
        // Do some animation stuff here +3 in green, -1 in red
    };

    this.shuffle = function(){
        var a = getRandomInt(-99, 99);
        var b = a+getRandomInt(-99, 99);
        var solution = a+b;

        this.currentSolution = solution;
        this.setQuestion(a, b);
        this.clearInput();

        this.questionId++;
        this.questions[this.questionId] = a.toString() + getSignedNumber(b);
        this.missesResults[self.questionId] = 0;
    };

    this.startGame = function(mode) {
        this.startTime = new Date().getTime();
        this.started = true;

        this.mainTimerHandler = setInterval(this.mainTimer, 1000);
        this.gauge.refresh(self.timeAvailable);
        this.mode = mode;
        this.shuffle();

        // Hide welcome screen
        this.displayElement(0, "frmWelcome");
        $('#frmWelcome').hide();

        if (mode == "classic"){
            this.timeAvailable = 60;
            $('#lblMode').html('Classic mode');
        }
        else{
            this.timeAvailable = 30;
            $('#lblMode').html('Survival mode');
        }
        this.gauge.refresh(self.timeAvailable);

        this.displayElement(1, this.gameField);

        $('#'+this.inputField).focus()
    };

    this.endGame = function() {
        this.started = false;

        $('#lblScored').html(self.questionId-1);
        $('#lblMissed').html(self.missed);
        $('#lblTime').html(self.totalsecs);

        // Hide game
        this.displayElement(0, this.gameField);

        // Show results screen
        if (this.mode == "survival"){
            $('#frmGameTime').show();
        }
        else{
            $('#frmGameTime').hide();
        }

        $('#frmResults').show();
        this.displayElement(1, "frmResults");
    };

    this.resetGame = function() {
        this.timeResults = {};
        this.missesResults = {};
        this.questions = {};
        this.missed = 0;
        this.questionId = 0;
        this.totalsecs = 0;
    };

    this.newGame = function() {
        this.resetGame();

        this.displayElement(0, "frmResults");
        $('#frmResults').hide();

        this.displayElement(0, "frmHelp");
        $('#frmHelp').hide();

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
            max: 60,
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
    };

    this.stopMainTimer = function(){
        clearInterval(self.mainTimerHandler);
    };

    this.mainTimer = function(){
        if (self.timeAvailable-->0){
            self.totalsecs++;
            self.gauge.refresh(self.timeAvailable);
        }
        else{
            self.stopMainTimer();
            self.clearInput();
            self.endGame();
        }           
    };

    this.showInfo  = function(){
        this.displayElement(0, "frmWelcome");
        $('#frmWelcome').hide();

        $('#frmHelp').show();
        this.displayElement(1, "frmHelp");
    }

    this.init();
};