# Complete Namecheap Setup Instructions for Drive-Away Insurance Application

## Important: Namecheap-Specific Email Configuration

Namecheap hosting has specific requirements for sending emails. Follow these instructions carefully.

## Step 1: Build Your Application

1. **In your development environment, run:**
```bash
npm run build
```

2. **This creates a `dist` folder with all your website files**

## Step 2: Access Your Namecheap Hosting

1. **Go to namecheap.com and log into your account**
2. **Click "Dashboard" in the top menu**
3. **Find your domain and click "Manage"**
4. **Click "cPanel" or "Hosting Dashboard"**
5. **Click "File Manager"**

## Step 3: Upload Your Website Files

1. **In File Manager, navigate to `public_html` folder**
2. **Delete any existing files (like index.html, default pages)**
3. **Upload ALL files from your `dist` folder:**
   - Click "Upload" button
   - Select all files from the `dist` folder on your computer
   - Upload them directly into `public_html` (not in a subfolder)

4. **Upload the PHP file:**
   - Upload `submit-application.php` to the same `public_html` folder

## Step 4: Configure Email Settings (CRITICAL!)

### Method 1: Create Domain Email (RECOMMENDED)

1. **In cPanel, find "Email Accounts" and click it**
2. **Click "Create" to add a new email account**
3. **Create: `noreply@yourdomain.com` (replace yourdomain.com with your actual domain)**
4. **Set a strong password and note it down**
5. **Write down these settings:**
   - **SMTP Server:** `mail.yourdomain.com`
   - **SMTP Port:** `587` (or `465` for SSL)
   - **Username:** `noreply@yourdomain.com`
   - **Password:** (the password you just set)

### Method 2: Basic PHP Mail (Easier but Less Reliable)

If you prefer the simpler approach, skip the email account creation.

## Step 5: Edit the PHP Configuration

1. **In File Manager, right-click on `submit-application.php`**
2. **Click "Edit" or "Code Edit"**
3. **Update these settings at the top of the file:**

### For Method 1 (SMTP - More Reliable):
```php
$to_email = 'your-actual-email@gmail.com'; // Where you want to receive applications
$from_email = 'noreply@yourdomain.com'; // The domain email you created

// SMTP Configuration
$smtp_host = 'mail.yourdomain.com';
$smtp_port = 587;
$smtp_username = 'noreply@yourdomain.com';
$smtp_password = 'your-domain-email-password';
$use_smtp = true; // Change this to true
```

### For Method 2 (Basic Mail - Simpler):
```php
$to_email = 'your-actual-email@gmail.com'; // Where you want to receive applications
$from_email = 'noreply@yourdomain.com'; // Your domain (even if email doesn't exist)
$use_smtp = false; // Keep this as false
```

**Example Configuration:**
```php
$to_email = 'john.smith@gmail.com';
$from_email = 'noreply@myinsurancesite.com';
```

4. **Click "Save Changes"**

## Step 6: Set File Permissions

1. **Right-click on `submit-application.php`**
2. **Click "Permissions" or "Change Permissions"**
3. **Set permissions to `755`:**
   - Owner: Read, Write, Execute ✓
   - Group: Read, Execute ✓
   - Public: Read, Execute ✓

## Step 7: Test Your Setup

1. **Go to your domain** (e.g., `yoursite.com`)
2. **Fill out the entire insurance form**
3. **Submit the application**
4. **Check for:**
   - Success message on the website
   - Email in your inbox (check spam folder too!)

## Step 8: Troubleshooting Namecheap Email Issues

### If emails aren't sending:

1. **Check cPanel Error Logs:**
   - In cPanel, go to "Error Logs"
   - Look for PHP errors related to mail

2. **Contact Namecheap Support:**
   - Use their live chat
   - Say: "PHP mail function isn't working on my shared hosting"
   - They can verify if mail() is enabled

3. **Try SMTP Method:**
   - Follow Method 1 above
   - SMTP is more reliable than basic mail()

4. **Check Domain Email Setup:**
   - Make sure `from_email` uses YOUR domain name
   - Don't use gmail.com or yahoo.com in the from field

5. **Verify SPF Records:**
   - In cPanel, go to "Zone Editor"
   - Make sure there's an SPF record for your domain

## Common Namecheap Issues & Solutions:

### Problem: "Failed to send email"
**Solution:** Enable SMTP method and create domain email account

### Problem: Emails go to spam
**Solution:** Use domain email in `from_email` field, not Gmail/Yahoo

### Problem: "Mail function disabled"
**Solution:** Contact Namecheap support to enable mail() function

### Problem: Application submission fails
**Solution:** Check file permissions are 755 and PHP syntax is correct

## File Structure Should Look Like:
```
public_html/
├── index.html
├── submit-application.php
├── assets/
│   ├── index-abc123.css
│   └── index-xyz789.js
└── (other files from dist folder)
```

## Email Format You'll Receive:

When someone submits the form, you'll receive a detailed email with:
- Application number (e.g., DA-12345678)
- Complete company information
- All driver details
- Coverage selections
- Business operations information
- Contact details

## Need Help?

1. **Namecheap Live Chat** - Available 24/7
2. **Tell them:** "I need help setting up PHP email sending on shared hosting"
3. **Reference this guide** when explaining your setup

Your drive-away insurance application should now be fully functional on Namecheap hosting! 🎯