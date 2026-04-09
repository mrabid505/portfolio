from flask import Flask, render_template, request, jsonify
import sqlite3
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib

app = Flask(__name__)

# --- Database Setup ---
def init_db():
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()
# MODIFY: Apni Gmail aur App Password yahan likho
GMAIL_USER = "mr.abid000@gmail.com"
GMAIL_PASS = "vqfb nmpk iffz cgcp"
NOTIFY_EMAIL = "mr.abid000@gmail.com"

def send_email(name, email, subject, message):
    try:
        msg = MIMEMultipart()
        msg['From'] = GMAIL_USER
        msg['To'] = NOTIFY_EMAIL
        msg['Subject'] = f"Portfolio Message: {subject}"
        body = f"""
New message from your portfolio!

Name:    {name}
Email:   {email}
Subject: {subject}

Message:
{message}
        """
        msg.attach(MIMEText(body, 'plain'))
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(GMAIL_USER, GMAIL_PASS)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False
# --- Routes ---

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json()
    name    = data.get('name', '').strip()
    email   = data.get('email', '').strip()
    subject = data.get('subject', '').strip()
    message = data.get('message', '').strip()

    if not all([name, email, subject, message]):
        return jsonify({'success': False, 'message': 'All fields are required.'}), 400

    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    c.execute('INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
              (name, email, subject, message))
    conn.commit()
    conn.close()
    send_email(name, email, subject, message)

    return jsonify({'success': True, 'message': 'Message sent successfully!'})

@app.route('/api/messages')
def get_messages():
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    c.execute('SELECT id, name, email, subject, message, created_at FROM messages ORDER BY created_at DESC')
    rows = c.fetchall()
    conn.close()
    messages = [{'id': r[0], 'name': r[1], 'email': r[2],
                 'subject': r[3], 'message': r[4], 'created_at': r[5]} for r in rows]
    return jsonify(messages)

# --- Error Handlers ---
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
