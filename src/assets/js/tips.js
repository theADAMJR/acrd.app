const hints = [
  // unfunny
  'This hint was first typed at 22:25 on the 7th of May 2021.',
  'We probably need more developers.',
  'Okay, the app could actually benefit from more developers.',
  'Testing123',
  'Hello Earth',

  // trivia
  'Accord was started during a live stream.',
  'The first version of Accord was released on 3rd May, 2021.',
  'Accord is over 80,000 lines of code.',
  'Most original themes in Accord are based from previous Discord projects.',
  'Bot 2PG was made over 1 year after another bot - 3PG.',
  'Development for 2PG first started in March 2020.',
  'Accord was originally named DClone.',

  // helpful
  'The @everyone role is given to all members.',
  'Snowflake IDs are used to find when something was created (i.e. messages).',
  'The max roles per guild, that can be created, is 250.',
  'The max guilds a user can be in is 100.',
  'The max channels a guild can have is 250.',
  'There is currently no limit on how many members can be in a guild.',
  'On some browsers, you can install accord.app on your mobile or desktop.',
  'Installing accord.app may decrease loading time and increase performance.',
  'Native mobile support is available on accord.app.',
];

function hint() {
  const index = Math.floor(Math.random() * hints.length);
  const hint = document.querySelector('#hint');
  if (hint)
    hint.textContent = hints[index];
}
hint();

setInterval(() => hint(), 7500);