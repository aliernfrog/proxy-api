import { AttachmentBuilder } from "discord.js";
import { Webhook } from "../../util/DiscordWebhook.js";

export default {
  description: "Forwards provided crash details to app developer.",
  requireFields: [ "app", "details" ],
  async execute(req, res) {
    const { app, details } = req.body;
    
    const buffer = Buffer.from(
      details, "utf-8"
    );
    const file = new AttachmentBuilder(buffer)
      .setName("details.txt");
    
    try {
      await Webhook.send({
        content: `Received crash report from app: ${app}`,
        files: [ file ]
      });
    } catch (e) {
      console.error("Failed to send webhook message", e);
      return res.writeHead(503).end("Discord webhook failed");
    }
    
    res.writeHead(200).end("Sent crash report.");
  }
}