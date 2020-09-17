const axios = require('axios');

const getGlobal = async function() {
    return await axios.get('https://guide.herzen.spb.ru/static/schedule.php');
}

const getGroups = async function(groupURLs) {
    let requests = [];
    const instance = axios.create({timeout: 100000});
    groupURLs.forEach(URL => {
        requests.push(instance.get('https://guide.herzen.spb.ru' + URL));
    })
    return await axios.all(requests);
}

const getGroup = async function(groupURL) {
    return await axios.get('https://guide.herzen.spb.ru' + groupURL);
}

module.exports = {
    getGlobal,
    getGroups,
    getGroup
}