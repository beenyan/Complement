'use strict';

class Num {
    constructor(number) {
        this.ori = number; // 原來的值
        this.isPlus = isPlus(number); // 正負號
        this.val = number.replace(/[\+\-]/, '');
    }
    get whole() {
        return (this.isPlus ? '+' : '-') + this.val;
    }
    get length() {
        return this.val.length + 1 - this.val.includes('.');
    }
    get isNumber() {
        return this.val.match(/^[+-]?[\da-z]+(\.[\da-z]+)?$/) && !numberError(this.val);
    }
    complement(base, setSign = false) { // 補數
        let temp = '';
        for (let i = 0; i < this.val.length; ++i) {
            if (this.val[i] === '.') {
                temp += '.';
                continue;
            }
            else temp += numberToBase(base - baseToNumber(this.val[i]));
        }
        this.val = temp;
        if (setSign) this.signComplement(base);
    }
    signComplement(base) { // 給予正負號 (正 -> 0) (負 -> base - 1)
        this.val = numberToBase(this.isPlus ? 0 : base) + this.val;
    }
    complementFixed(base) { // 修正補數
        if (baseToNumber(this.val[0]) === base) {
            this.complement(base);
            numZeroFixed(this);
            return new Num('-' + this.val);
        }
        return new Num('+' + this.val);
    }
    cleanStartZero() {
        this.val = this.val.substring(1);
    }
}

class ZeroType {
    run() {
        if (A.isPlus === B.isPlus) this.Case1()
        else this.Case2();
    }
    Case1() {
        floatZeroFixed(A, B);
        let ans = add(A, B);
        numZeroFixed(ans);
        ans.isPlus = A.isPlus;
        if (ans.length > Bit_Limit) cardWarning(`Bit overflow<br>You has ${ans.length} bits.`);
        else cardSuccess(ans.whole);
    }
    Case2() {
        floatZeroFixed(A, B);
        if (A.isPlus) A.signComplement(Base - 1); else A.complement(Base - 1, true);
        if (B.isPlus) B.signComplement(Base - 1); else B.complement(Base - 1, true);
        let ans = add(A, B).complementFixed(Base - 1);
        numZeroFixed(ans);
        if (ans.length > Bit_Limit) cardWarning(`Bit overflow<br>You has ${ans.length} bits.`);
        else cardSuccess(ans.whole);
    }
}

class OneType {
    run() {
        if (A.isPlus && B.isPlus) this.Case3();
        else if (A.isPlus !== B.isPlus) this.Case5();
        else this.Case4();
    }
    Case3() {
        floatZeroFixed(A, B);
        let ans = add(A, B);
        numZeroFixed(ans);
        ans.isPlus = A.isPlus;
        if (ans.length > Bit_Limit) cardWarning(`Bit overflow<br>You has ${ans.length} bits.`);
        else cardSuccess(`Not overflow.`);
    }
    Case4() {
        A.isPlus = B.isPlus = true;
        this.Case3();
    }
    Case5() {
        floatZeroFixed(A, B);
        if (A.isPlus) A.signComplement(Base - 1); else A.complement(Base - 1, true);
        if (B.isPlus) B.signComplement(Base - 1); else B.complement(Base - 1, true);
        let ans = add(A, B).complementFixed(Base - 1);
        numZeroFixed(ans);
        if (ans.length > Bit_Limit) cardWarning(`Bit overflow<br>You has ${ans.length} bits.`);
        else cardSuccess(`Not overflow.`);
    }
}

class TwoType {
    run() {
        if (A.isPlus && B.isPlus) this.Case3();
        else if (A.isPlus !== B.isPlus) this.Case7();
        else this.Case6();
    }
    Case3() { // 正數
        Onetype.Case3();
    }
    Case7() { // 異數
        floatZeroFixed(A, B);
        if (!A.isPlus) {
            A.complement(Base - 1, true);
            A = endCarry(A);
        } else A.signComplement(Base - 1);
        if (!B.isPlus) {
            B.complement(Base - 1, true);
            B = endCarry(B);
        } else B.signComplement(Base - 1);
        A.cleanStartZero();
        B.cleanStartZero();
        let sum = add(A, B, false);
        if (sum.isCarry && sum.val[0] === '0' || !sum.isCarry && sum.val[0] === '1')
            cardSuccess('Not overflow.');
        else cardWarning(`Bit overflow`);
    }
    Case6() { // 負數
        floatZeroFixed(A, B);
        A.val = A.val.padStart(Bit_Limit - 1, '0');
        B.val = B.val.padStart(Bit_Limit - 1, '0');
        if (!A.isPlus) {
            A.complement(Base - 1, true);
            A = endCarry(A);
        } else A.signComplement(Base - 1);
        if (!B.isPlus) {
            B.complement(Base - 1, true);
            B = endCarry(B);
        } else B.signComplement(Base - 1);
        A.cleanStartZero();
        B.cleanStartZero();
        let sum = add(A, B, false);
        if (sum.val[0] === '1') cardSuccess('Not overflow.');
        else cardWarning(`Bit overflow`);
    }
}