$(document).ready(function () {

    var $overlay = $('#overlay')
    var $next = $('#next')
    var $tapToStart = $('#tap-to-start')
    var $gameOver = $('#game-over')
    var $playAgain = $('#play-again')
    var $cups = $('.cup .main path')
    
    // initial sizes
    var ballHeight = $('#ball').height()
    var cupTop = $('.cup').offset().top

    // cups positions
    var cup1 = $('.cup1').offset().left
    var cup2 = $('.cup2').offset().left
    var cup3 = $('.cup3').offset().left
    var time = 300
    $overlay.click(function () {

        // hide buttons
        $overlay.hide()
        $tapToStart.hide()

        // disable to click on cups
        $('.cup').addClass('avoid-clicks')

        // cups up
        $cups.css({
            'transition': `${time + 100}ms`,
            'transform': `translateY(-${100 - ballHeight}px)`
        })
      
        // cups down
        setTimeout(() => {
          $cups.css('transform', 'translateY(100px)')
        }, time * 5)

        // start shuffle
        setTimeout(() => {

            // shuffle counter
            var i = 0

            var shuffle = setInterval(() => {

                // shuffle counter +1
                i++

                // two random cups to shuffle
                var rand1 = Math.floor(Math.random() * 3 + 1)
                var rand2 = Math.floor(Math.random() * 3 + 1)

                while (rand1 == rand2) {
                    var rand2 = Math.floor(Math.random() * 3 + 1)
                }

                // half distance between two cups
                var distance = ($(`.cup${rand1}`).offset().left - $(`.cup${rand2}`).offset().left) / 2

                // change position of first cup like this /\
                $(`.cup${rand1}`).animate({
                    left: $(`.cup${rand2}`).offset().left + distance,
                    top: `${cupTop + 50}`
                }, time, 'linear').animate({
                    left: $(`.cup${rand2}`).offset().left,
                    top: `${cupTop}`
                }, time, 'linear')

                // change position of second cup like this \/
                $(`.cup${rand2}`).animate({
                    left: $(`.cup${rand1}`).offset().left - distance,
                    top: `${cupTop - 50}`
                }, time, 'linear').animate({
                    left: $(`.cup${rand1}`).offset().left,
                    top: `${cupTop}`
                }, time, 'linear')

                // if shuffle counter reachs to 15 stop shuffling
                if (i == 15) {
                    clearInterval(shuffle)

                    // enable to click on cups
                    $('.cup').removeClass('avoid-clicks')
                }

            }, time * 2 + 50);

        }, time * 7);
    })

    // click on cups
    $('.cup').click(function () {

        // disable to click on cups
        $('.cup').addClass('avoid-clicks')

        // cups up
        $cups.css({
            'transform': `translateY(-${100 - ballHeight}px)`
        })

        // if ball found
        if ($(this).hasClass('cup2')) {
            $next.show()
            $(this).find('.o').show()
        }
        // if ball not found
        else {
            $gameOver.show()
            $playAgain.show()
            $(this).find('.x').show()
        }
    })

    // click on next
    $next.click(function () {

        // hide next button and correct sign
        $(this).hide()
        $('.o').hide()

        // enable tap to start
        $tapToStart.show()
        $overlay.show()
        
        // level +1
        $('#level').html(`${parseInt($('#level').html()) + 1}`)

        // cups down
        $cups.css({
            'transition': '0s',
            'transform': 'translateY(100px)'
        })
        
        // set cups to their initial positions
        $('.cup1').css('left', cup1)
        $('.cup2').css('left', cup2)
        $('.cup3').css('left', cup3)
        
        // manage shuffle speed
        if (time <= 300 && time > 100) {
            time -= 25
        } else if (time <= 100 && time > 50) {
            time -= 10
        } else if (time <= 50 && time > 30) {
            time -= 2
        }
    })

    // click on play again (restart entire game)
    $playAgain.click(function () {

        // hide play again, game over buttons and wrong sign
        $(this).hide()
        $($gameOver).hide()
        $('.x').hide()

        // enable tap to start
        $tapToStart.show()
        $overlay.show()

        // back to level 1
        $('#level').html('1')

        // cups down
        $cups.css({
            'transition': '0s',
            'transform': 'translateY(100px)'
        })

        // set cups to their initial positions
        $('.cup1').css('left', cup1)
        $('.cup2').css('left', cup2)
        $('.cup3').css('left', cup3)

        // reset time
        time = 300
    })
});