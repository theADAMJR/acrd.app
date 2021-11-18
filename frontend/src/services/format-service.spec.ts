import { given, test } from '@accord/ion';
import { FormatService } from './format-service';

describe('format-service', () => {
  let service: FormatService;
  
  const fn = <K extends keyof typeof service>(key: K): (typeof service)[K] => {
    service = new FormatService();

    return service[key].bind(service);
  };
  
  test(fn('toHTML'), () => {
    given('***').expect('***');
    given('**').expect('**');
    given('*').expect('*');
    given('_').expect('_');
    given('__').expect('__');
    given('__*').expect('__*');
    given('__**').expect('__**');
    given('__***').expect('__***');
    given('~~').expect('~~');
    given('`').expect('`');
    given('```').expect('```');
    given('***bold and italic***').expect('***<strong><em>bold and italic</em></strong>***');
    given('**just bold**').expect('**<strong>just bold</strong>**');
    given('*italic plz*').expect('*<em>italic plz</em>*');
    given('_italic again plz_').expect('_<em>italic again plz</em>_');
    given('__only underline__').expect('__<u>only underline</u>__');
    given('__*underline + italics*__').expect('__*<u><em>underline + italics</em></u>*__');
    given('__**underline and bold**__').expect('__**<u><strong>underline and bold</strong></u>**__');
    given('__***underline, bold, and italic***__').expect('__***<u><strong><em>underline, bold, and italic</em></strong></u>***___');
    given('~~strikethru~~').expect('~~<del>strikethru</del>~~');
    given('```given(tests).expect(`no bugs plz`)```**```').expect('```<pre><code>given(tests).expect(`no bugs plz`)</code></pre>```');
    given('```# **Epic** *__Markdown__* ~~Guide~~```').expect('```<pre><code># **Epic** *__Markdown__* ~~Guide~~</code></pre>```');
    given('`delete global.bugs;`').expect('`<code>delete global.bugs;</code>`');
    given('`cool_function("*hi*");`').expect('`<code>cool_function("*hi*");</code>`');
  });
});