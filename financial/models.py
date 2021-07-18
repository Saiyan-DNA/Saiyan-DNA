'''
Django Models for the Accounting Application Data
'''

from django.db import models
from django.db.models import Q
from django.contrib.auth.models import User
from django.forms.models import model_to_dict

from core.models import Home, Organization


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

    name = models.CharField(max_length=150, verbose_name="Name")
    account_type = models.CharField(max_length=2, choices=AccountType.choices, default=AccountType.CHECKING, verbose_name="Account Type")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Create Date")
    current_balance = models.FloatField(verbose_name="Current Balance")
    balance_updated_at = models.DateTimeField(auto_now_add=True, verbose_name="Updated Date")
    interest_rate = models.FloatField(verbose_name='Interest Rate', null=True)
    credit_limit = models.FloatField(verbose_name="Credit Limit", null=True)
    owner = models.ForeignKey(User, related_name="accounts", verbose_name="Owner", on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, verbose_name="Organization", on_delete=models.PROTECT)

    def __str__(self):
        balance_string = "${:,.2f}".format(self.current_balance)
        return '{} - {} ({})'.format(self.organization.name, self.name, balance_string)

    class Meta:
        ordering = ['organization', 'account_type', 'name']


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

    class Meta:
        verbose_name = "Transfer Detail"
