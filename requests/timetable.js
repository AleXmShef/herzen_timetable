const axios = require('axios');

const getGlobal = async function() {
    return await axios.get('https://guide.herzen.spb.ru/static/schedule.php');
}

const getGroups = async function(groupURLs) {
    let requests = [];
    const instance = axios.create({timeout: 100000});
    let iterator = 1;
    groupURLs.forEach(URL => {
        if(requests.length > iterator * 12) {
            let time = Date.now() + 4000;
            while(Date.now() < time) {

            }
            iterator++;
        }
        requests.push(instance.get('https://guide.herzen.spb.ru' + URL, {
            headers: {
                host: 'guide.herzen.spb.ru'
            }
        }));
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