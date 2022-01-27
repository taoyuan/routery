import {AmqpTopic, MqttTopic, Route} from '../route';

describe('Route', function () {
  describe.each([
    ['amqp', AmqpTopic],
    ['mqtt', MqttTopic],
  ])('%s topic - compile', (name, opts) => {
    it('should compile path without params', function () {
      const route = new Route('$foo/bar', opts);
      expect(route.topic).toEqual(`$foo/bar`);
    });

    it('should compile `:other*`', function () {
      const route = new Route('$foo/:user/:others*', opts);
      expect(route.topic).toEqual(`$foo/${opts.single}/${opts.multiple}`);
    });

    it('should compile `:other(.*)`', function () {
      const route = new Route('$foo/:user/:others(.*)', opts);
      expect(route.topic).toEqual(`$foo/${opts.single}/${opts.multiple}`);
    });

    it('should have nothing to do with separators', function () {
      const route = new Route('$foo/:user.:others*', opts);
      expect(route.topic).toEqual(`$foo/${opts.single}.${opts.multiple}`);
    });
  });
});
