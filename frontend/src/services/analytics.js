// Simple analytics tracking utility
export function trackPageView(pageName) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('pageview', {
        page_path: window.location.pathname,
        page_title: document.title
      });
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Page view tracked:', pageName);
    }
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
}

export function trackEvent(eventName, eventData = {}) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, eventData);
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Event tracked:', eventName, eventData);
    }
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
}

export function trackAddToCart(item) {
  trackEvent('add_to_cart', {
    value: item.price,
    currency: 'USD',
    items: [{
      item_id: item.id,
      item_name: item.title,
      price: item.price,
      quantity: 1
    }]
  });
}

export function trackViewItem(item) {
  trackEvent('view_item', {
    value: item.price,
    currency: 'USD',
    items: [{
      item_id: item.id,
      item_name: item.title,
      price: item.price
    }]
  });
}

export function trackPurchase(order) {
  trackEvent('purchase', {
    transaction_id: order.id,
    value: order.total,
    currency: 'USD',
    items: order.items || []
  });
}

export function trackBeginCheckout(cart) {
  trackEvent('begin_checkout', {
    value: cart.total,
    currency: 'USD',
    items: cart.items || []
  });
}

export function trackSearch(searchTerm) {
  trackEvent('search', {
    search_term: searchTerm
  });
}
