# SMS and Email OTP Configuration Guide

## Your Specific Configuration

**SMS Sender Number:** 8970074390
**Email Sender:** shankarhomeostores@gmail.com

## Step 1: Email OTP Setup (EmailJS)

### Configure Gmail for EmailJS

1. **Gmail Account Setup:**
   - Use account: shankarhomeostores@gmail.com
   - Enable 2-factor authentication
   - Generate App Password for EmailJS

2. **Get App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate new app password for EmailJS

3. **EmailJS Setup:**
   - Go to https://www.emailjs.com/
   - Sign up for free account
   - Add Gmail service using your app password

4. **Create Email Template:**
   ```
   Subject: Your Verification Code - Shankar Homeo Stores

   Body:
   Hello {{to_name}},

   Your verification code is: {{otp}}

   This code will expire in 10 minutes.

   From: Shankar Homeo Stores
   Email: shankarhomeostores@gmail.com
   ```

5. **Get Your Credentials:**
   - Service ID
   - Template ID
   - Public Key

6. **Update login.js:**
   ```javascript
   const EMAILJS_SERVICE_ID = 'your_actual_service_id';
   const EMAILJS_TEMPLATE_ID = 'your_actual_template_id';
   const EMAILJS_PUBLIC_KEY = 'your_actual_public_key';
   ```

## Step 2: SMS OTP Setup (Number: 8970074390)

### Option 1: Fast2SMS (Recommended for India)

1. **Create Account:**
   - Go to https://www.fast2sms.com/
   - Sign up for free account
   - Get API key

2. **Configure Sender ID:**
   - Request sender ID: "SHANKR" or similar
   - Or use default sender ID

3. **Update login.js SMS Function:**
   ```javascript
   async function sendSMSOTP(mobile, otp) {
       const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
           method: 'POST',
           headers: {
               'authorization': SMS_API_KEY,
               'Content-Type': 'application/json'
           },
           body: JSON.stringify({
               route: 'q',
               message: `Your verification code is: ${otp} - Shankar Homeo Stores`,
               language: 'english',
               flash: 0,
               numbers: mobile
           })
       });

       const result = await response.json();
       return result.return === true;
   }
   ```

### Option 2: Twilio (International)

1. **Create Account:**
   - Go to https://www.twilio.com/
   - Sign up and get account credentials

2. **Purchase Number:**
   - Purchase number: 8970074390 (if available)
   - Or get similar number

3. **Update login.js SMS Function:**
   ```javascript
   const twilio = require('twilio');
   const client = new twilio(accountSid, authToken);

   async function sendSMSOTP(mobile, otp) {
       await client.messages.create({
           body: `Your verification code is: ${otp} - Shankar Homeo Stores`,
           from: '+918970074390',
           to: mobile
       });
   }
   ```

## Important Notes

### For SMS Number 8970074390:
- This number must be registered with an SMS provider
- You cannot just use any mobile number as sender
- Fast2SMS provides default sender IDs for free
- Custom sender IDs require DLT registration in India

### For Email shankarhomeostores@gmail.com:
- This will be the "from" address in emails
- EmailJS will send emails using this account
- Make sure 2FA is enabled on the Gmail account

## Testing

### Test Email OTP:
1. Configure EmailJS with shankarhomeostores@gmail.com
2. Try registration with your email
3. Check inbox for OTP

### Test SMS OTP:
1. Configure SMS service (Fast2SMS recommended)
2. Try registration with your mobile
3. Check SMS for OTP

## Quick Setup Checklist

- [ ] Gmail account shankarhomeostores@gmail.com ready
- [ ] EmailJS account created
- [ ] Email service configured with Gmail
- [ ] Email template created
- [ ] SMS service account created (Fast2SMS/Twilio)
- [ ] SMS sender ID configured
- [ ] Credentials updated in login.js
- [ ] Test email OTP sending
- [ ] Test SMS OTP sending

## Cost Estimates

### EmailJS: Free (200 emails/month)
### Fast2SMS: ~₹0.20 per SMS (India)
### Twilio: ~$0.05 per SMS (International)

Would you like me to help you set up EmailJS first, or would you prefer to configure the SMS service?