'use server';

/**
 * @fileOverview Server Action for sending Discord notifications with full details.
 */

export async function sendDiscordNotification(data: {
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  websiteType: string;
  budget: string;
  title: string;
  pages: string;
  description: string;
  designStyle: string;
  functions: string;
  extraFeatures: string;
  ipAddress: string;
}) {
  // Hardcoded webhook as requested for immediate reliability
  const webhookUrl = "https://discord.com/api/webhooks/1480219526506483713/jujVi1SSJfcDrBlutbjDNgc3uRhr8LOQQdO5eiPVpod_j_c7QcD-PyBHs2QJQpH06p_v";
  
  const embed = {
    title: '🚀 New Website Request Received',
    description: `A new build request has been submitted on **RIZERWEBNP**.`,
    color: 0x5858B3, // Primary Theme Color
    fields: [
      { name: '👤 Client Name', value: data.fullName || 'N/A', inline: true },
      { name: '📧 Email', value: data.email || 'N/A', inline: true },
      { name: '📞 Phone', value: data.phone || 'N/A', inline: true },
      { name: '📱 WhatsApp', value: data.whatsapp || 'N/A', inline: true },
      { name: '🌐 Website Type', value: data.websiteType || 'N/A', inline: true },
      { name: '💰 Budget', value: data.budget || 'N/A', inline: true },
      { name: '📄 Pages', value: data.pages || 'N/A', inline: true },
      { name: '📍 IP Address', value: data.ipAddress || 'Unknown', inline: true },
      { name: '📝 Vision & Description', value: data.description || 'No description provided' },
      { name: '🎨 Design Style/AI Suggestions', value: data.designStyle || 'Not specified' },
      { name: '⚙️ Key Functions', value: data.functions || 'Standard' },
      { name: '➕ Extra Features', value: data.extraFeatures || 'None' },
    ],
    footer: {
      text: 'RIZER STUDIO Notification System',
    },
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `🔔 **NEW PROJECT ALERT!** ${data.fullName} has requested a ${data.websiteType} build.`,
        embeds: [embed],
      }),
    });

    if (!response.ok) {
      console.error(`Discord API error: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to send Discord notification:', error);
  }
}
