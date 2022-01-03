import { patterns as defaultPatterns } from '@accord/types';

export class FormatService {
  private readonly patterns = {
    boldItalic: /\*\*\*(.*?)\*\*\*/gs,
    bold: /\*\*(.*?)\*\*/gs,
    italic: /^(?!=<code>)\*(.*?)\*|_(.*?)_/gs,
    underline: /__(.*?)__/gs,
    underlineItalics: /__\*(.*?)\*__/gs,
    underlineBold: /__\*\*(.*?)\*\*__/gs,
    underlineBoldItalics: /__\*\*\*(.*?)\*\*\*__/gs,
    strikethrough: /~~(.*?)~~/gs,
    codeMultiline: /```(.*?)```/gs,
    codeLine: /`(.*?)`/gs,
    blockQuoteMultiline: />>> (.*)/gs,
    blockQuoteLine: /^> (.*)$/gm,
    url: /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/gm,
  };

  public toHTML(content: string) {
    return content
      .replace(this.patterns.underlineBold, '<u><strong>$1</strong></u>')
      .replace(this.patterns.underlineItalics, '<u><em>$1</em></u>*__')
      .replace(this.patterns.underlineBoldItalics, '<u><strong><em>$1</em></strong></u>')
      .replace(this.patterns.strikethrough, '<del>$1</del>')
      .replace(this.patterns.boldItalic, '<strong><em>$1</em></strong>')
      .replace(this.patterns.underline, '<u>$1</u>')
      .replace(this.patterns.bold, '<strong>$1</strong>')
      .replace(this.patterns.italic, '<em>$1$2</em>')
      .replace(this.patterns.codeMultiline, '<pre><code>$1</code></pre>')
      .replace(this.patterns.codeLine, '<code>$1</code>')
      .replace(this.patterns.blockQuoteLine, '<span class="blockquote pl-1">$1</span>')
      .replace(this.patterns.blockQuoteMultiline, '<div class="blockquote pl-1">$1</div>')
      .replace(defaultPatterns.url, '<a href="$1" target="_blank">$1</div>');
  }

  // FIXME:
  public messageBox(content: string) {
    return content
      .replace(this.patterns.underlineBold, '__**<u><strong>$1</strong></u>**__')
      .replace(this.patterns.underlineItalics, '__*<u><em>$1</em></u>*__')
      .replace(this.patterns.underlineBoldItalics, '__***<u><strong><em>$1</em></strong></u>***__')
      .replace(this.patterns.strikethrough, '~~<del>$1</del>~~')
      .replace(this.patterns.boldItalic, '***<strong><em>$1</em></strong>***')
      .replace(this.patterns.underline, '<u>$1</u>')
      .replace(this.patterns.bold, '**<strong>$1</strong>**')
      .replace(this.patterns.italic, '<em>$1$2</em>')
      .replace(this.patterns.codeMultiline, '<pre><code>$1</code></pre>')
      .replace(this.patterns.codeLine, '<code>$1</code>')
      .replace(this.patterns.blockQuoteLine, '<span class="blockquote pl-1">$1</span>')
      .replace(this.patterns.blockQuoteMultiline, '<div class="blockquote pl-1">$1</div>')
      .replace(defaultPatterns.url, '<a href="$1" target="_blank">$1</div>');
  }
}