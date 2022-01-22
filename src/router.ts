import {Route, RouteOptions} from './route';

export type RouteHandler<T> = (params: Record<string, string | number>, data?: T) => any | Promise<any>;

interface RouteEntry<T> {
  route: Route;
  handler: RouteHandler<T>;
}

export interface RouterOptions extends RouteOptions {}

export class Router<T> {
  readonly options: RouteOptions;
  readonly entries: RouteEntry<T>[] = [];

  constructor(options?: RouterOptions) {
    this.options = options ?? {};
  }

  add(path: string, handler: RouteHandler<T>) {
    this.entries.push({
      route: new Route(path, this.options),
      handler,
    });
  }

  async handle(path: string, data?: T) {
    for (const {route, handler} of this.entries) {
      const params = route.match(path);
      if (params) {
        await handler(params, data);
      }
    }
  }
}
