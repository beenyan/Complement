let run = () => {
    if (Type === 0) Zerotype.run();
    else if (Type === 1) Onetype.run();
    else if (Type === 2) Twotype.run();
}

let numberError = num => {
    for (let x of num) {
        if (x === '.') continue;
        if (baseToNumber(x) >= Base) return true;
    }
    return false;
}

let checkInputError = () => {
    if (Base < 2 || Base > 36 || !$('#base').val().match(/^[1-9][0-9]*$/)) {
        cardWarning(`Base Error<br>Range 2 to 36.`)
        return true;
    } else if (!$('#bit_limit').val().match(/^[1-9][0-9]*$/)) {
        cardWarning(`Base Limit Error<br>Input type error.`)
        return true;
    } else if (!A.isNumber) {
        cardWarning(`Number A input error.`)
        return true;
    } else if (!B.isNumber) {
        cardWarning(`Number B input error.`)
        return true;
    }
    return false;
}

let isPlus = val => {
    return val[0] !== '-';
}

let changeCradTitle = () => {
    let element = $('.btn-check:checked');
    $cardHeader.text($(`[for=${$(element).attr('id')}]`).text());
}

let cardWarning = text => {
    changeCard('danger');
    setCardText(text);
}

let cardSuccess = text => {
    changeCard('success');
    setCardText(text);
}

let changeCard = status => {
    if (status === 'danger') $Card.removeClass('bg-success').addClass('bg-danger');
    else $Card.removeClass('bg-danger').addClass('bg-success');
}

let setCardText = text => {
    let Tip = $Card.hasClass('bg-danger') ? 'Warning' : 'Ans';
    $cardTitle.html(`${Tip}<br>${text}`);
}

let baseToNumber = num => { // '9' -> 9   'a' -> 10
    return isNaN(+num) ? num.toLowerCase().charCodeAt() - 87 : parseInt(num);
}

let numberToBase = num => { // 9 -> '9'   10 - > 'a'
    return num < 10 ? num : String.fromCharCode(num + 87);
}

let floatZeroFixed = (inputA, inputB) => { // 對齊小數點
    // 小數補 0
    if (inputA.val.includes('.') && !inputB.val.includes('.')) inputB.val += '.0';
    else if (!inputA.val.includes('.') && inputB.val.includes('.')) inputA.val += '.0';
    // 小數 0 對齊
    if (inputA.val.includes('.') || inputB.val.includes('.')) {
        let floatPosA = inputA.val.length - inputA.val.indexOf('.');
        let floatPosB = inputB.val.length - inputB.val.indexOf('.');
        if (floatPosA > floatPosB) inputB.val = inputB.val.padEnd(inputB.val.length + (floatPosA - floatPosB), '0');
        else if (floatPosB > floatPosA) inputA.val = inputA.val.padEnd(inputA.val.length + (floatPosB - floatPosA), '0');
    }
    // 整數 0 對齊
    if (inputA.val.length > inputB.val.length) {
        inputB.val = inputB.val.padStart(inputA.val.length + 1, '0');
        inputA.val = '0' + inputA.val;
    } else if (A.length < inputB.val.length) {
        inputA.val = inputA.val.padStart(inputB.val.length + 1, '0');
        inputB.val = '0' + inputB.val;
    } else {
        inputA.val = '0' + inputA.val;
        inputB.val = '0' + inputB.val;
    }
};

let numZeroFixed = num => { // 去除前後 0
    num.val = num.val.replace(/^0+/, '');
    if (num.val.includes('.'))
        num.val = num.val.replace(/0+$/, '');
    if (num.val.substr(num.val.length - 1) === '.')
        num.val = num.val.slice(0, -1);
}

let complement = (num, base) => {
    let ret = '';
    for (let i = 0; i < num.val.length; ++i) {
        if (num.val[i] === '.') continue;
        else ret += numberToBase(base - baseToNumber(num.val[i]));
    }
    ret = numberToBase(num.isPlus ? 0 : base) + ret;
    return ret;
}

let endCarry = num => {
    let carry = 0;
    let ret = new Num('');
    for (let i = num.val.length - 1; i >= 0; --i) {
        if (num.val[i] === '.') {
            ret.val = '.' + ret.val;
            continue;
        }
        let numA = baseToNumber(num.val[i]);
        let sum = numA + carry + (i === num.val.length - 1);
        ret.val = numberToBase(sum % Base) + ret.val;
        carry = parseInt(sum / Base);
    }
    return ret;
}

let add = (inputA, inputB) => {
    let carry = 0;
    let ret = new Num('');
    for (let i = inputA.val.length - 1; i >= 0; --i) {
        if (inputA.val[i] === '.') {
            ret.val = '.' + ret.val;
            continue;
        }
        let numA = baseToNumber(inputA.val[i]);
        let numB = baseToNumber(inputB.val[i]);
        let sum = numA + numB + carry;
        ret.val = numberToBase(sum % Base) + ret.val;
        carry = parseInt(sum / Base);
    }
    // 端回進位
    if (carry) ret = endCarry(ret);
    return ret;
}