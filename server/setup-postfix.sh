#!/bin/bash

# Setup script for configuring Postfix on Debian for ESHS ASB email notifications
# Run this script with sudo: sudo bash setup-postfix.sh

echo "Setting up Postfix for ESHS ASB email notifications..."

# Update package list
apt-get update

# Install Postfix and related packages
echo "Installing Postfix and required packages..."
DEBIAN_FRONTEND=noninteractive apt-get install -y postfix mailutils libsasl2-modules

# Stop postfix to configure it
systemctl stop postfix

# Backup original configuration
cp /etc/postfix/main.cf /etc/postfix/main.cf.backup

# Get system hostname
HOSTNAME=$(hostname -f)
if [ -z "$HOSTNAME" ]; then
    HOSTNAME=$(hostname).localdomain
fi

# Configure main.cf for local mail delivery only
cat > /etc/postfix/main.cf << EOF
# Basic configuration
myhostname = $HOSTNAME
mydomain = eshsasb.org
myorigin = \$mydomain
inet_interfaces = loopback-only
inet_protocols = ipv4
mydestination = localhost

# Local delivery configuration
mynetworks = 127.0.0.0/8 [::ffff:127.0.0.0]/104 [::1]/128
home_mailbox = Maildir/
mailbox_command = /usr/bin/procmail

# Security settings
smtpd_banner = \$myhostname ESMTP
disable_vrfy_command = yes
smtpd_helo_required = yes

# Size limits
message_size_limit = 25600000
mailbox_size_limit = 0
recipient_delimiter = +

# Local delivery only - no relay
# relayhost is not set for local delivery
EOF

# Configure master.cf for local submission
echo "Configuring Postfix master.cf for local delivery..."
cat >> /etc/postfix/master.cf << 'EOF'

# Local submission service (no authentication required for localhost)
submission inet n       -       y       -       -       smtpd
  -o syslog_name=postfix/submission
  -o smtpd_client_restrictions=permit_mynetworks,reject
  -o smtpd_recipient_restrictions=permit_mynetworks,reject
EOF

# Create environment file for Node.js application
echo "Creating environment configuration..."
cat > /etc/default/eshsasb-email << 'EOF'
# Email configuration for ESHS ASB application (Postfix only)
FROM_EMAIL=noreply@eshsasb.org
ADMIN_EMAIL=admin@eshsasb.org
EOF

# Update hostname configuration
echo "Updating hostname configuration..."
if ! grep -q "$HOSTNAME" /etc/hosts; then
    echo "127.0.0.1 $HOSTNAME $(hostname)" >> /etc/hosts
fi

# Create log directory
mkdir -p /var/log/eshsasb
chown www-data:www-data /var/log/eshsasb

# Set up log rotation
cat > /etc/logrotate.d/eshsasb << 'EOF'
/var/log/eshsasb/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0644 www-data www-data
}
EOF

# Enable and start Postfix
echo "Starting Postfix service..."
systemctl enable postfix
systemctl start postfix

# Check Postfix status
echo "Checking Postfix status..."
systemctl status postfix

# Test basic configuration
echo "Testing Postfix configuration..."
postfix check

echo ""
echo "========================================="
echo "Postfix setup completed!"
echo "========================================="
echo ""
echo "IMPORTANT: Next steps to complete setup:"
echo ""
echo "1. Update application environment:"
echo "   Edit /etc/default/eshsasb-email with your actual email addresses"
echo ""
echo "2. Test email sending:"
echo "   echo 'Test message' | mail -s 'Test Subject' test@example.com"
echo ""
echo "3. Update your Node.js application:"
echo "   Set environment variables from /etc/default/eshsasb-email"
echo ""
echo "4. Test via application:"
echo "   Use the test endpoint: POST /api/test-email"
echo ""
echo "Log files:"
echo "- Postfix: /var/log/mail.log"
echo "- Application: /var/log/eshsasb/"
echo ""
echo "Configuration:"
echo "- Postfix configured for local delivery only"
echo "- No external SMTP relay required"
echo "- Application uses localhost:25 for email sending"
echo ""