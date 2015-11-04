/**
 * Created by harkins on 11/3/15.
 */
(function () {
    "use strict";

    var readline = require('readline');
    var config = require('./config.json');

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    process.stdin.setEncoding('utf8');


    //current maxWidth is set to 80 due to default size of terminal/cmd
    var maxWidth = config.maxWidth;
    var maxRows = maxWidth/2;
    var line = new Array(maxWidth + 2);
    var stopExecution = null;

    console.log('----Harkins Rule30 Command line Output----');
    console.log('This application will stop automatically after ' + maxRows + ' rows.');
    console.log('Please enter 0 for continuous execution or the number of steps you would ' +
        'like to output(< '+maxRows+'). To stop execution please press "s" then enter.');

    enterValue();


    //When the user press 's' and then enter I am clearing to timeout so it
    //outputs and then calling enterValue again to prompt the user to enter another value.
    rl.on('line', function (cmd) {
        if(cmd === 's' || cmd === 'S') {
            console.log('You just stopped the execution.');
            clearTimeout(stopExecution);
            enterValue();
        }
    });

    //When pressing ctrl c this will allow the program to terminate
    rl.on('SIGINT', function() {
        console.log("You just terminated the program.");
        rl.close();
        process.exit();
    });

    //This function prompt the user for their desired row count and
    //then closes the program
    function enterValue() {
        rl.question("Enter your value: ", function (answer) {
            if (isNaN(answer) || answer < 0 || answer > maxRows) {
                console.log("You did not enter a valid number.");
            }
            else if (answer == 0) {
                //Just keep going
                outputTree(maxRows);
            }
            else if (answer > 0 && answer <= maxRows) {
                //Minus 1 to account for the top row
                outputTree(answer - 1);
            }
        });
    }

    //output the first row of the tree and then call a counter function
    //the works as a for loop with a setTimeout to slow down the display of the rows
    //to allow the user time to pause the output
    function outputTree(numOfSteps) {
        line = new Array(maxWidth + 2);

        //Create First line
        for (var m = 0; m <= maxWidth + 1; m++ ){
            line[m] = ' ';
        }
        //This is the middle of the first row, where it all begins
        line[maxWidth/2] = '*';

        //Output first line
        for(var k = 1; k <= maxWidth; k++){
            process.stdout.write(line[k]);
        }
        console.log();

        outputStep(1, numOfSteps);

    }


    //Output each step, this is in a separate function to slow the output of each line
    //to a second and a half to give the user time to stop execution
    var outputStep = function (index, stopAt) {
        stopExecution = setTimeout(function OutputRow() {
            var lineCopy = new Array(maxWidth + 2);

            for (var y = 0; y < maxWidth + 2; y++ )
            {
                lineCopy[y] = line[y];
            }
            for (var i = 1; i <= maxWidth; i++ )
            {
                //Rule30 Rule Set
                if ( ( lineCopy[i-1] == ' ' && lineCopy[i] == ' ' && lineCopy[i+1] == '*' ) ||
                    ( lineCopy[i-1] == ' ' && lineCopy[i] == '*' && lineCopy[i+1] == ' ' ) ||
                    ( lineCopy[i-1] == ' ' && lineCopy[i] == '*' && lineCopy[i+1] == '*' ) ||
                    ( lineCopy[i-1] == '*' && lineCopy[i] == ' ' && lineCopy[i+1] == ' ' ) )
                {
                    line[i] = '*';
                }
                else
                {
                    line[i] = ' ';
                }
            }

            //Output row
            for (var z = 1; z <= maxWidth; z++ )
            {
                process.stdout.write(line[z]);
            }
            console.log();

            //Recursively call function
            if (index != stopAt) {
                outputStep((index + 1), stopAt);
            }
            if(index == stopAt){
                enterValue();
            }

        }, (1500));
    };
})();
