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

  add(pathOrRoute: string | Route, handler: RouteHandler<T>) {
    const route = typeof pathOrRoute === 'string' ? new Route(pathOrRoute, this.options) : pathOrRoute;
    this.entries.push({route, handler});
    return route;
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
