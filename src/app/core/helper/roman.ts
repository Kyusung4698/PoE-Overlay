/* https://github.com/joshleaves/roman-numerals/ */
export class Roman {
    public static toArabic(input: string): number {
        const roman = input.toUpperCase().match(/^(M{0,3})(CM|DC{0,3}|CD|C{0,3})(XC|LX{0,3}|XL|X{0,3})(IX|VI{0,3}|IV|I{0,3})$/);
        if (!roman) {
            throw new Error('toArabic expects a valid roman number');
        }

        let arabic = 0;
        arabic += roman[1].length * 1000;
        if (roman[2] === 'CM') {
            arabic += 900;
        } else if (roman[2] === 'CD') {
            arabic += 400;
        } else {
            arabic += roman[2].length * 100 + (roman[2][0] === 'D' ? 400 : 0);
        }
        if (roman[3] === 'XC') {
            arabic += 90;
        } else if (roman[3] === 'XL') {
            arabic += 40;
        } else {
            arabic += roman[3].length * 10 + (roman[3][0] === 'L' ? 40 : 0);
        }
        if (roman[4] === 'IX') {
            arabic += 9;
        } else if (roman[4] === 'IV') {
            arabic += 4;
        } else {
            arabic += roman[4].length * 1 + (roman[4][0] === 'V' ? 4 : 0);
        }
        return arabic;
    }
}
