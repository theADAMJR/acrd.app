import { given, test } from 'sazerac';
import { FormatService } from './format-service';

describe.only('format-service', () => {
  let service: FormatService;
  
  const fn = <K extends keyof typeof service>(key: K): (typeof service)[K] => {
    service = new FormatService();

    return service[key].bind(service);
  };
  
  test(fn('format'), () => {
    given('***bold and italic***').expect('<strong><em>bold and italic</em></strong>');
    given('**just bold**').expect('<strong>just bold</strong>');
    given('*italic plz*').expect('<em>italic plz</em>');
    given('_italic again plz_').expect('<em>italic again plz</em>');
    given('__only underline__').expect('<u>only underline</u>');
    given('__*underline + italics*__').expect('<u><em>underline + italics</em></u>');
    given('__**underline and bold**__').expect('<u><strong>underline and bold</strong></u>');
    given('__***underline, bold, and italic***__').expect('<u><strong><em>underline, bold, and italic</em></strong></u>');
    given('~~strikethru~~').expect('<del>strikethru</del>');
    given('```given(tests).expect(`no bugs plz`)```**```').expect('<pre><code>given(tests).expect(`no bugs plz`)</code></pre>');
    given('```# **Epic** *__Markdown__* ~~Guide~~```').expect('<pre><code># **Epic** *__Markdown__* ~~Guide~~</code></pre>');
    given('`delete global.bugs;`').expect('<code>delete global.bugs;</code>');
    given('`cool_function("*hi*");`').expect('<code>cool_function("*hi*");</code>');
  });
});