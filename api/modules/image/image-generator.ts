import { registerFont, loadImage, Canvas } from 'canvas';

export default class ImageGenerator 
{
    constructor() {
        // registerFont('./public/Roboto-Regular.ttf', { family: 'Roboto' });
        // TODO: add custom font        
    }

    async addBackgroundToCanvas(context, canvas, backgroundURL) {
        if (backgroundURL && backgroundURL.includes('api'))
            throw Error('I don\'t think that\'s a good idea... 🤔');

        let background = null;
        try { background = await loadImage(backgroundURL || 'image/wallpaper.png') }
        catch { return; }
        
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
    }
    async addImageToCanvas(context, imageURL) 
    {
        context.beginPath();
        context.arc(125, 125, 100, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();

        const avatar = await loadImage(imageURL);
        context.drawImage(avatar, 25, 25, 200, 200);
    }
    applyText(canvas: Canvas, text, sizeOverride)
    {
        const context = canvas.getContext('2d');
        let fontSize = sizeOverride || 70;

        do {
          context.font = `${fontSize -= 8}px Roboto, sans-serif`;
        }
        while (context.measureText(text).width > canvas.width - 275);
        return context.font;
    }
    wrapText(context, text, x, y, maxWidth, lineHeight) 
    {
        let words = text.split(' ');
        let line = '';

        for(let n = 0; n < words.length; n++) 
        {
          let testLine = line + words[n] + ' ';
          let metrics = context.measureText(testLine);
          let testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
    }
}
