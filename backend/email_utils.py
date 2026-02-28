import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dont_use_config_directly import config # We'll just read os.environ directly to avoid circular imports if any, but let's pass it. actually let's just use os.getenv here so it's clean.

def send_verification_email(to_email: str, token: str, frontend_url: str):
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_email = os.getenv("SMTP_EMAIL")
    smtp_password = os.getenv("SMTP_PASSWORD")
    
    if not smtp_email or not smtp_password:
        print("WARNING: SMTP credentials not set. Could not send verification email.")
        return False
        
    verification_link = f"{frontend_url.rstrip('/')}/verify-email?token={token}"
    
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Verify your account for Authentiq"
    msg["From"] = smtp_email
    msg["To"] = to_email
    
    text = f"Welcome to Authentiq!\n\nPlease verify your email by clicking the link below:\n{verification_link}\n\nThis link will expire in 24 hours."
    html = f"""
    <html>
      <body style="font-family: sans-serif; line-height: 1.6; color: #333;">
        <h2>Welcome to Authentiq!</h2>
        <p>Thank you for signing up. To complete your registration and log in, please verify your email address by clicking the button below.</p>
        <p>
          <a href="{verification_link}" style="display:inline-block; padding: 10px 20px; background-color: #4F46E5; color: #fff; text-decoration: none; border-radius: 5px;">
            Verify Email
          </a>
        </p>
        <p>Or alternatively, copy and paste this link into your browser:</p>
        <p><a href="{verification_link}">{verification_link}</a></p>
        <p style="font-size: 0.9em; color: #777;">This verification link will expire in 24 hours.</p>
      </body>
    </html>
    """
    
    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")
    msg.attach(part1)
    msg.attach(part2)
    
    try:
        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_email, smtp_password)
        server.sendmail(smtp_email, to_email, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send verification email to {to_email}: {e}")
        return False
