from django_q.tasks import async_task

from io import StringIO
from datetime import datetime
import time
import csv

from financial.models import TransactionLog, Account
from .models import ImportTemplate


def queue_import(import_file, user, account_id, import_template_id):
    account = Account.objects.get(id=account_id)
    import_template = ImportTemplate.objects.get(id=import_template_id)


    # CSV Import
    if (import_template.data_format == 'C'):            
        for row in csv.DictReader(StringIO(import_file)):
            async_task('utilities.tasks.import_transaction', row, user, account, import_template)

# Process Import Data
def import_transaction(import_data, user, account, import_template):
    print("Called 'Import Transaction'...")
    
    transaction_type = 'DBT' if float(import_data['Debit']) > 0.0 else 'CRD'
    transaction_amount = import_data['Debit'] if float(import_data['Debit']) > 0.0 else import_data['Credit']
    transaction_date = datetime.strptime(import_data['Date'], '%m/%d/%Y')

    TransactionLog.objects.create(owner=user, 
        account=account, transaction_type=transaction_type, summary=import_data['Description'],
        amount=transaction_amount, transaction_date=transaction_date)

# report mailer
def email_report(task):
    if task.success:
        # Email the report
        async_task('django.core.mail.send_mail',
                'The report you requested',
                task.result,
                'from@example.com',
                task.args[0].email)
    else:
        # Tell the admins something went wrong
        async_task('django.core.mail.mail_admins',
                'Report generation failed',
                task.result)