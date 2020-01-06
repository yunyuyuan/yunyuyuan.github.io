$(document).ready(function () {
    let welcome_div = $('#welcome-wrap');
    put_animate(0);

    function put_animate(idx) {
        let target = welcome_div.find('span[data-idx="'+idx+'"]');
        if ((typeof target)!=="undefined") {
            target.css('animation', 'letter-flip 0.5s linear forwards');
            target.on('animationend', function (e) {
                $(e.target).css('transform', 'none');
                if (idx+1 === welcome_div[0].childElementCount){
                    welcome_div.find('span').each(function () {
                        this.style.animation = '';
                        this.style.animation = 'glitter 2s infinite';
                        this.style.animationTimingFunction = 'easy-in-out';
                        this.style.animationDirection = 'alternate';
                    });
                }
            });
            setTimeout(function () {
                put_animate(idx+1);
            }, 300);
        }
    }
});