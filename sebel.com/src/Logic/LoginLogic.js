export const LoginLogic = {
    _isValidEmail: (email) => email && email.endsWith('@gmail.com'),
    _isValidPassword: (password) => password && password.length > 8,
    _isValidNIS: (nis) => /^[0-9]+$/.test(nis?.toString() || ''),

    Guru(email, password) {
        const isEmailValid = this._isValidEmail(email);
        const isPasswordValid = this._isValidPassword(password);
        return {
            success: isEmailValid && isPasswordValid,
            errorMsg: !isEmailValid ? "Email harus berakhiran @gmail.com" : 
                    !isPasswordValid ? "Password harus lebih dari 8 karakter" : null
        };
    },

    Siswa(nis, password) {
        const isNisValid = this._isValidNIS(nis);
        const isPasswordValid = this._isValidPassword(password);
        return {
            success: isNisValid && isPasswordValid,
            errorMsg: !isNisValid ? "NIS harus berupa angka murni" : 
                    !isPasswordValid ? "Password harus lebih dari 8 karakter" : null
        };
    }
};