// src/services/email.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation({ order, trackingCode, carrier }) {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e8e0d8; font-family: Georgia, serif; color: #3d3530;">
          ${item.painting.title}
          <div style="font-size: 13px; color: #8a7d75; margin-top: 4px;">
            ${item.painting.medium} · ${item.painting.dimensions}
          </div>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e8e0d8; text-align: right; font-family: Georgia, serif; color: #3d3530;">
          $${item.price.toFixed(2)}
        </td>
      </tr>`
    )
    .join('');

  const trackingSection = trackingCode
    ? `
      <div style="background: #f5f0eb; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <p style="margin: 0 0 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #8a7d75; font-family: sans-serif;">Tracking</p>
        <p style="margin: 0; font-family: Georgia, serif; color: #3d3530; font-size: 18px;">${carrier}: ${trackingCode}</p>
      </div>`
    : `<p style="color: #8a7d75; font-family: Georgia, serif;">Your shipping label is being prepared — you'll receive tracking information shortly.</p>`;

  const html = `
  <!DOCTYPE html>
  <html>
  <head><meta charset="UTF-8"></head>
  <body style="margin: 0; padding: 0; background: #faf7f4;">
    <div style="max-width: 580px; margin: 0 auto; padding: 48px 24px;">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: normal; color: #3d3530; letter-spacing: 0.05em; margin: 0;">
          Dahlia Baasher
        </h1>
        <p style="font-family: sans-serif; font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; color: #b5a99e; margin: 8px 0 0;">
          Original Art
        </p>
      </div>

      <!-- Card -->
      <div style="background: #fff; border-radius: 12px; padding: 40px; border: 1px solid #e8e0d8;">
        
        <h2 style="font-family: Georgia, serif; font-weight: normal; font-size: 22px; color: #3d3530; margin: 0 0 8px;">
          Thank you, ${order.customerName.split(' ')[0]}
        </h2>
        <p style="font-family: Georgia, serif; color: #8a7d75; font-size: 16px; margin: 0 0 32px; line-height: 1.6;">
          Your order has been confirmed and your painting will be on its way soon. Every piece is carefully packaged to ensure it arrives safely.
        </p>

        <!-- Items -->
        <table style="width: 100%; border-collapse: collapse;">
          ${itemsHtml}
          <tr>
            <td style="padding: 16px 0 0; font-family: Georgia, serif; color: #3d3530; font-weight: bold;">Total</td>
            <td style="padding: 16px 0 0; text-align: right; font-family: Georgia, serif; color: #3d3530; font-weight: bold;">$${order.total.toFixed(2)}</td>
          </tr>
        </table>

        <!-- Tracking -->
        ${trackingSection}

        <!-- Shipping address -->
        <div style="margin-top: 24px;">
          <p style="margin: 0 0 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #8a7d75; font-family: sans-serif;">Shipping to</p>
          <p style="margin: 0; font-family: Georgia, serif; color: #3d3530; line-height: 1.7;">
            ${order.shipName}<br>
            ${order.shipStreet}<br>
            ${order.shipCity}, ${order.shipState} ${order.shipZip}<br>
            ${order.shipCountry}
          </p>
        </div>

      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 32px;">
        <p style="font-family: Georgia, serif; color: #b5a99e; font-size: 14px;">
          Questions? Reply to this email or reach out at ${process.env.EMAIL_FROM}
        </p>
      </div>

    </div>
  </body>
  </html>`;

  await resend.emails.send({
    from: `Dahlia Baasher <${process.env.EMAIL_FROM}>`,
    to: order.customerEmail,
    subject: `Your order is confirmed — ${order.items.map((i) => i.painting.title).join(', ')}`,
    html,
  });
}
