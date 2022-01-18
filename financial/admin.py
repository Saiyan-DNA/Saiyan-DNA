from django.contrib import admin

from .models import Account, Asset, CreditReport, CreditReportDetail, FinancialCategory, TransactionLog, TransferDetail
from .models import PayrollProfile, Paycheck, PaycheckDeduction


admin.site.register(Account)
admin.site.register(Asset)
admin.site.register(CreditReport)
admin.site.register(CreditReportDetail)
admin.site.register(FinancialCategory)
admin.site.register(PayrollProfile)
admin.site.register(Paycheck)
admin.site.register(PaycheckDeduction)
admin.site.register(TransactionLog)
admin.site.register(TransferDetail)
