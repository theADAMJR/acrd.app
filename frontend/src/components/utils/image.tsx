import { FunctionComponent, HTMLAttributes } from 'react';

const Image: FunctionComponent<any> = (props) => {
  return (
    <img
      onError={e => e.currentTarget.src = `${process.env.REACT_APP_CDN_URL}/avatars/unknown.png`}
      {...props} />
    );
}
 
export default Image;