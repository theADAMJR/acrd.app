import { Component, Input } from '@angular/core';
import { toHTML } from 'discord-markdown';
import { textEmoji } from 'markdown-to-text-emoji';
import got from 'got';

const metascraper = require('metascraper')([
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-title')(),
  require('metascraper-url')()
]);

@Component({
  selector: 'message-preview',
  templateUrl: './message-preview.component.html',
  styleUrls: ['./message-preview.component.css']
})
export class MessagePreviewComponent {
  @Input() message: any;
  @Input() createdAt = new Date();

  embed: MessageEmbed;

  get timestamp() {
    const timestamp = this.createdAt.toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true,
      minute: 'numeric'
    });

    const wasToday = new Date().getDay() / this.createdAt.getDay() === 1;
    const wasYesterday = new Date().getDate() % this.createdAt.getDate() === 1;
    const isTommorow = this.createdAt.getTime() % new Date().getDate() === 1;
    
    if (wasToday || wasYesterday)
      return `Today at ${timestamp}`;
    if (wasYesterday)
      return `Yesterday at ${timestamp}`;
    else if (isTommorow)
      return `Tommorow at ${timestamp}`;

    return this.createdAt
      .toJSON()
      .slice(0,10)
      .split('-')
      .reverse()
      .join('/');
  }

  get processed() {
    return toHTML(textEmoji(this.message.content));
  }

  async setEmbed() {
    const containsURL = /([https://].*)/.test(this.message.content);
    if (containsURL) {
      try {
        const targetUrl = /([https://].*)/.exec(this.message.content)[0];
        const { body: html, url } = await got(targetUrl);
  
        this.embed = await metascraper({ html, url });
      } catch {}
    }
  }
}

interface MessageEmbed {
  title: string;
  description: string;
  image: string;
  url: string;
}
