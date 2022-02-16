from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from .models import Account, TransactionLog, TransferDetail


@receiver(post_delete, sender=TransactionLog)
def transaction_delete(sender, **kwargs):
    '''
    Perform additional update actions when transactions are deleted.
    
    1. Update the balance of the account that the transaction is associated with.
    '''

    transaction_type = kwargs['instance'].transaction_type
    transaction_amount = kwargs['instance'].amount
    account = Account.objects.get(id=kwargs['instance'].account_id)

    if transaction_type != 'TRN':
        account.update_balance(transaction_type=transaction_type, amount=transaction_amount*-1)


@receiver(post_delete, sender=TransferDetail)
def transfer_delete(sender, **kwargs):
    '''
    Perform additional update actions when transfer transactions are deleted.

    2. Update the balances of both accounts that the transfer affects.
    '''

    transfer_debit = kwargs['instance'].transfer_debit_transaction
    debit_account = Account.objects.get(id=transfer_debit.account_id)
    
    transfer_credit = kwargs['instance'].transfer_credit_transaction
    credit_account = Account.objects.get(id=transfer_credit.account_id)

    debit_account.update_balance(transaction_type='DBT', amount=transfer_debit.amount*-1)
    credit_account.update_balance(transaction_type='CRD', amount=transfer_credit.amount*-1)

