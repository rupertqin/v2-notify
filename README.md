## set up a notify for a topic of [V2ex](https://www.v2ex.com)


## install 

    npm install

## Usage

    node index.js {url/topic_id} {normal/author}

#### example

    node index.js 330589
    node index.js https://www.v2ex.com/t/330589#reply404 author

## Options

#### normal

  the default mode, if a new apply have come, it alarms

#### author

  in this mode, only alarms when that topic's author replies. 