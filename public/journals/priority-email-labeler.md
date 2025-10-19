# Priority Email Labeler

An AI-powered system that automatically labels important emails in Gmail using machine learning. It processes emails in real-time and applies priority labels based on content analysis.

# How It Started
This project evolved from my earlier spam email detector. After building a system that could identify spam emails, I wanted to take it further and build something that could automatically organize my Gmail inbox. The idea was to use machine learning to identify which emails are actually important and label them automatically, so I don't have to manually sort through everything.

The spam detector was a good starting point - it taught me the basics of email classification and working with Gmail's API. But I wanted to go beyond just filtering out spam and actually help organize the important emails.

[Check out my original spam email detector project →](/projects/spam-email-detector)

# How It Works
The system connects to Gmail through Google's API and processes emails as they arrive. When a new email comes in, it gets analyzed by a machine learning model that looks at the sender, subject, and content to determine if it's important enough to get a "Priority" label.

The whole thing runs on Google Cloud with a FastAPI backend deployed on Render. It uses Pub/Sub to get real-time notifications when emails arrive, so there's no delay in processing.

# Technical Details
The backend is built with Python and FastAPI, using the Gmail API to read and label emails. The machine learning model is trained on a dataset of emails I manually labeled, so it learns from my specific email patterns and preferences.

The system only processes emails that haven't been labeled yet, so it's efficient and doesn't waste time on emails that are already organized. It also skips spam and promotional emails automatically.

# Challenges
The biggest challenge was getting the real-time integration working properly. Gmail's API has rate limits and the webhook setup was tricky to get right. Also, training the model to accurately classify emails took some trial and error with different features and approaches.

# What I Learned
This project taught me a lot about working with Google's APIs and building real-time systems. I got better at machine learning for text classification and learned how to handle webhooks and async processing.

# Results
The system works pretty well for automatically organizing my inbox. Important emails get labeled quickly, and I don't have to manually sort through everything anymore. It's not perfect, but it saves me a lot of time and gets better as it processes more emails.
