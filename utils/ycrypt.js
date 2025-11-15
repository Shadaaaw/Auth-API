const bcrypt = require('bcrypt');

function check(password, userPassword){
    return bcrypt.compare(password, userPassword);
}

function hash(password){
    return bcrypt.hash(password, 12);
}

module.exports = {
    check,
    hash
}