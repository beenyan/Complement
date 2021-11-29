$('#clacans').click(() => { // get values
    Base = parseInt($('#base').val());
    Bit_Limit = parseInt($('#bit_limit').val());
    A = new Num($('#a_input').val().toLocaleLowerCase());
    B = new Num($('#b_input').val().toLocaleLowerCase());
    if (checkInputError()) {
        $AnsBox.toggleClass('ans-box-show');
        return;
    }
    $('.btn-check').each((index, element) => {
        if ($(element).is(':checked')) {
            Type = index;
            return;
        }
    });
    run();

    $AnsBox.toggleClass('ans-box-show');
});

$Base.on('input', event => {
    let self = event.target;
    let val = parseInt(self.value);
    if (val > 36) {
        $Type1.text(`35 補數表示法`);
        $Type2.text(`36 補數表示法`);
        self.value = 36;
        return;
    } else if (val < 1 || isNaN(val)) {
        if (!isNaN(val)) self.value = 2;
        $Type1.text(`1 補數表示法`);
        $Type2.text(`2 補數表示法`);
        return;
    }
    $Type1.text(`${val - 1} 補數表示法`);
    $Type2.text(`${val} 補數表示法`);
    changeCradTitle();
});

$AnsBox.click(() => $AnsBox.removeClass());