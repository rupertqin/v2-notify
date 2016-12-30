## set up a notify for a topic of [V2ex](https://www.v2ex.com), **both system alarms and sounds**

![alarm](https://github.com/rupertqin/v2-notify/blob/master/alarm.png)

## install 

    npm install

## Usage

    node index.js {url/topic_id} {normal/author} --harmony_async_await

#### example

    node index.js 330589
    node index.js https://www.v2ex.com/t/330589#reply404 author

## Options

#### normal

  the default mode, if a new apply have come, it alarms

#### author

  in this mode, only alarms when that topic's author replies. 

## Resources

[V2EX API](https://github.com/djyde/V2EX-API)
