const { json, text } = require("body-parser");
const file = require('./fromBotforLab.json')
const fs = require('fs');
const { loadavg } = require("os");
const CryptoJS = require("crypto-js");
const { request, response } = require("express");
const key = "v228322v";

module.exports = function(app, mongoClient)  {
    const authsession = (request, response, next) => {
        var id = new require('mongodb').ObjectID(request.session.user);
        mongoClient.db("stankin_web").collection("users").findOne({_id: id}, function(err, user){
            if (err) { 
                return next();
            } else {
                if(user != null)
                {
                    request.user = {name: user.name, avatar: user.avatar, email: user.email, about: user.about}; return next();
                }
                else
                {
                    request.user = null; return next();
                }
            }
        });
    };

    //Регистрация
    app.post('/signup', (request, response) => {
        mongoClient.db("stankin_web").collection("users").findOne({email: request.body.email}, function(err, user){
            if(err) return console.log(err);
            if(user) {
                response.send({status: 400, message: "User already exist"});
                console.log(user); 
                return;
            }
            if(request.body.password.length < 8)
                return response.send({status: 400, message: "Bad password"});
            var user = {
                email: request.body.email,
                password: CryptoJS.AES.encrypt(request.body.password, key).toString(),
                name: request.body.name,
                avatar: "https://media.discordapp.net/attachments/799287181508083724/839581417242361906/unknown.png?width=499&height=499",
                about:""
            };
            mongoClient.db("stankin_web").collection("users").insertOne(user, (err, result) => {
                if (err) { 
                    response.send({ 'error': 'An error has occurred' }); 
                } else {
                    request.session.user = result.ops[0]._id;
                    console.log(result.ops[0]._id);
                    response.send({status: 200, redirect: 'http://localhost:3000/myprofile'});
                }
            });
        });
    });

    //Логин
    app.post('/signin', (request, response) => {
        mongoClient.db("stankin_web").collection("users").findOne({email: request.body.email}, function(err, user){
            if(err) return console.log(err);
            if(user != null) 
            {
                var bytes  = CryptoJS.AES.decrypt(user.password, key);
                var originalpass = bytes.toString(CryptoJS.enc.Utf8);
                if(originalpass == request.body.password)
                {
                    request.session.user = user._id;
                    response.send({status: 200, redirect: 'http://localhost:3000/myprofile'});
                    return;
                }
                response.send({status: 400, message: "Bad password or email"});
                return;
            }
            else
            {
                response.send({status: 400, message: "Bad password or email"});
                return;
            }
        });
    });    

    //Смена пароля
    app.post('/changepassword', (request, response) => {
        var id = new require('mongodb').ObjectID(request.session.user);
        mongoClient.db("stankin_web").collection("users").findOne({_id: id}, function(err, user){
            if(err) return console.log(err);
            if(user != null) 
            {
                var bytes  = CryptoJS.AES.decrypt(user.password, key);
                var originalpass = bytes.toString(CryptoJS.enc.Utf8);
                if(originalpass == request.body.oldpassword)
                {
                    if(request.body.newpassword.length < 8)
                    {
                        response.send({status: 400, message: "Bad new password"});
                        return;
                    }
                    // create a filter
                    var filter = { _id: id};
                    // this option instructs the method to create a document if no documents match the filter
                    var options = { upsert: false };
                    // create a document that sets
                    const updateDoc = {
                    $set: {
                            password: CryptoJS.AES.encrypt(request.body.newpassword, key).toString()
                        },
                    };
                    mongoClient.db("stankin_web").collection("users").updateOne(filter, updateDoc, options).then(
                        result => {
                          console.log("Пароль изменен"); // result - аргумент resolve
                          request.session.destroy();
                          response.send({status: 200, redirect: 'http://localhost:3000/'});
                        },
                        error => {
                          // вторая функция - запустится при вызове reject
                          console.log(error); // error - аргумент reject
                          response.send({status: 400, message: error});
                        }
                      );
                    
                    return;
                }
                else{
                    response.send({status: 400, message: "Bad password"});
                    return;
                }
            }
            else
            {
                response.send({status: 400, message: "Error"});
                return;
            }
        });
    });  
    
    //Смена Имени
    app.post('/changename', (request, response) => {
        var id = new require('mongodb').ObjectID(request.session.user);
        // create a filter
        var filter = { _id: id};
        // this option instructs the method to create a document if no documents match the filter
        var options = { upsert: false };
        // create a document that sets
        const updateDoc = {
        $set: {
            name: request.body.newname
            },
        };
        mongoClient.db("stankin_web").collection("users").updateOne(filter, updateDoc, options).then(
            result => {
                console.log("Имя изменено"); // result - аргумент resolve
            },
            error => {
                // вторая функция - запустится при вызове reject
                console.log(error); // error - аргумент reject
            }
        );
    });   

    //Смена О себе
    app.post('/changeabout', (request, response) => {
        console.log(request.body);
        var id = new require('mongodb').ObjectID(request.session.user);
        // create a filter
        var filter = { _id: id};
        // this option instructs the method to create a document if no documents match the filter
        var options = { upsert: false };
        // create a document that sets
        const updateDoc = {
        $set: {
            about: request.body.newabout
            },
        };
        mongoClient.db("stankin_web").collection("users").updateOne(filter, updateDoc, options).then(
            result => {
                console.log("О себе изменено"); // result - аргумент resolve
            },
            error => {
                // вторая функция - запустится при вызове reject
                console.log(error); // error - аргумент reject
            }
        );
    }); 
    
    //Смена аватарки
    app.post('/changeavatar', (request, response) => {
        console.log(request.body);
        var id = new require('mongodb').ObjectID(request.session.user);
        // create a filter
        var filter = { _id: id};
        // this option instructs the method to create a document if no documents match the filter
        var options = { upsert: false };
        // create a document that sets
        const updateDoc = {
        $set: {
            avatar: request.body.newavatar
            },
        };
        mongoClient.db("stankin_web").collection("users").updateOne(filter, updateDoc, options).then(
            result => {
                console.log("Аватар изменен"); // result - аргумент resolve
            },
            error => {
                // вторая функция - запустится при вызове reject
                console.log(error); // error - аргумент reject
            }
        );
    });    

    app.get('/',authsession, (request, response) => {
        console.log(request.user);
        response.render('./views/pages/index.ejs', {user: request.user});
    });

    app.get('/test',authsession, (request, response) => {
        console.log(request.user);
        response.render('./views/pages/test.ejs', {user: request.user});
    });

    app.get('/dis', (request, response) => {
        console.log(request.session.user);
        response.send(file);
    });

    app.get('/registration', authsession, (request, response) => {
        console.log(request.user);
        response.render('./views/pages/registration.ejs', {user: request.user});
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

    app.get('/logout', authsession, (request, response) => {
        request.session.destroy();
        response.redirect("/");
    });

    app.get('/myprofile', authsession, (request, response) => {
        console.log(request.user);
        response.render('./views/pages/myprofile.ejs', {user: request.user});
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
        console.log(request.user);
        response.render('./views/pages/get.ejs', {user: request.user});
    });

    app.get('/post', (request, response) => {
        console.log(request.user);
        response.render('./views/pages/post.ejs', {user: request.user});
    });

    app.get('/put', (request, response) => {
        console.log(request.user);
        response.render('./views/pages/put.ejs', {user: request.user});
    });

    app.get('/delete', (request, response) => {
        console.log(request.user);
        response.render('./views/pages/delete.ejs', {user: request.user});
    });
}

// Export the router
//module.exports = router;

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