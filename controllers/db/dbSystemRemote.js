const _ = require('lodash');
const Mongoose = require('mongoose');

var masterQueSchema = require('./models/masterQueSchema');
var remoteCommsSchema = require('./models/remoteCommsSchema');

var connString;
var DBSystemRemote = {};

//changing promises to bluebird
Mongoose.Promise = require('bluebird');

_.set(exports, 'connectSystemRemoteDB', function (host, database) {
	// console.log('REMOTE: ', host, database);
    connString = 'mongodb://DDCSUser:DCSDreamSim@' + host + ':27017/' + database + '?authSource=admin';
    DBSystemRemote =  Mongoose.createConnection(connString, { useNewUrlParser: true });
});

exports.masterQueActions = function (action, obj){
    const MasterQue = DBSystemRemote.model('masterque', masterQueSchema);
    if(action === 'create') {
        return new Promise(function(resolve, reject) {
            const server = new MasterQue(obj);
            server.save(function (err, servers) {
                if (err) { reject(err) }
                resolve(servers);
            });
        });
    }
    if(action === 'read') {
        return new Promise(function(resolve, reject) {
            MasterQue.find(obj, function (err, servers) {
                if (err) { reject(err) }
                resolve(servers);
            });
        });
    }
    if(action === 'update') {
        return new Promise(function(resolve, reject) {
            MasterQue.findOneAndUpdate(
                {_id: obj._id},
                {$set: obj},
                {new: true},
                function(err, servers) {
                    if (err) { reject(err) }
                    resolve(servers);
                }
            );
        });
    }
    if(action === 'delete') {
        return new Promise(function(resolve, reject) {
            MasterQue.findOneAndRemove({_id: obj._id}, function (err, servers) {
                if (err) { reject(err) }
                resolve(servers);
            });
        });
    }
};

exports.remoteCommsActions = function (action, obj){
    const RemoteComm = DBSystemRemote.model('remotecomms', remoteCommsSchema);
    if(action === 'create') {
        return new Promise(function(resolve, reject) {
            const server = new RemoteComm(obj);
            server.save(function (err, servers) {
                if (err) { reject(err) }
                resolve(servers);
            });
        });
    }
    if(action === 'read') {
        return new Promise(function(resolve, reject) {
            RemoteComm.find(obj, function (err, servers) {
                if (err) { reject(err) }
                resolve(servers);
            });
        });
    }
    if(action === 'update') {
        return new Promise(function(resolve, reject) {
        	// console.log('update: ', obj);
            RemoteComm.update(
                {_id: obj._id},
                {$set: obj},
                { upsert : true },
                function(err, servers) {
                    if (err) { reject(err) }
                    resolve(servers);
                }
            );
        });
    }
    if(action === 'delete') {
        return new Promise(function(resolve, reject) {
            RemoteComm.findOneAndRemove({_id: obj._id}, function (err, servers) {
                if (err) { reject(err) }
                resolve(servers);
            });
        });
    }
    if(action === 'removeNonCommPeople') {
        return new Promise(function(resolve, reject) {
            RemoteComm.remove(
                {
                    updatedAt: {
                        $lte: new Date(new Date().getTime() - (2 * 60 * 1000))
                    }
                },
                function(err, units) {
                    if (err) { reject(err) }
                    resolve(units);
                }
            );
        });
    }
};