import {Router} from '../router';
import {noop} from './support';
import {Route} from '../route';
import {defer} from '@jil/common/async/defer';

describe('Router', function () {
  it('should add a route with default options', function () {
    const router = new Router();
    router.add('$foo/:a/:b', noop);
    expect(router.entries).toHaveLength(1);
    const {route, handler} = router.entries[0];
    expect(handler).toBe(noop);
    expect(route).toBeInstanceOf(Route);
  });

  it('should add a route with custom options', function () {
    const router = new Router({separators: ',./'});
    router.add('$foo/:a/:b', noop);
    expect(router.options.separators).toEqual(',./');
    expect(router.entries).toHaveLength(1);
    const {route, handler} = router.entries[0];
    expect(handler).toBe(noop);
    expect(route.options.separators).toEqual(route.options.separators);
  });

  it(`should handle matched path`, async () => {
    const d = defer();
    const router = new Router<string>();

    router.add('$foo/a/:bar', () => {
      d.reject('should not matched');
    });

    router.add('$foo/b/:bar', (params, data) => {
      expect(params).toEqual({bar: 'hello'});
      expect(data).toEqual('world');
      d.resolve();
    });

    await router.handle('$foo/b/hello', 'world');
    await d;
  });
});
