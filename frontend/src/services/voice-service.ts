import ws from './ws-service';

let timeout: NodeJS.Timeout;
let beforeSendMs: number;
let mediaStream: MediaStream;
let recorder: MediaRecorder;
let audioChunks: Blob[] = [];
let channelId: string;

// start feedback cycle w/ server and client (EMIT voice_data via client when in vc)
// - as soon as we are in a vc, we send updates
// - (Client) EMIT VOICE_DATA -> (Server) EMIT VOICE_DATA
//                    ^______________|
export async function startVoiceFeedback(currentChannelId: string) {
  channelId = currentChannelId;
  const wsPing = new Date().getTime() - beforeSendMs;
  console.log('start feedback', wsPing);  

  if (!mediaStream && !recorder)
    await startMedia();
  if (!recorder.onstop)
    recorder.onstop = onStop;
  
  // we start recording as soon as join a vc
  // - 100ms later, we send it to the server
  // - server sends audio and is played on client
  // - gap between server and client (6ms)?
  if (recorder.state !== 'recording')
    recorder.start();
  // it's waits for a response which takes 100ms, creating a hole in audio
  timeout = setTimeout(() => (recorder.state === 'recording') && recorder.stop(), 300);
}

export const stopVoiceFeedback = () => {
  console.log('stopping feedback');  

  clearTimeout(timeout);
  if (recorder && recorder.state === 'recording') {
    recorder.onstop = null;
    recorder.stop();
  }
}

ws.on('VOICE_DATA', async ({ channelId, connections }) => {
  console.log('receive VOICE_DATA');
  if (!channelId) return;
  
  // we play audio as soon as it's available
  for (const { blob: arrayBuffer, userId } of connections) {
    document.querySelector(`#voice${userId}`)?.remove();

    const blob = new Blob([arrayBuffer as BlobPart], { 'type' : 'audio/ogg; codecs=opus' });
    const audio = document.createElement('audio');
    audio.id = `voice${userId}`;
    audio.src = window.URL.createObjectURL(blob);
    audio.play();
  }
  startVoiceFeedback(channelId);
});

async function startMedia() {
  mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  recorder = new MediaRecorder(mediaStream);
  recorder.onstart = () => audioChunks = [];
  recorder.ondataavailable = (e) => audioChunks.push(e.data);
  recorder.onstop = onStop;
}

async function onStop() {
  console.log('stop recording');
  
  beforeSendMs = new Date().getTime();
  const blob = new Blob(audioChunks, { 'type': 'audio/ogg; codecs=opus' });
  ws.emit('VOICE_DATA', { channelId, blob });
  recorder.onstop = onStop;
}