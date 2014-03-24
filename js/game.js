function MathGame() {

    // Required for callbacks, where "this"
    // represents the window object
    var self=this;

    this.init = function(){
        // Reset values
        this.resetGame();

        // Initialize timer gauge
        this.gauge = new JustGage({
            id: "gauge", 
            value: 60, 
            min: 0,
            max: 60,
            title: "Time left:",
            levelColors: ['#E81700', '#FF530D', '#FFED60', '#CAFFD1']
        });

        // Set up listener to user input
        $('#userInput').keydown(function (e){
            if (self.started && e.keyCode == 13){
                answer = $('#userInput').val();
                self.checkInput(e, answer);
            }
        })

        // Show welcome screen
        fadeElement(1, "#frmWelcome");
    };

    this.resetGame = function() {
        // Reset values
        this.missed = 0;
        this.questionId = 0;
        this.totalsecs = 0;
    };

    this.startGame = function(mode) {
        // Reset values
        this.resetGame();

        // Start game
        this.started = true;
        this.mainTimerHandler = setInterval(this.mainTimerTick, 1000);

        // Set game mode
        this.mode = mode;
        
        // Hide welcome screen
        hideElement("#frmWelcome");
        
        // Show game field
        $('#frmGame').height(341);
        $('#frmGame').css("visibility", "visible");
        fadeElement(1, '#frmGame');

        // Set time
        if (mode == "classic"){
            this.timeAvailable = 60;
            $('#lblMode').html('Classic mode');
        }
        else{
            this.timeAvailable = 30;
            $('#lblMode').html('Survival mode');
        }

        // Update timer
        this.gauge.refresh(self.timeAvailable);

        // Shuffle
        this.shuffle();

        // Clear input
        clearInput("#userInput");

        // Focus
        $('#userInput').focus();
    };

    this.endGame = function() {
        // Stop game
        this.started = false;

        // Set results
        $('#lblScored').html(self.questionId-1);
        $('#lblMissed').html(self.missed);
        $('#lblTime').html(self.totalsecs);


        // No need to show game time
        // in classic mode
        if (this.mode == "survival"){
            $('#frmGameTime').show();
        }
        else{
            $('#frmGameTime').hide();
        }

        // Hide game
        $('#frmGame').animate({opacity: 0}, 200, function(){
            // "hide"
            $('#frmGame').height(0);    
            $('#frmGame').css("visibility", "hidden");
            
            // Show results screen
            showElement('#frmResults');
        });
    };

    this.giveup = function() {
        self.stopMainTimer();
        clearInput("#userInput");
        self.endGame();
    };

    this.shuffle = function(){
        // Generate a random operation
        var a = getRandomInt(-99, 99);
        var b = a+getRandomInt(-99, 99);
        
        var mode = getRandomInt(0, 3);
        var result = {};

        if (mode==0){
            result = this.divide(-99, 99);
        }
        else if (mode==1){
            result = this.multiply(-99, 99);  
        }
        else{
            result = this.addAndSubstract(-99, 99);   
        }

        // // Update UI
        this.currentSolution = result.solution;
        setQuestion(result.question, "#lblQuestion");

        this.questionId++;
    };

    this.addAndSubstract = function(min, max){
        var a = getRandomInt(min, max);
        var b = a+getRandomInt(min, max);
        var solution = a+b;
        
        return {
            'solution': solution,
            'question': a.toString()+getSign(b)+Math.abs(b).toString()+'='
        };
    }

    this.divide = function(min, max){
        var a = getRandomInt(min, max);
        var b = getRandomInt(Math.round(min/10), Math.round(max/10));
        while(b==0){
            b = getRandomInt(Math.round(min/10), Math.round(max/10));
        }
        var solution = Math.round(a/b);
        a = solution * b;

        var a_str = formatNegative(a);
        var b_str = formatNegative(b);

        return {
            'solution': solution,
            'question': a_str+'/'+b_str+'='
        };
    };

    this.multiply = function(min, max){
        var a = getRandomInt(min, max);
        var b = getRandomInt(Math.round(min/10), Math.round(max/10));
        var solution = a*b;

        var a_str = formatNegative(a);
        var b_str = formatNegative(b);

        return {
            'solution': solution,
            'question': a_str+'*'+b_str+'='
        };      
    };

    this.log2 = function(min, max){
        // TBD 16bit
        var a = getRandomInt(-99, 99);
        var b = a+getRandomInt(-99, 99);
        var solution = a+b;
    };    

    this.pow2 = function(min, max){
        // TBD 16bit
        var a = getRandomInt(-99, 99);
        var b = a+getRandomInt(-99, 99);
        var solution = a+b;
    };    

    this.checkInput = function(e, answer){
        var isGood = (answer == self.currentSolution);
        var isSurvival = (self.mode == "survival");

        flashStatus(isGood, "#lblStatus");
        clearInput("#userInput");

        if (isGood){
            self.shuffle();
        }
        else{
            self.missed++;
        }

        if (isSurvival){
            self.addSeconds(isGood);
        }
    };

    this.mainTimerTick = function(){
        // Check if there's time remaining
        if (self.timeAvailable-- > 0){
            // Count elapsed time and update gauge
            self.totalsecs++;
            self.gauge.refresh(self.timeAvailable);
        }
        else{
            // Stop timer, end game
            self.stopMainTimer();
            clearInput("#userInput");
            self.endGame();
        }           
    };

    this.stopMainTimer = function(){
        // Stop interval timer
        clearInterval(self.mainTimerHandler);
    };

    this.addSeconds = function(isGood){
        // Add or remove seconds from time remaining
        // in survival mode.

        var futureValue;

        if (isGood){
            futureValue = self.timeAvailable + 3;
        }
        else{
            futureValue = self.timeAvailable - 1;;
        }

        // Max: 60
        if (futureValue>60){
            futureValue=60;
        }

        // Min: 0
        if (futureValue<0){
            futureValue=0;
        }

        self.timeAvailable = futureValue;
        self.gauge.refresh(self.timeAvailable);
        survivalStatus(isGood, "#lblSurvivalPoints");
    };

    this.showWelcome = function() {
        // Show welcome screen
        hideElement("#frmResults");
        hideElement("#frmHelp");
        showElement("#frmWelcome");
    };

    this.showInfo  = function(){
        // Show help screen
        hideElement("#frmWelcome");
        showElement("#frmHelp");
    };

    // Call init
    this.init();
};