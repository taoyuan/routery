import {PathMatcher} from 'pathor';
import {PathMatcherOptions} from 'pathor/src';

const topicRe = /:([a-z]\w*)(\((.*?)\))?([?*+])?/gi;

export interface TopicOptions {
  /**
   * Single Level Wildcard
   */
  single?: string;
  /**
   * Multiple Level Wildcard
   */
  multiple?: string;
}

export type RouteOptions = TopicOptions & PathMatcherOptions;

export const AmqpTopic: RouteOptions & Required<TopicOptions> = {
  single: '*',
  multiple: '#',
  separators: '.',
};

export const MqttTopic: RouteOptions & Required<TopicOptions> = {
  single: '+',
  multiple: '#',
  separators: '/',
};

export class Route {
  readonly path: string;
  readonly options: RouteOptions & Required<TopicOptions>;
  readonly matcher: PathMatcher;

  constructor(path: string, options?: RouteOptions) {
    this.path = path;
    this.options = {
      ...MqttTopic,
      ...options,
    };
    this.matcher = new PathMatcher(path);
    this.compile(path);
  }

  protected _topic: string;

  get topic() {
    return this._topic;
  }

  match(path: string) {
    return this.matcher.match(path);
  }

  protected compile(path: string) {
    this._topic = path.replace(topicRe, (str, key, a, pat, quant /*, index, string*/) => {
      // console.log("-----------------------------");
      // console.log({str, key, a, pat, quant, index, string});
      const isMultiple = quant === '*' || quant === '+' || pat === '.*';
      return isMultiple ? this.options.multiple : this.options.single;
    });
  }
}

// (() => {
//   console.log(new Route('$foo/:user/:others*'));
//   console.log(new Route('$foo/:user/:others(.*)'));
// })();
