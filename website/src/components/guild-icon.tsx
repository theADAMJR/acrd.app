import * as React from 'react';

export interface GuildIconProps {
  guild: Entity.Guild;
}
export interface GuildIconState {}
 
class GuildIcon extends React.Component<GuildIconProps, GuildIconState> {
  get icon() {
    const guild = this.props.guild;
    const abbr = guild.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 3);

    return (guild.iconURL)
      ? <img className="h-12 w-12" src={guild.iconURL} alt={guild.name} />
      : <span className="color-heading background-primary rounded-full h-12 w-12 flex items-center justify-center">{abbr}</span>;
  }

  render() { 
    return (
      <div className="cursor-pointer guild-icon flex justify-center mb-2">{this.icon}</div>
    );
  }
}
 
export default GuildIcon;
