const axios = require('axios');

const getGlobal = async function() {
    return await axios.get('https://guide.herzen.spb.ru/static/schedule.php');
}

const getGroup = async function(groupURL) {
    return await axios.get('https://guide.herzen.spb.ru' + groupURL);
}

module.exports = {
    getGlobal,
    getGroup
}