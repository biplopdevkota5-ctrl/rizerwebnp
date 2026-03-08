'use server';

/**
 * @fileOverview Server Action for sending Discord notifications.
 */

export async function sendDiscordNotification(data: {
  fullName: string;
  email: string;
  phone: string;
  websiteType: string;
  budget: string;
  pages: string;
  description: string;
}) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn('Discord Webhook URL not configured. Skipping notification.');
    return;
  }

  const embed = {
    title: '🚀 New Website Request Received',
    description: `A new build request has been submitted on **RIZERWEBNP**.`,
    color: 0x5858B3, // Primary Theme Color (Deep Indigo)
    fields: [
      { name: '👤 Client Name', value: data.fullName || 'N/A', inline: true },
      { name: '📧 Email', value: data.email || 'N/A', inline: true },
      { name: '📞 Phone', value: data.phone || 'N/A', inline: true },
      { name: '🌐 Website Type', value: data.websiteType || 'N/A', inline: true },
      { name: '💰 Budget', value: data.budget || 'N/A', inline: true },
      { name: '📄 Pages', value: data.pages || 'N/A', inline: true },
      { name: '📝 Vision', value: data.description || 'N/A' },
    ],
    footer: {
      text: 'RIZER WEB APP Notification System',
    },
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `🔔 **New Request Alert!** ${data.fullName} is looking for a ${data.websiteType}.`,
        embeds: [embed],
      }),
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to send Discord notification:', error);
  }
}
