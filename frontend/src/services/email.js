const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Send commission inquiry email
 */
export async function sendCommissionInquiry(data) {
  try {
    const response = await fetch(`${API_URL}/api/email/commission`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: data.name || '',
        email: data.email || '',
        description: data.description || '',
        size: data.size || '',
        budget: data.budget || '',
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send inquiry');
    }

    return await response.json();
  } catch (error) {
    console.error('Commission inquiry error:', error);
    throw new Error('Failed to send commission inquiry. Please try again.');
  }
}

/**
 * Send contact message
 */
export async function sendContactMessage(data) {
  try {
    const response = await fetch(`${API_URL}/api/email/contact`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: data.name || '',
        email: data.email || '',
        subject: data.subject || '',
        message: data.message || '',
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send message');
    }

    return await response.json();
  } catch (error) {
    console.error('Contact message error:', error);
    throw new Error('Failed to send message. Please try again.');
  }
}

/**
 * Subscribe to newsletter
 */
export async function subscribeNewsletter(email) {
  try {
    const response = await fetch(`${API_URL}/api/email/subscribe`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: email || '',
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to subscribe');
    }

    return await response.json();
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    throw new Error('Failed to subscribe. Please try again.');
  }
}
