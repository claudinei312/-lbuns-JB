import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

let client;

export default function handler(req, res) {
  if (!client) {
    client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: { headless: true }
    });

    client.on('qr', (qr) => {
      qrcode.generate(qr, { small: true });
      console.log('QR Code gerado! Escaneie no seu WhatsApp.');
    });

    client.on('ready', () => {
      console.log('Cliente está pronto!');
    });

    client.initialize();
  } else {
    console.log('Cliente já inicializado.');
  }

  res.status(200).json({ message: 'Bot iniciado. Verifique o QR code no console do servidor.' });
}
