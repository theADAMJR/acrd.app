import { MessageTypes } from '@accord/types';
import { FunctionComponent } from 'react';
import Image from '../../utils/image';

interface MessageEmbedProps {
  embed: MessageTypes.Embed;
}
 
const MessageEmbed: FunctionComponent<MessageEmbedProps> = ({ embed }) => {
  return (embed) ? (
    <div style={{ borderLeft: '5px solid var(--muted)' }}
      className="block float-none bg-bg-secondary">
      <a href={embed.url} target="_blank">
        <h2>{embed.title}</h2>
      </a>
      <p>{embed.description}</p>
      <a href={embed.url} target="_blank">
        <Image
          src={embed.imageURL}
          alt={embed.title}
          className="w-96" />
      </a>
    </div>
  ) : null;
}

export default MessageEmbed;