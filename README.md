# evscript - a language grammar for highlight.js

![license](https://badgen.net/badge/license/MPL-2.0/blue)

## Usage

Simply include the Highlight.js library in your webpage or Node app, then load this module.

### Static website or simple usage

Simply load the module after loading Highlight.js.  You'll use the minified version found in the `dist` directory.  This module is just a CDN build of the language, so it will register itself as the Javascript is loaded.

```html
<script type="text/javascript" src="/path/to/highlight.min.js"></script>
<script type="text/javascript" src="/path/to/evscript.min.js"></script>
<script type="text/javascript">
  hljs.highlightAll();
</script>
```

## License

This syntax is released under the Mozilla Public License 2.0. See [LICENSE][1] for details.

### Author

Eldred HABERT <https://eldred.fr/>

## Links

- The official site for the Highlight.js library is <https://highlightjs.org/>.
- The Highlight.js GitHub project: <https://github.com/highlightjs/highlight.js>

[1]: https://github.com/ISSOtm/highlightjs-evscript/blob/master/LICENSE
