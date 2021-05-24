from django.contrib import admin

from .models import Account, Asset, FinancialCategory, TransactionLog, TransferDetail


admin.site.register(Account)
admin.site.register(Asset)
admin.site.register(FinancialCategory)
admin.site.register(TransactionLog)
admin.site.register(TransferDetail)
