import ws from './ws-service';

(async() => {  
  ws.on('VOICE_DATA', async ({ channelId, connections }) => {
    if (!channelId) return;

    console.log(connections);
    
    for (const { blob: arrayBuffer } of connections) {
      const blob = new Blob([arrayBuffer], { 'type' : 'audio/ogg; codecs=opus' });
      const audio = document.createElement('audio');
      audio.src = window.URL.createObjectURL(blob);
      audio.play();
    }
    
    let audioChunks: Blob[] = [];
    const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(mediaStream);

    recorder.onstart = () => audioChunks = [];
    recorder.ondataavailable = (e) => audioChunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(audioChunks, { 'type': 'audio/ogg; codecs=opus' });
      ws.emit('VOICE_DATA', { channelId, blob });
    }

    recorder.start();
    setTimeout(() => recorder.stop(), 100);
  });
})();