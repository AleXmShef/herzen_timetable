const axios = require('axios');

const getGlobal = async function() {
    return await axios.get('https://guide.herzen.spb.ru/static/schedule.php');
}

const getGroups = async function(groupURLs) {
    let requests = [];
    groupURLs.forEach(URL => {
        requests.push(axios.get('https://guide.herzen.spb.ru' + URL));
    })
    return await axios.all(requests);
}

module.exports = {
    getGlobal,
    getGroups
}