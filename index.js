const request = require('request')
const notifier = require('node-notifier')

class Watch {
    constructor (url, limit){
        this.url = url
        this.limit = limit
        this.apparentTimes = undefined
        this.beeTimes = 50
        this.options = {
            url: this.url,
            headers: {
                'User-Agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36`
            }
        }
    }

    start() {
        this.check() // first check immediate
        this.loop = setInterval(this.check.bind(this), 10 * 1000)
    }

    check() {
        request(this.options, (err, res, body)=> {
            const arr = JSON.parse(body)
            const times = arr.reduce((times, i) => {
                if (i.member.id == 64982) {
                    times++
                }
                return times
            }, 0)

            if (this.apparentTimes !== undefined && times > this.apparentTimes) {
                clearInterval(this.loop)
                this.alarm()
            } else {
                this.apparentTimes = times
            }
        })
    }

    alarm() {
        this.bee(this.beeTimes)

        notifier.notify({
            title: 'New MSG',
            message: 'new msg from v2ex!',
            sound: true, // Only Notification Center or Windows Toasters
            wait: true // Wait with callback, until user action is taken against notification
        }, function (err, response) {
            console.log("OK!!!")
            // Response is response from notification
        });
        notifier.on('click', function (notifierObject, options) {
            console.log("click!!!")

            // Triggers if `wait: true` and user clicks notification
        });
    }

    bee(times) {
        var count = 0
        var t = setInterval(function(){
            process.stdout.write("\x07")
            if (++count == times) clearInterval(t)
        }, 2 * 1000)

    }


}
const watch = new Watch('https://www.v2ex.com/api/replies/show.json?topic_id=330589')
watch.start()
