# PayPal Integration Setup Guide

This guide will help you set up PayPal payments for the Mahoney Family Reunion website.

## 🚀 Quick Start

### 1. Create PayPal Developer Account

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Sign in with your PayPal account or create a new one
3. Navigate to "My Apps & Credentials"

### 2. Create a PayPal Application

1. Click "Create App"
2. Choose "Default Application" or create a custom name
3. Select your merchant account
4. Choose "Sandbox" for testing or "Live" for production
5. Select features: **Payments** (required)
6. Click "Create App"

### 3. Get Your Credentials

After creating the app, you'll see:
- **Client ID** (public - safe to expose)
- **Client Secret** (private - keep secure)

### 4. Environment Variables

Create a `.env.local` file in your project root:

```bash
# Copy from .env.example and fill in your values

# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development
```

### 5. Install Dependencies (if not already installed)

The PayPal integration uses the PayPal JavaScript SDK loaded dynamically. No additional npm packages are required for basic functionality.

## 🧪 Testing

### Sandbox Testing

1. Use sandbox credentials in development
2. PayPal provides test credit cards and accounts
3. Test transactions won't charge real money

### Test Credit Cards

PayPal sandbox provides test cards:
- **Visa**: 4111111111111111
- **Mastercard**: 5555555555554444
- **American Express**: 378282246310005

## 🔧 Configuration Options

### Currency Support

The system supports both CAD and USD:
- Exchange rates are configurable in the components
- PayPal handles currency conversion automatically

### Payment Amounts

Current configuration:
- **Deposit**: $100 CAD per person
- **Conversion**: ~$74 USD per person (configurable)

### Webhook Configuration (Optional)

For production, consider setting up PayPal webhooks:
1. In PayPal Developer Dashboard, go to your app
2. Add webhook URL: `https://yourdomain.com/api/paypal/webhook`
3. Select events: `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.DENIED`

## 📁 File Structure

```
app/
├── api/
│   └── paypal/
│       ├── create-order/
│       │   └── route.ts          # Creates PayPal orders
│       └── capture-order/
│           └── route.ts          # Captures payments
├── register/
│   ├── success/
│   │   └── page.tsx             # Payment success page
│   └── cancel/
│       └── page.tsx             # Payment cancelled page
components/
├── paypal-button.tsx            # PayPal button component
└── registration-section.tsx     # Updated with payment flow
```

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env.local` to version control
- Use different credentials for development/production
- Keep client secrets secure (server-side only)

### Validation
- Server-side amount validation prevents tampering
- Registration data is validated before payment
- PayPal handles secure payment processing

## 🚀 Production Deployment

### 1. Switch to Live Credentials
```bash
# Update .env.local for production
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_live_client_id
PAYPAL_CLIENT_SECRET=your_live_client_secret
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NODE_ENV=production
```

### 2. Update Return URLs
Ensure your return URLs match your production domain:
- Success: `https://yourdomain.com/register/success`
- Cancel: `https://yourdomain.com/register/cancel`

### 3. Test Live Payments
- Use small amounts for initial testing
- Verify email confirmations work
- Test the complete user flow

## 📊 Features Implemented

### ✅ Current Features
- [x] PayPal payment integration
- [x] Currency conversion (CAD/USD)
- [x] Registration form validation
- [x] Payment success/failure handling
- [x] Responsive design
- [x] Security validation
- [x] Error handling

### 🔄 Future Enhancements
- [ ] Database integration for storing registrations
- [ ] Email confirmation system
- [ ] Admin dashboard for managing registrations
- [ ] Refund processing
- [ ] Payment status webhooks
- [ ] Multi-language support

## 🆘 Troubleshooting

### Common Issues

**PayPal SDK not loading:**
- Check your Client ID is correct
- Ensure you're using the right environment (sandbox/live)
- Check browser console for errors

**Payment creation fails:**
- Verify Client Secret is correct
- Check server logs for detailed errors
- Ensure amount validation is passing

**Payments not capturing:**
- Check PayPal account status
- Verify webhook configuration
- Review PayPal transaction logs

### Support Resources
- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [PayPal JavaScript SDK Reference](https://developer.paypal.com/sdk/js/reference/)
- [PayPal REST API Reference](https://developer.paypal.com/api/rest/)

## 📞 Contact

For technical issues with the PayPal integration:
- Check the browser console for errors
- Review server logs in `/api/paypal/` routes
- Test with PayPal's sandbox environment first

For PayPal account issues:
- Contact PayPal Developer Support
- Check PayPal's status page for service issues
