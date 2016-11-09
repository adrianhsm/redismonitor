const exec = require('child_process').exec
const pj = require('path').join
const express = require('express')
const argv = require('minimist')(process.argv.slice(2))

const port = argv['port'] || 8888
const redisIp = argv['redisIp'] || 'localhost'
const redisPort = argv['redisPort'] || 6379
const redisInfo = {}
const app = express()

const checkRedisPromise = new Promise((resolve,reject)=>{
    const proc = exec('redis-cli ping', (err, stdout,stderr)=>{
        if(err){
            console.log('error')
            reject(err)
            return;
        }
        resolve(stdout.toString().trim())
    })
})



var monitorFn = null

const getRedisMonitorFn = (redisIp,redisPort)=>{
    return ()=>{
        const proc = exec('redis-cli info', (err, stdout,stderr)=>{
            if(err){
                return;
            }
            const data = stdout.toString()
            redisInfo[ 'time' ] = (new Date()).getTime() 
            data.split(/\r{0,1}\n/).forEach((line)=>{
                const kv = line.trim().split(/:/)
                if( kv.length == 2 ){
                    redisInfo[ kv[0] ] = kv[1]
                }
            })
            
        })
    }
}

app.use(express.static(pj(__dirname , 'public')));

app.get('/info', (req, res)=>{
    res.write( JSON.stringify(redisInfo) )
    res.end()
})

require('http').createServer(app).listen(port, ()=>{
    checkRedisPromise.then((data)=>{
       if( data !== 'PONG' ){
            console.log('redis could be in error' )
            console.log('please restart server after you rectify redis' )
       } else {
           console.log('start to monitor redis')
           monitorFn = getRedisMonitorFn( redisIp, redisPort )
       }
    },(err)=>{
        console.log('redis errr : ', err )
        console.log('please restart server after you rectify redis' )
    })
    console.log("Server start on ", port)
})

setInterval(()=>{
    if( monitorFn!=null ){
        monitorFn()
    }
}, 1000 )
