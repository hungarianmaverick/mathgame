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
        fadeElement(1, "#frmGame");

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

        // Hide game
        fadeElement(0, "#frmGame")

        // No need to show game time
        // in classic mode
        if (this.mode == "survival"){
            $('#frmGameTime').show();
        }
        else{
            $('#frmGameTime').hide();
        }

        // Show results screen
        showElement('#frmResults');
    };

    this.shuffle = function(){
        // Generate a random operation
        var a = getRandomInt(-99, 99);
        var b = a+getRandomInt(-99, 99);
        var solution = a+b;

        // Update UI
        this.currentSolution = solution;
        setQuestion(a, b, "#lblQuestion");
        clearInput("#userInput");

        this.questionId++;
    };

    this.checkInput = function(e, answer){
        if (answer == self.currentSolution){
            // Flash the ok sign,
            // get the new question
            // and add 3 secs in survival mode
            flashStatus(true, "#lblStatus");
            self.shuffle();
            if (self.mode == "survival"){
                self.addSeconds(3);
            }
        }
        else{
            // Flash the not ok sign,
            // count wrong answers,
            // and subtract 1 sec in survival mode
            flashStatus(false, "#lblStatus");
            self.missed++;
            if (self.mode == "survival"){
                self.addSeconds(-1);
            }
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

    this.addSeconds = function(seconds){
        // Add or remove seconds from time remaining
        // in survival mode.
        var futureValue = self.timeAvailable + seconds;

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
        // Do some animation stuff here +3 in green, -1 in red
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