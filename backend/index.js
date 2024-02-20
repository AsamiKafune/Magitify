const yts = require("yt-search")
const fastify = require("fastify")({ logger: false })
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs")
const ytdl = require('ytdl-core');

fastify.options('*', function (request, reply) {
    reply.send()
})

fastify.addHook('onSend', function (request, reply, payload, next) {
    reply.header('Access-Control-Allow-Origin', '*')
    reply.header('Access-Control-Allow-Headers', '*')
    next()
})

const io = new Server(fastify.server, {
    cors: {
        origin: "*"
    }
});

let channel = []
io.on('connection', (socket) => {
    console.log(`${socket.id} is connected`);

    socket.on('disconnect', () => {
        console.log(`${socket.id} is disconnected`);
    });

    socket.on('create', function (data) {
        console.log("[Create]: ", data, { "socketId": socket.id })
        socket.join(data.invitecode);

        data.users.push({
            name: data.name,
            uid: socket.id,
            isOwner: true
        })

        if (!channel.find(e => e.invitecode == data.invitecode)) {
            channel.push({
                invitecode: data.invitecode,
                owner: socket.id,
                users: data.users
            })
            io.sockets.in(data.invitecode)
                .emit('create_info', { yourid: socket.id });
        } else {
            io.sockets.in(data.invitecode)
                .emit('action', { value: "reload", code: 0, msg: "fail to create room!" });
        }
    })
    socket.on('join', function (data) {
        console.log("[UserJoin]: ", data, { "socketId": socket.id })
        if (!channel.find(e => e.invitecode == data.invitecode)) {
            return io.sockets.in(data.invitecode)
                .emit('action', { value: "reload", code: 0, msg: "room not found!" });
        }
        socket.join(data.invitecode);
        (channel.find(e => e.invitecode == data.invitecode)).users.push({
            name: data.name,
            uid: socket.id,
            isOwner: false
        })
        io.sockets.in(data.invitecode)
            .emit('join_info', { yourid: socket.id, users: channel.find(e => e.invitecode == data.invitecode).users });
    })

    socket.on('send', (data) => {
        let isOwner = false;
        let _ch = channel.find(e => e.invitecode == data.invitecode)
        if (_ch && _ch.owner == socket.id) {
            isOwner = true;
        }
        io.sockets.in(data.invitecode).emit('message', { uid: socket.id, isOwner: isOwner, data: data.data });
    });
});

io.of("/").adapter.on("leave-room", (room, socketId) => {
    if (room == socketId) return;
    if (channel.find(e => e.owner == socketId)) {
        io.sockets.in(room).emit('leave_info', { uid: socketId, destory: true });
        channel = channel.filter(e => e.owner != socketId)
    } else {
        let x = channel.find(e => e.invitecode == room)
        if (x && x?.users) x.users = x.users.filter(e => e.uid != socketId)
        if (x && x?.users) io.sockets.in(room).emit('leave_info', { uid: socketId, destory: false, users: channel.find(e => e.invitecode == room).users });
    }
});

fastify.register(require('@fastify/static'), {
    root: path.join(process.cwd(), 'music'),
    prefix: '/music/'
})

fastify.get("/", (req, res) => {
    return { msg: "Magitify Api - Coding by Kafune Ch.", code: 1 }
})

fastify.get("/checkroom/:id", async (req, res) => {
    const { id } = req.params
    if (!channel.find(e => e.invitecode == id)) {
        return res.send({
            code: 0
        })
    } else {
        return {
            code: 1
        }
    }
})

fastify.get("/search", async (req, res) => {
    const { q } = await req.query
    if (!q) return { code: 0, data: [], msg: "value not found!" }

    const cachefile = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'search_cache.json')))
    let history = cachefile.find(e => e.q == q)
    if (history) return res.send({
        code: 1, data: history.data
    })

    //search!
    let r = (await yts(q)).videos
    r = r.filter(e => convertTime(e.timestamp) < 1.01)
    let _data = []
    for (let _ = 0; _ < r.length; _++) {
        _data.push({
            author: r[_].author,
            title: r[_].title,
            url: r[_].url,
            img: r[_].image ?? r[_].thumbnail,
            long: r[_].timestamp,
            id: r[_].videoId
        })
    }

    if (_data.length > 0) {
        cachefile.push({
            q: q,
            data: _data
        })
        fs.writeFileSync(path.join(process.cwd(), "search_cache.json"), JSON.stringify(cachefile))
        return res.send({
            code: 1, data: _data
        })
    }

    return res.send({
        code: 0, data: [], msg: "value not found!"
    })
})

fastify.post("/getsong", async (req, res) => {
    const { song } = req.body
    console.log("[SongRequest]: ", song)
    return await cacheSong(song)
})

fastify.get("/allchannel", async (req, res) => {
    return res.send({ code: 1, data: channel.map(e => {
        return {
            invitecode: e.invitecode,
            users: e.users.length
        }
    }) })
})

fastify.listen({ port: 3011, host: "0.0.0.0" })
    .then(() => console.log("Magitify WebApi - Coding by Kafune Ch. | server has running!"))

function cacheSong(song) {
    return new Promise(async (resolve, reject) => {
        const _library = getsongLibrary()
        const find_song = _library.find(e => e.id == song.id)
        let filePath = path.join(process.cwd(), 'music/' + song.id + '.mp3')
        if (find_song) {
            const cachesong = fs.readdirSync(path.join(process.cwd(), 'music'))
            if (cachesong.find(e => e == song.id + ".mp3")) {
                fs.stat(filePath, (err, stats) => {
                    if (err) {
                      console.error(err);
                      return;
                    }
                  
                    const fileSize = stats.size;
                  
                    if (fileSize <= 0) {
                      // ลบไฟล์
                      fs.unlink(filePath, (err) => {
                        if (err) {
                          console.error(err);
                          return;
                        }
                  
                        console.log("File deleted successfully!");
                      });
                    } else {
                      console.log("File size is not 0 bytes.");
                    }
                  });
                resolve({
                    code: 1,
                    data: find_song
                })
            } else {
                console.log("file got broke redownload... wait a moment")

                let _temp = getsongLibrary()
                _temp = _temp.filter(e => e.id != song.id)
                fs.writeFileSync(path.join(process.cwd(), "library.json"), JSON.stringify(_temp))
                return resolve(await syncmusic(_temp, song))
            }
        } else {
            let _temp = getsongLibrary()
            return resolve(await syncmusic(_temp, song))
        }
    });
}

function syncmusic(_temp, song) {
    return new Promise((resolve, reject) => {
        _temp.push({
            "canplay": false,
            title: song.title,
            url: song.url,
            id: song.id
        })
        fs.writeFileSync(path.join(process.cwd(), "library.json"), JSON.stringify(_temp))
    
        const _vid = ytdl(song.url, {
            quality: '140',
            filter: format => format.container === 'mp4'
        })
    
        _vid.on('progress', (chunkLength, received, total) => {
            const percent = (received / total) * 100;
            console.log(`[WARN] Cache ${song.title}: ${percent.toFixed(2)}%`);
        });
    
        _vid.pipe(fs.createWriteStream(path.join(process.cwd(), 'music/' + song.id + '.mp3')))
            .on('finish', () => {
                const editLibrary = getsongLibrary()
                const _rawData = editLibrary.find(e => e.id == song.id)
                if (_rawData) {
                    _rawData.canplay = true
                    fs.writeFileSync(path.join(process.cwd(), "library.json"), JSON.stringify(editLibrary))
    
                    return resolve({
                        code: 1,
                        data: _rawData
                    })
                } else {
                    console.log("error can't find")
                    return resolve({
                        code: 0,
                        error: "can't find"
                    })
                }
            })
            .on('error', (err) => {
                console.error(`Error cache: ${song.title}:`, err);
                return resolve({
                    code: 0,
                    error: `Error cache: ${song.title}`,
                })
            });
    })
}

function getsongLibrary() {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'library.json')))
}

function convertTime(value) {
    const timeString = value;
    const timeArray = timeString.split(':');

    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if (timeArray.length === 3) {
        hours = parseInt(timeArray[0], 10);
        minutes = parseInt(timeArray[1], 10);
        seconds = parseInt(timeArray[2], 10);
    } else if (timeArray.length === 2) {
        minutes = parseInt(timeArray[0], 10);
        seconds = parseInt(timeArray[1], 10);
    } else if (timeArray.length === 1) {
        seconds = parseInt(timeArray[0], 10);
    } else {
        console.error('Invalid time format');
        return;
    }

    const totalHours = hours + minutes / 60 + seconds / 3600;

    return totalHours
}

process.on('unhandledRejection', (reason, p) => {
})
process.on("uncaughtException", (err, origin) => {
    console.log('=== uncaught Exception ==='.toUpperCase());
    console.log('Origin: ', origin, 'Exception: ', err.stack ? err.stack : err)
    console.log('=== uncaught Exception ==='.toUpperCase());
})
process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log('=== uncaught Exception Monitor ==='.toUpperCase());
    console.log('Origin: ', origin, 'Exception: ', err.stack ? err.stack : err)
    console.log('=== uncaught Exception Monitor ==='.toUpperCase());
});
process.on('beforeExit', (code) => {
    console.log('=== before Exit ==='.toUpperCase());
    console.log('Code: ', code);
    console.log('=== before Exit ==='.toUpperCase());
});
process.on('exit', (code) => {
    console.log('=== exit ==='.toUpperCase());
    console.log('Code: ', code);
    console.log('=== exit ==='.toUpperCase());
});
process.on('multipleResolves', (type, promise, reason) => {
});