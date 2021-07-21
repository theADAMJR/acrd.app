import * as React from 'react';

export interface TextBasedChannelProps {
  
}
 
export interface TextBasedChannelState {
  
}
 
class TextBasedChannel extends React.Component<TextBasedChannelProps, TextBasedChannelState> {
  state = {}
  render() { 
    return (
      <div className="text-based-channel">
        Text Based Channel
      </div>
    );
  }
}
 
export default TextBasedChannel;