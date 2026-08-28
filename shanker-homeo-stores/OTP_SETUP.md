# OTP Setup Guide for Shankar Homeo Stores

## Email OTP Setup (EmailJS)

### Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for a free account
3. EmailJS offers 200 free emails per month

### Step 2: Create Email Service
1. In EmailJS dashboard, click "Email Services"
2. Add a new email service (Gmail, Outlook, etc.)
3. Follow the setup instructions for your email provider

### Step 3: Create Email Template
1. In EmailJS dashboard, click "Email Templates"
2. Create a new template
3. Use this template:

**Subject:** Your Verification Code for Shankar Homeo Stores

**Body:**
```
Hello {{to_name}},

Your verification code is: {{otp}}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

Thank you,
Shankar Homeo Stores Team
```

### Step 4: Get Your Credentials
1. In EmailJS dashboard, you'll find:
   - Service ID
   - Template ID
   - Public Key

### Step 5: Update login.js
Replace these values in login.js:
```javascript
const EMAILJS_SERVICE_ID = 'your_actual_service_id';
const EMAILJS_TEMPLATE_ID = 'your_actual_template_id';
const EMAILJS_PUBLIC_KEY = 'your_actual_public_key';
```

## SMS OTP Setup (Twilio)

### Option 1: Simple SMS Integration (Recommended for Starters)

#### Using Fast2SMS (Free tier available)
1. Go to https://www.fast2sms.com/
2. Sign up for free account
3. Get API key
4. Use their API to send SMS

#### Using Twilio (Paid, but reliable)
1. Go to https://www.twilio.com/
2. Sign up for account
3. Get Account SID and Auth Token
4. Purchase a phone number
5. Use Twilio API to send SMS

### Step 2: Create Backend Server (Required for SMS)

For security, SMS sending should be done from a backend server:

**Simple Node.js Backend Example:**

```javascript
// server.js
const express = require('express');
const twilio = require('twilio');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Twilio configuration
const accountSid = 'your_account_sid';
const authToken = 'your_auth_token';
const client = new twilio(accountSid, authToken);

app.post('/api/send-sms', async (req, res) => {
    const { mobile, otp } = req.body;

    try {
        const message = await client.messages.create({
            body: `Your verification code is: ${otp}`,
            from: 'your_twilio_phone_number',
            to: mobile
        });

        res.json({ success: true, messageId: message.sid });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

### Step 3: Update Frontend to Call Backend

Replace the `sendSMSOTP` function in login.js:

```javascript
async function sendSMSOTP(mobile, otp) {
    try {
        const response = await fetch('https://your-backend.com/api/send-sms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mobile, otp })
        });

        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('SMS sending failed:', error);
        return false;
    }
}
```

## Quick Setup for Testing

### For Immediate Testing (Demo Mode):
The current system will work in demo mode:
- OTPs are generated and logged to console
- Email and SMS sending will fail gracefully
- Console will show the OTPs for testing

### For Production Use:
1. Set up EmailJS for email OTP (free)
2. Set up SMS service (Twilio/Fast2SMS)
3. Create simple backend server for SMS
4. Update credentials in login.js
5. Test thoroughly

## Alternative: Use Verification Services

### SendGrid (Email Only)
- Free tier available
- Reliable email delivery
- Easy API integration

### MSG91 (SMS and Email)
- Indian service with good rates
- Both SMS and email verification
- API-based integration

## Security Notes

1. **Never expose API keys in frontend code**
2. **Always use backend for SMS sending**
3. **Implement rate limiting for OTP requests**
4. **Set OTP expiration time (10-15 minutes)**
5. **Limit OTP attempts (3-5 tries)**

## Testing Checklist

- [ ] Email OTP working with EmailJS
- [ ] SMS OTP working with backend
- [ ] OTPs are 6 digits only
- [ ] OTPs expire after 10 minutes
- [ ] Rate limiting implemented
- [ ] Error handling in place
- [ ] Console fallback working for testing

## Cost Estimates

### EmailJS: Free (200 emails/month)
### Twilio SMS: ~$0.05 per SMS
### Fast2SMS: ~₹0.20 per SMS (India)
### Backend hosting: Free (Heroku, Vercel, etc.)

Would you like me to help you set up EmailJS first, or would you prefer to explore other options?