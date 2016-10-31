# redismonitor
`It is a redis monitor browser`

## Usage:
```
1.cd node_modules\redismonitor
2.node index.js --redisIp=<redisIp> --redisPort=<redisPort> //default value for redisIp and redisPort are localhost and 6379
3.open your browser and go to localhost:9999
```

## Note
```
Currently the page only monitor the longest output buffer and memory,
Let me know if you want more, I will make it configurable later.
Right Now, If you want to add more, what you could do is:
1.add a div in public/index.html, for example:
        <div id="more" style="height: 600px;margin-top:20px;width: 600px"></div>
2.add in bottom of READY function in public/js/update.js as below:
        genChart( 'more', 'cpu', 'used_cpu_sys' )
  where cpu is the name for the chart, and used_cpu_sys is the field you wanna monitor, you could find this in 'redis-cli info'
```

## Example
![redismointor](./example/redismonitor.jpg)
# Enjoy