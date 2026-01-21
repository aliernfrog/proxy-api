import { WebhookClient } from "discord.js";

const { DISCORD_WEBHOOK_URL } = process.env;
if (!DISCORD_WEBHOOK_URL) console.warn("[DiscordWebhook] DISCORD_WEBHOOK_URL from env is null!");

export const Webhook = new WebhookClient({
  url: DISCORD_WEBHOOK_URL
});