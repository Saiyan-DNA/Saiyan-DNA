'''
Django Models for the Accounting Application Data
'''

from django.db import models
from django.db.models import Q
from django.contrib.auth.models import User
from django.core.cache import cache
from django.forms.models import model_to_dict

from core.models import Home, Organization, Person


def clear_cache_item(key):
    '''
    Clear a cache item
    '''
    try:
        cache.delete(key)
    except KeyError:
        print(f"Warning: Cannot delete cached data '{key}'. It could not be found.")


class Account(models.Model):
    '''
    Financial Account (Checking, Savings, Credit Card, Loan, etc.)
    '''

    class AccountType(models.TextChoices):
        CHECKING = 'CK'
        SAVINGS = 'SV'
        CREDIT = 'CR'
        LOAN = 'LN'
        INVESTMENT = 'IN'
        BILLING = 'BL'

    name = models.CharField(max_length=150, verbose_name="Name")
    account_type = models.CharField(max_length=2, choices=AccountType.choices, default=AccountType.CHECKING, verbose_name="Account Type")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Create Date")
    current_balance = models.FloatField(verbose_name="Current Balance")
    balance_updated_at = models.DateTimeField(auto_now_add=True, verbose_name="Updated Date")
    interest_rate = models.FloatField(verbose_name='Interest Rate', null=True)
    credit_limit = models.FloatField(verbose_name="Credit Limit", null=True)
    owner = models.ForeignKey(User, related_name="accounts", verbose_name="Owner", on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, verbose_name="Organization", on_delete=models.PROTECT)
    is_closed = models.BooleanField(verbose_name="Is Closed")
    close_date = models.DateField(verbose_name="Close Date", null=True, blank=True)

    def __str__(self):
        balance_string = "${:,.2f}".format(self.current_balance)
        return '{} - {} ({})'.format(self.organization.name, self.name, balance_string)

    def update_balance(self, transaction_type, amount):
        '''
        Update the current balance of the account.
        '''

        # Debit transactions
        if transaction_type == 'DBT' and self.account_type in ('CK', 'SV', 'IV'):
            self.current_balance -= amount
        elif transaction_type == 'DBT' and self.account_type in ('CR', 'LN', 'BL'):
            self.current_balance += amount
        elif transaction_type == 'CRD' and self.account_type in ('CK', 'SV', 'IV'):    
            self.current_balance += amount
        elif transaction_type == 'CRD' and self.account_type in ('CR', 'LN', 'BL'):
            self.current_balance -= amount

        # Save the update to the account.
        self.save()

        # Clear the Accounts Cache for the user to ensure updated account balances are reported.
        clear_cache_item(f"accounts_{self.owner.id}")

    class Meta:
        ordering = ['organization', 'account_type', 'name']
        permissions = [('can_edit_balance', 'Can edit account balance')]


class Asset(models.Model):
    '''
    Retains financial assets, properties, and other items with material resale value.
    '''

    name = models.CharField(max_length=150, verbose_name="Name")
    asset_type = models.CharField(max_length=100, verbose_name="Asset Type")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Create Date")
    current_value = models.FloatField(verbose_name="Current Value")
    value_updated_at = models.DateTimeField(auto_now_add=True, verbose_name="Updated Date")
    owner = models.ForeignKey(User, related_name="assets", verbose_name="Owner", on_delete=models.CASCADE, null=True)

    def __str__(self):
        value_string = "${:,.2f}".format(self.current_value)
        return '{} ({}) - {}'.format(self.name, self.asset_type, value_string)

    class Meta:
        ordering = ['asset_type', 'name']


class CategoryManager(models.Manager):
    """
    Manager for the Category Model
     - Get Hierarchy - Returns a Full Hierarchy of the categories.
     - Get Choices - Returns a hierarchy of choices for a Select2 control.
    """
    def get_hierarchy(self, home_id):
        """
        Provides the hierarchy of Categories based on recursive parent/child relationships.
        """
        category_tree = [{
            "level": x.level,
            "id": x.id,
            "name": x.name,
            "description": x.description,
            "home": model_to_dict(x.home) if x.home else None,
            "children": [],
            } for x in FinancialCategory.objects.filter(
                Q(home__id=home_id) | Q(home=None),
                parent_category__isnull=True)]

        for cat in category_tree:
            cat["children"] = [{
                "level": x.level,
                "id": x.id,
                "name": x.name,
                "description": x.description,
                "home": model_to_dict(x.home) if x.home else None,
                "children": [],
                } for x in FinancialCategory.objects.filter(Q(home__id=home_id) | Q(home=None), parent_category_id=cat.get("id"))]

            if cat["children"]:
                traversing = True
                current_cat = cat

                while traversing:
                    for current in current_cat["children"]:
                        current["children"] = [
                            {
                                "level": x.level,
                                "id": x.id,
                                "name": x.name,
                                "description": x.description,
                                "home": model_to_dict(x.home) if x.home else None,
                                "children": [],
                            } for x in FinancialCategory.objects.filter(Q(home__id=home_id) | Q(home=None),
                                parent_category_id=current.get("id"))
                            ]

                        if current["children"]:
                            current_cat = current
                        else:
                            traversing = False

        return category_tree

    def get_choices(self):
        """
        Provides Category Choices available, formatted for a Select2 Dropdown-List
        """

        categories = FinancialCategory.objects.all()
        levels = max([x.level for x in FinancialCategory.objects.filter(parent_category_id__isnull=False)])

        tree = {}

        for i in range(0, levels+1):
            tree[i] = []


        for cat in categories:
            entry = []
            if cat.parent_category:
                entry.append(cat.parent_category_id)

            if cat.child_categories:
                entry.append(cat.id)
                entry.append(cat.name)
                entry.append([])
            else:
                entry.append(cat.id)
                entry.append(cat.name)

            tree[cat.level].append(entry)

        for i in range(levels, 0, -1):
            for cat in tree[i]:
                for parent in tree[i-1]:
                    if i > 1:
                        if parent[1] == cat[0]:
                            cat.pop(0)
                            if len(cat) > 2:
                                if isinstance(cat[2], str):
                                    cat.pop(0)
                            parent[3].append(cat)
                    else:
                        if parent[0] == cat[0]:
                            cat.pop(0)
                            if len(cat) > 2:
                                if not isinstance(cat[2], str):
                                    cat.pop(0)
                            parent[2].append(cat)

        for root_cat in tree[0]:
            if len(root_cat) > 2:
                root_cat.pop(0)
        return tree[0]


class CreditReport(models.Model):
    """
    Retains Credit Reports for a Person.
    """

    owner = models.ForeignKey(User, related_name="credit_reports", verbose_name="Owner", on_delete=models.CASCADE)
    agency = models.ForeignKey(Organization, related_name="credit_reports", verbose_name="Agency", on_delete=models.CASCADE)
    date = models.DateField(verbose_name="Date")
    credit_score = models.IntegerField(verbose_name="Credit Score")
    
    def __str__(self):
        return f"{self.owner} - {self.agency.name} ({self.date})"

    class Meta:
        verbose_name = "Credit Report"
        ordering = ['owner', '-date', 'agency']


class CreditReportDetail(models.Model):
    """
    Retains details (accounts, balances, inquiries, etc.) associated with a Credit Report
    """

    class DetailType(models.TextChoices):
        ACCOUNT = 'AC', 'Account'
        INQUIRY = 'IN', 'Inquiry'
        PUBLIC_RECORD = 'PR', 'Public Record'

    class AccountType(models.TextChoices):
        CREDIT_CARD = 'CC', 'Credit Card'
        AUTO_LOAN = 'AL', 'Auto Loan'
        PERSONAL_LOAN = 'PL', 'Personal Loan'
        REAL_ESTATE = 'RE', 'Real Estate'
        OTHER = 'OT', 'Other'

    class AccountStatus(models.TextChoices):
        CURRENT = 'CU', 'Current'
        CLOSED = 'CL', 'Closed'
        PAST_DUE = 'PD', 'Past Due'
        COLLECTIONS = 'CO', 'Collections'

    report = models.ForeignKey(CreditReport, related_name="details", verbose_name="Report", on_delete=models.CASCADE, null=False, blank=False)
    detail_type = models.CharField(verbose_name="Detail Type", max_length=2, choices=DetailType.choices, null=False, blank=False)
    account_type = models.CharField(verbose_name="Account Type", max_length=2, choices=AccountType.choices, null=False, blank=False)
    organization = models.ForeignKey(to=Organization, on_delete=models.PROTECT, related_name="credit_report_details", null=True, blank=True)
    current_balance = models.DecimalField(verbose_name="Current Balance", max_digits=12, decimal_places=2, null=True, blank=True)
    credit_limit = models.DecimalField(verbose_name="Credit Limit", max_digits=12, decimal_places=2, null=True, blank=True)
    account_status = models.CharField(verbose_name="Account Status", max_length=2, choices=AccountStatus.choices, null=True, blank=True)
    account_opened_date = models.DateField(verbose_name="Account Opened Date", null=True, blank=True)
    account_closed_date = models.DateField(verbose_name="Account Closed Date", null=True, blank=True)
    inquiry_date = models.DateField(verbose_name="Inquiry Date", null=True, blank=True)
    comment = models.TextField(verbose_name="Comment", null=True, blank=True)

    def __str__(self):
        return f"{self.report} - {self.get_detail_type_display()} - {self.organization}"

    class Meta:
        verbose_name = "Credit Report Detail"
        ordering = ['report', 'detail_type', 'organization']


class FinancialCategory(models.Model):
    """
    Retains Financial Categories for classifying Financial Transactions
    """

    name = models.CharField(max_length=200, verbose_name="Name")
    description = models.CharField(max_length=500, verbose_name="Description", null=True, blank=True)
    
    parent_category = models.ForeignKey(
        to="self",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="children"
    )

    home = models.ForeignKey(
        to=Home,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="financial_categories"
    )

    @property
    def child_categories(self):
        """
        Provides the sub-categories belonging to a category.
        """

        return FinancialCategory.objects.filter(parent_category_id=self.pk)
    
    @property
    def level(self):
        """
        Provies the level in the heirarchy at which the category resides.
        """

        level = 0
        cat = self
        while cat.parent_category:
            level += 1
            cat = cat.parent_category

        return level

    @property
    def path_name(self):
        if (self.parent_category):
            return f"{self.parent_category} > {self.name}"

        return self.name

    def __str__(self):
        if (self.parent_category):
            return f"{self.parent_category} > {self.name}"

        return self.name


    objects = CategoryManager()

    class Meta:
        verbose_name_plural = "Financial Categories"
        ordering = ["parent_category__name", "name"]


class PayrollProfile(models.Model):
    """
    Retains basic information about an income stream from an employer's payroll.
    """

    class EmploymentType(models.TextChoices):
        FULL_TIME = 'FT', 'Full Time'
        PART_TIME = 'PT', 'Part Time'
        CONTRACT = 'CT', 'Contract'
        TEMPORARY = 'TM', 'Temporary'
        INTERN = 'IN', 'Intern'

    class PayrollType(models.TextChoices):
        SALARY = 'S', 'Salary'
        HOURLY = 'H', 'Hourly'
        GIG = "G", "Gig"

    name = models.CharField(max_length=200, verbose_name="Name", null=False, blank=False)
    person = models.ForeignKey(to=Person, related_name="payroll_profile", on_delete=models.PROTECT, null=False, blank=False)
    employer = models.ForeignKey(to=Organization, related_name="payroll_profile", on_delete=models.PROTECT, null=False, blank=False)
    employment_type = models.CharField(max_length=2, verbose_name="Employment Type", choices=EmploymentType.choices, default=EmploymentType.FULL_TIME, null=False, blank=False)
    payroll_type = models.CharField(max_length=1, verbose_name="Payroll Type", choices=PayrollType.choices, default=PayrollType.SALARY, null=False, blank=False)
    start_date = models.DateField(verbose_name="Start Date", null=False, blank=False)
    end_date = models.DateField(verbose_name="End Date", null=True, blank=True)
    current_salary = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Current Salary", null=True, blank=True)
    current_hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Current Hourly Rate", null=True, blank=True)

    def __str__(self):
        return f"{self.name} - {self.person} ({self.employer})"

    class Meta:
        verbose_name_plural = "Payroll Profiles"
        ordering = ["person", "-start_date"]


class Paycheck(models.Model):
    """
    Retains information about a paycheck.
    """

    payroll_profile = models.ForeignKey(to=PayrollProfile, related_name="paychecks", on_delete=models.PROTECT, null=False, blank=False)
    issue_date = models.DateField(verbose_name="Issue Date", null=False, blank=False)
    period_start = models.DateField(verbose_name="Period Start", null=False, blank=False)
    period_end = models.DateField(verbose_name="Period End", null=False, blank=False)
    gross_pay = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Gross Pay", null=False, blank=False)
    net_pay = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Net Pay", null=False, blank=False)

    def __str__(self):
        return f"{self.payroll_profile} - {self.issue_date} - {self.gross_pay}"

    class Meta:
        verbose_name_plural = "Paychecks"
        ordering = ["payroll_profile", "-issue_date"]


class PaycheckDeduction(models.Model):
    """
    Retains information about a paycheck withholding.
    """

    class DeductionType(models.TextChoices):
        FEDERAL = 'FT', 'Federal Income Tax'
        STATE = 'ST', 'State Income Tax'
        LOCAL = 'LT', 'Local Income Tax'
        SOCIAL_SECURITY = 'SS', 'Social Security'
        MEDICARE = 'MC', 'Medicare'
        RETIREMENT = 'RT', 'Retirement'
        HEALTH_INSURANCE = 'HI', 'Health Insurance'
        DENTAL_INSURANCE = 'DI', 'Dental Insurance'
        VISION_INSURANCE = 'VI', 'Vision Insurance'
        LIFE_INSURANCE = 'LI', 'Supplemental Life Insurance'
        FSA = 'FS', 'Flex-Spending Account'
        HSA = 'HS', 'Health Savings Account'
        OTHER = 'OT', 'Other'

    paycheck = models.ForeignKey(to=Paycheck, related_name="deductions", on_delete=models.PROTECT, null=False, blank=False)
    deduction_type = models.CharField(max_length=2, verbose_name="Type", choices=DeductionType.choices, default=DeductionType.OTHER, null=False, blank=False)
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Amount", null=False, blank=False)
    pretax = models.BooleanField(verbose_name="Pre-tax Deduction", default=False, null=False, blank=False)
    description = models.CharField(max_length=200, verbose_name="Description", null=True, blank=True)

    def __str__(self):
        return f"{self.paycheck} - {self.deduction_type} - {self.amount}"

    class Meta:
        verbose_name_plural = "Paycheck Deductions"
        ordering = ["paycheck", "-amount"]


class TransactionLog(models.Model):
    '''
    Log of Transactions for Financial Accounts
    '''

    class TransactionType(models.TextChoices):
        DEBIT = 'DBT'
        CREDIT = 'CRD'
        TRANSFER = 'TRN'

    summary = models.CharField(max_length=100, verbose_name="Summary")
    description = models.CharField(max_length=255, verbose_name="Description", blank=True)
    transaction_date = models.DateTimeField(verbose_name="Transaction Date")
    transaction_type = models.CharField(max_length=3, choices=TransactionType.choices, default=TransactionType.DEBIT, verbose_name="Transaction Type")
    amount = models.FloatField(verbose_name="Amount")
    
    account = models.ForeignKey(Account, verbose_name="Account", on_delete=models.PROTECT)
    financial_category = models.ForeignKey(FinancialCategory, verbose_name="Financial Category", on_delete=models.PROTECT, blank=True, null=True)
    owner = models.ForeignKey(User, related_name="transactions", verbose_name="Owner", on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, related_name="transactions", verbose_name="Organization", on_delete=models.PROTECT, null=True, blank=True)

    def __str__(self):
        return '{} - {} ({})'.format(self.summary, self.amount, self.account)

    def __init__(self, *args, **kwargs):
        super(TransactionLog, self).__init__(*args, **kwargs)
        self.__original_amount = self.amount

    def save(self, force_insert=False, force_update=False, *args, **kwargs):
        '''
        On save of any transactions, update the associated account balance.

        Notes:
            - Deletions are better handled through Signals per django docs.
            - Updates to account balances for newly created transfers are handled 
              by the TransferDetail model's save() method
        '''

        account = Account.objects.get(id=self.account_id)
        
        if self.id is None and self.transaction_type != 'TRN':
            # Non-Transfer Type transaction Transaction Added
            account.update_balance(transaction_type=self.transaction_type, amount=self.amount)
        else:
            if self.amount != self.__original_amount:
                delta = self.amount - self.__original_amount

                # Debit and Credit Transactions
                if self.transaction_type != 'TRN':
                    account.update_balance(transaction_type=self.transaction_type, amount=delta)
                
                # Transfer Transactions
                if self.transaction_type == 'TRN':
                    transfer_detail = TransferDetail.objects.filter(Q(transfer_credit_transaction=self.id) | Q(transfer_debit_transaction=self.id))
                    if (transfer_detail.__len__() != 1):
                        print("Could not find the transfer detail for this transaction.")
                        return False

                    transfer_debit = transfer_detail.first().transfer_debit_transaction
                    transfer_credit = transfer_detail.first().transfer_credit_transaction

                    if self.id == transfer_debit.id:    
                        account.update_balance(transaction_type='DBT', amount=delta)
                    elif self.id == transfer_credit.id:
                        account.update_balance(transaction_type='CRD', amount=delta)

        super(TransactionLog, self).save(force_insert, force_update, *args, **kwargs)
        self.__original_amount = self.amount

    class Meta:
        verbose_name = "Transaction Log"
        ordering = ['account', '-transaction_date']


class TransferDetail(models.Model):
    '''
    Retains reference of accounts transferred to & from for 'Transfer' Type transactions.
    '''

    transfer_debit_transaction = models.OneToOneField(TransactionLog, related_name="transfer_detail_debit", verbose_name="Transfer Debit Transaction", on_delete=models.PROTECT)
    transfer_credit_transaction = models.OneToOneField(TransactionLog, related_name="transfer_detail_credit", verbose_name="Transfer Debit Transaction", on_delete=models.PROTECT)
    owner = models.ForeignKey(User, related_name="transfers", verbose_name="Owner", on_delete=models.CASCADE)

    def __str__(self):
        return '{} - {} ({})'.format(self.transfer_debit_transaction.account, self.transfer_credit_transaction.account, self.transfer_credit_transaction.amount)

    def __init__(self, *args, **kwargs):
        super(TransferDetail, self).__init__(*args, **kwargs)
        self.__original_debit = self.transfer_debit_transaction
        self.__original_credit = self.transfer_credit_transaction

    def save(self, force_insert=False, force_update=False, *args, **kwargs):
        '''
        On save of any new transfer records, update the associated account balances.
        Note - deletions are better handled through Signals per django docs.
        '''

        if self.id is None:
            transfer_debit = self.transfer_debit_transaction
            debit_account = Account.objects.get(id=transfer_debit.account_id)
            transfer_credit = self.transfer_credit_transaction
            credit_account = Account.objects.get(id=transfer_credit.account_id)

            debit_account.update_balance(transaction_type='DBT', amount=transfer_debit.amount)
            credit_account.update_balance(transaction_type='CRD', amount=transfer_credit.amount)
        else:
            # Transfer Transaction was modified.
            print('Modified transfer transaction. Not yet properly handled!')

        super(TransferDetail, self).save(force_insert, force_update, *args, **kwargs)        

    class Meta:
        verbose_name = "Transfer Detail"


class AccountStatement(models.Model):
    '''
    Financial Account Statements
    '''

    account = models.ForeignKey(Account, related_name="statements", verbose_name="Account", on_delete=models.CASCADE)
    issue_date = models.DateField(verbose_name="Issue Date")
    due_date = models.DateField(verbose_name="Due Date")
    period_start = models.DateField(verbose_name="Period Start")
    period_end = models.DateField(verbose_name="Period End")
    previous_balance = models.FloatField(verbose_name="Previous Balance")
    account_debits = models.FloatField(verbose_name="Account Debits")
    account_credits = models.FloatField(verbose_name="Account Credits")
    current_balance = models.FloatField(verbose_name="Current Balance")
    minimum_due = models.FloatField(verbose_name="Minimum Due", null=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Create Date")
    is_paid = models.BooleanField(default=False, verbose_name="Paid")
    payment_transaction = models.OneToOneField(TransactionLog, related_name="bill_payment", verbose_name="Payment Transaction", null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return '{} - {} ({})'.format(self.account.organization.name, self.account.name, self.due_date)

    class Meta:
        verbose_name = "Account Statement"
        ordering = ['account', '-created_at']