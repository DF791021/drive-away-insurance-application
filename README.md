# Drive-Away Insurance Application

A comprehensive multi-step form application for drive-away insurance applications, built with React, TypeScript, Tailwind CSS, and PHP backend.

## Features

- **Multi-step Form**: 10-step application process covering all aspects of drive-away insurance
- **Form Validation**: Real-time validation with error handling
- **Email Submissions**: Applications are sent directly to your email using PHP
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Auto-save**: Form data is automatically saved to localStorage
- **Professional UI**: Modern, clean interface with smooth animations
- **Own Server**: Uses your own hosting - no third-party dependencies

## Setup Instructions

### Quick Setup for Namecheap Hosting

**The easiest way:** See `NAMECHEAP-SETUP.md` for detailed Namecheap-specific instructions.

### 1. Upload to Your Namecheap Server

1. **Build the Application**:
```bash
npm install
npm run build
```

2. **Upload Files**:
   - Upload all files from the `dist/` folder to your domain's public_html directory
   - Upload the `submit-application.php` file to the same directory

3. **Configure Email Settings**:
   Edit `submit-application.php` and update these lines:
```php
$to_email = 'your-email@gmail.com'; // Your email address (where you want to receive applications)
$from_email = 'noreply@yourdomain.com'; // Must be from your domain for Namecheap

// For better reliability on Namecheap, consider using SMTP:
$use_smtp = true; // Change to true
$smtp_host = 'mail.yourdomain.com';
$smtp_username = 'noreply@yourdomain.com'; // Domain email you create in cPanel
$smtp_password = 'your-domain-email-password';
```

### Important Namecheap Notes:
- The `from_email` MUST use your domain name (not Gmail/Yahoo)
- Create a domain email account in cPanel for better delivery
- SMTP method is more reliable than basic mail() function
- Contact Namecheap support if mail() function is disabled

### 2. Testing

1. Make sure your hosting supports PHP (Namecheap does by default)
2. Test that the form submission works by filling out and submitting the form
3. Check your email for the application details

### 3. Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# The built files will be in the 'dist' folder
```

### 4. Deployment to Namecheap

1. **Using File Manager**:
   - Login to your Namecheap cPanel
   - Go to File Manager
   - Navigate to public_html
   - Upload the contents of the `dist` folder
   - Upload `submit-application.php`

2. **Using FTP**:
   - Use an FTP client like FileZilla
   - Connect to your Namecheap hosting
   - Upload all files to the public_html directory

## How It Works

1. User fills out the multi-step form
2. Form data is submitted to `submit-application.php` on your server
3. PHP script formats the data and sends a detailed email to your specified address
4. User sees a success message with an application number

No third-party services, no monthly fees, complete control over your data!

## Form Structure

1. **Company Information** - Basic company details and addresses
2. **Business Operations** - Business description, experience, financial info
3. **Coverage Selection** - Insurance coverage options and limits
4. **Driver Information** - Driver details, requirements, and safety policies
5. **Insurance History** - Previous insurance and loss history
6. **Drive-Away Operations** - Specific drive-away operation details
7. **Additional Operations** - Towing, filings, and operational requirements
8. **Plate Information** - Vehicle plate management details
9. **Vehicle Specific Details** - Type-specific vehicle information
10. **Review & Submit** - Final review and application submission