const request = require('request')
const notifier = require('node-notifier')

class Watch {
    constructor (id, mode='normal', message='new msg from v2ex!'){
        this.baseTimes = undefined
        this.topicId = this.matchTopicId(id)
        this.options = {
            beeTimes: 50,
            mode: mode,
            loopInterval: 1000 * 10,
            message: message
        }
        this.requestOptions = {
            json: true,
            headers: {
                'User-Agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36`
            }
        }
    }

    async start() {
        this.authorId = await this.getAuthorId()
        
        this.check() // first check immediately
        this.loop = setInterval(this.check.bind(this), this.options.loopInterval)
    }

    matchTopicId(id) {
        const matNum = id.match(/^\d+$/)
        const matUrl = id.match(/^https?:\/\/www.v2ex.com\/t\/([0-9]+)#/)
        if (matNum) {
            // id = id
        } else if (matUrl) {
            id = matUrl[1]
        } else {
            throw new Error('Args wrong')
        }
        return id
    }

    async getAuthorId() {
        this.requestOptions.url = `https://www.v2ex.com/api/topics/show.json?id=${this.topicId}`
        return new Promise((resolve, reject)=> {
            request(this.requestOptions, (err, res, body)=> {
                if (body.length) {
                    resolve(body[0].member.id)
                } else {
                    reject(true)
                }
            })
        })
    }

    check() {
        this.requestOptions.url = `https://www.v2ex.com/api/replies/show.json?topic_id=${this.topicId}`,
        request(this.requestOptions, (err, res, body)=> {
            let times = body.length
            if (this.options.mode !== 'normal') {
                times = body.reduce((times, i) => {
                    if (i.member.id == this.authorId) {
                        times++
                    }
                    return times
                }, 0)
            }
            if (this.baseTimes !== undefined && times > this.baseTimes) {
                clearInterval(this.loop)
                this.alarm()
            } else {
                this.baseTimes = times
            }
            
        })
    }

    alarm() {
        this.bee()

        notifier.notify({
            title: 'New MSG',
            message: this.options.message,
            sound: true, // Only Notification Center or Windows Toasters
            wait: true // Wait with callback, until user action is taken against notification
        }, function (err, response) {
            // Response is response from notification
        });
        notifier.on('click', function (notifierObject, options) {
            // Triggers if `wait: true` and user clicks notification
        });
    }

    bee(times=this.options.beeTimes) {
        var count = 0
        var t = setInterval(function(){
            process.stdout.write("\x07")
            if (++count == times) clearInterval(t)
        }, 2 * 1000)
    }
}

// ** @params 
// ** id{Number} or url{String}
// ** mode{String}: 'normal' | 'author'
// ** message{String}
const watch = new Watch(...process.argv.slice(2))
watch.start()
