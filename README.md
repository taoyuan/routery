# routery

> A router that uses [pathor](https://github.com/taoyuan/pathor) to match and parse parametric URLs

## Installation

```shell
npm i routery
```

## Usage

```ts
import {Router} from 'routery';

// `Message` is an example type of custome data
const router = new Router<Message>({
  // Below is default options, if it match your situation, just let options empty.
  single: '+', // single level wildcard for topic compiling
  multiple: '#', // multi level wildcard for topic compiling
  separators: '/', // path seperator for URL matching
});

// path style see: https://github.com/taoyuan/pathor
router.add('/a/:b/:others*', (params: Record<string, any>, data: Message) => {
  console.log(params);
  // =>
  // {
  //   b: 'foo',
  //   others: ['bar', 'hello'],
  // }
  console.log(data);
  // => message
  // {...}
});

// ...

router.handle('/a/foo/bar/hello', message);
```

`path` format see [pathor](https://github.com/taoyuan/pathor)

## Builtin Topic Options

### MQTT (default)

```ts
import {MqttTopic} from "routery";

new Router(MqttTopic);
```

### AMQP

```ts
import {AmqpTopic} from "routery";

new Router(AmqpTopic);
```
