// src/services/shipping.js
import EasyPostClient from '@easypost/api';

export async function createShippingLabel(order) {
  const client = new EasyPostClient(process.env.EASYPOST_API_KEY);
  const shipment = await client.Shipment.create({
    from_address: {
      name: process.env.SHIP_FROM_NAME || 'Dahlia Baasher',
      street1: process.env.SHIP_FROM_STREET || 'Forest Park Drive',
      city: process.env.SHIP_FROM_CITY || 'Mississauga',
      state: process.env.SHIP_FROM_STATE || 'ON',
      zip: process.env.SHIP_FROM_ZIP || 'L5N6X9',
      country: process.env.SHIP_FROM_COUNTRY || 'CA',
      phone: process.env.SHIP_FROM_PHONE || '',
    },
    to_address: {
      name: order.shipName,
      street1: order.shipStreet,
      city: order.shipCity,
      state: order.shipState,
      zip: order.shipZip,
      country: order.shipCountry,
      phone: order.shipPhone || '',
    },
    parcel: {
      length: 24,
      width: 4,
      height: 4,
      weight: 48,
    },
  });

  // Buy the cheapest rate (Canada Post, UPS, FedEx)
  const lowestRate = shipment.lowestRate(['CanadaPost', 'UPS', 'FedEx']);
  const purchased = await client.Shipment.buy(shipment.id, lowestRate);

  return {
    trackingCode: purchased.tracking_code,
    labelUrl: purchased.postage_label.label_url,
    carrier: purchased.selected_rate.carrier,
  };
}
