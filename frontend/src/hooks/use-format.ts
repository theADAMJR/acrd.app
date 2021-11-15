import { FormatService } from '../services/format-service';
import useMentions from './use-mentions';

const useFormat = () => {
  const format = new FormatService();
  const mentions = useMentions();

  return (content: string) => {
    return format.toHTML(mentions.toHTML(content));
  };
}
 
export default useFormat;