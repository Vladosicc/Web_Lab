const { json, text } = require("body-parser");
const file = require('./fromBotforLab.json')
const fs = require('fs');
const { loadavg } = require("os");

const router = app => {
    app.get('/', (request, response) => {
        response.writeHead(200, {'Content-Type': 'text/html'});
        var myReadStream = fs.createReadStream(__dirname +'/info/index.html', 'utf8');
        myReadStream.pipe(response);
    });

    app.get('/dis', (request, response) => {
        response.send(file);
        console.log(file);
    });

    app.get('/dis/:UserId', (request, response) => {
    try
    {
        var index = file.data.findIndex(i => i.UserId == request.params.UserId);
        if(index == -1)
        {
            var resp = {data:[]};
            response.status(200).send(resp);
            return;
        }
        var resp = {data:[file.data[index]]};
        response.status(200).send(resp);
    }
    catch
    {
        response.status(400).send("er");
    }
    });

    app.post('/dis', (request, response) => {
        try
        {
            var item = {UserId:parseInt(request.body.UserId), NickName:request.body.NickName, GuildName:request.body.GuildName, IsBot:parseBool(request.body.IsBot), AvatarUrl:request.body.AvatarUrl};
            if(file.data.findIndex(i => i.UserId == item.UserId) != -1)
            {
                response.status(400).send("id already exists");
                return;
            }
            file.data.push(item);    
            pushToJson();
            response.status(201).send('User added');
        }
        catch
        {
            response.send("error");
        }
    });

    app.put('/dis/:UserId', (request, response) => {
        try
        {
            var item = {UserId:parseInt(request.body.UserId), NickName:request.body.NickName, GuildName:request.body.GuildName, IsBot:parseBool(request.body.IsBot), AvatarUrl:request.body.AvatarUrl};
            var UserId = parseInt(request.params.UserId);
            var index = file.data.findIndex(i => i.UserId == UserId);
            if(index == -1)
            {
                response.status(400).send("id not founded");
                return;
            }
            file.data[file.data.findIndex(i => i.UserId == UserId)] = item;
            pushToJson();
            response.send("PUT ok");
        }
        catch
        {
            response.send("error");
        }
    });

    app.delete('/dis/:UserId', (request, response) => {
        try
        {
            var UserId = parseInt(request.params.UserId);
            var index = file.data.findIndex(i => i.UserId == UserId);
            if(index == -1)
            {
                response.status(400).send("id not founded");
                return;
            }
            file.data.splice(index,1);
            pushToJson();
            response.send("DELETE ok");
        }
        catch
        {
            response.send("error");
        }
    });

    app.get('/get', (request, response) => {
        response.writeHead(200, {'Content-Type': 'text/html'});
        var myReadStream = fs.createReadStream(__dirname +'/info/get.html', 'utf8');
        myReadStream.pipe(response);
    });

    app.get('/post', (request, response) => {
        response.writeHead(200, {'Content-Type': 'text/html'});
        var myReadStream = fs.createReadStream(__dirname +'/info/post.html', 'utf8');
        myReadStream.pipe(response);
    });

    app.get('/put', (request, response) => {
        response.writeHead(200, {'Content-Type': 'text/html'});
        var myReadStream = fs.createReadStream(__dirname + '/info/put.html', 'utf8');
        myReadStream.pipe(response);
    });

    app.get('/delete', (request, response) => {
        response.writeHead(200, {'Content-Type': 'text/html'});
        var myReadStream = fs.createReadStream(__dirname +'/info/delete.html', 'utf8');
        myReadStream.pipe(response);
    });
}

// Export the router
module.exports = router;

function parseBool (str){
    if(str == "false")
        return false;
    if(str == "true")
        return true;
    return false;
}

function pushToJson ()
{
    fs.writeFile('./routes/fromBotforLab.json', JSON.stringify(file), function(err) {
        if (err) {
        console.log(err);
        }
    });
}