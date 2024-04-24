# from celery import shared_task
import os
import csv
from datetime import datetime, timedelta
import smtplib

from flask import render_template
from jinja2 import Template
from flask import render_template
from sqlalchemy import desc, func, or_, and_
from celery.schedules import crontab
from application.celery_worker import celery
from application.utils import send_email
from application.models import User,Request,Issue
from email.mime.image import MIMEImage
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

@celery.on_after_finalize.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(minute='45', hour='10' ),
        send_daily_reminder.s(),
        name='send daily reminder email'
    )

    sender.add_periodic_task(
        crontab(minute='45', hour='10', day_of_month='24'),
        send_monthly_report.s(),
        name='send monthly reminder email'
    )

@celery.task()
def send_daily_reminder():
    template = """
    <p>
        Dear M/s. {{ name }},
    </p>
    <br />
    <p>
        We really miss you on our Grocery Store.
    </p>
    <p>
        Check out our latest grocery products. They are always fresh and available at a affordable price.
    </p>
    <p>
        Excited to see you soon.
    </p>
    <br />
    <p>
        Best Regards,
    </p>
    <p>
        Butti Grocery Store
    </p>
        <small>Eat Healthy, Stay Healthy! </small>
        """
    users = User.query.all()
    template = Template(template)

    for user in users:
        user_dict = user.to_dict()
        if user_dict["role"] == "user":
            requests_today = Request.query.filter(Request.user_id==user_dict["id"]).filter(func.date(Request.created_timestamp) == datetime.now().date()).count()
            if requests_today == 0:
                address = user_dict["email"]
                subject = "We miss you " + user_dict["name"].capitalize() + "!"
                rendered_template = template.render(name=user_dict["name"])
                send_email(address, subject, rendered_template)
            else:
                print(f"User {user_dict['name']} has already requested today")

    return 200


@celery.task()
def send_monthly_report():
    users = User.query.filter_by(role="user").all()

    for user in users:
        user = user.to_dict()

        requests = Request.query.filter(Request.user_id==user["id"]).filter(func.date(Request.created_timestamp) > datetime.now().date() - timedelta(days=30)).all()
        # total_amount = requests.with_entities(func.sum(Request.total_amount)).scalar()
        requests = [request.to_dict() for request in requests]
        issues = Issue.query.filter(Issue.user_id==user["id"]).filter(func.date(Issue.issue_date) > datetime.now().date() - timedelta(days=30)).all()
        # total_amount = requests.with_entities(func.sum(Request.total_amount)).scalar()
        issues = [issue.to_dict() for issue in issues]

        # print('requests len"', len(requests))
        # print(total_amount)

        SMTP_SERVER_HOST = "localhost"
        SMTP_SERVER_PORT = 1025
        SENDER_ADDRESS = "admin@butti.com"
        SENDER_PASSWORD = ""
        msg = MIMEMultipart()
        msg["From"] = SENDER_ADDRESS
        msg["To"] = user["email"]
        msg["Subject"] = "[ZenLibrary] User Monthly Report"

        template = render_template("user_report.html", user=user["username"], requests=requests, issues=issues)
        msg.attach(MIMEText(template, "html"))

        smtp = smtplib.SMTP(host=SMTP_SERVER_HOST, port=SMTP_SERVER_PORT)
        smtp.login(SENDER_ADDRESS, SENDER_PASSWORD)
        smtp.send_message(msg)
        smtp.quit()

    return 200
