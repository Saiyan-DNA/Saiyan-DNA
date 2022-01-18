"""
Base Data Models for the Home Management Application
- Menu
- Home
- Home Access
"""

from enum import Enum
from django.db import models
from django.contrib.auth.models import User


class Menu(models.Model):
    """
    Stores Menu Items for Navigation
    """
    text = models.CharField("Text", max_length=200)
    tooltip = models.CharField("Tool-Tip", max_length=200, blank=True)
    path = models.CharField("Path", max_length=200, blank=True)
    position = models.IntegerField("Position", default=0)

    parent = models.ForeignKey(
        to="self",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="parent_menu"
    )

    @property
    def children(self):
        """
        Provides all children directly belonging to a parent menu item
        """
        return Menu.objects.filter(parent_id=self.id)

    @property
    def level(self):
        """
        Provides the level within the hierarchy where the menu item exists.
        """

        level = 0
        node = self
        while node.parent:
            level += 1
            node = node.parent

        return level


    def __str__(self):
        if self.tooltip:
            return "".join((self.text, " (", self.tooltip, ")"))

        return self.text

    class Meta:
        ordering = ["parent__text", "position", "text"]


class Home(models.Model):
    """
    Stores Homes added by users.
    """
    name = models.CharField("Name", max_length=200)
    street_address1 = models.CharField("Street Address 1", max_length=200, blank=True)
    street_address2 = models.CharField("Street Address 2", max_length=200, blank=True)
    city = models.CharField("City", max_length=200, blank=True)
    state = models.CharField("State", max_length=200, blank=True)
    zip_code = models.CharField("Zip Code", max_length=200, blank=True)

    owner = models.ForeignKey(to=User, related_name="homes", on_delete=models.PROTECT)

    def __str__(self):
        return f"{self.name} ({self.owner.username})"

    class Meta:
        ordering = ['name']


class HomeAccessChoice(Enum):
    """
    Choices for Home Access Permissions
    """
    RO = "Read Only"
    ED = "Editor"
    FC = "Full Control"

class HomeAccess(models.Model):
    """
    Stores Access Assignments for Users to Specific Home Entities
    """
    home = models.ForeignKey(to=Home, on_delete=models.PROTECT)
    user = models.ForeignKey(to=User, on_delete=models.PROTECT)
    access_level = models.CharField(
        verbose_name="Access Level",
        max_length=5,
        choices=[(tag.name, tag.value) for tag in HomeAccessChoice]
    )

    def __str__(self):
        return " - ".join((self.home.name, self.user.username))

    class Meta:
        verbose_name = "Home Access Assignment"
        verbose_name_plural = "Home Access Assignees"
        ordering = ["home__name"]

class Organization(models.Model):
    """
    Stores Organizations (Businesses) available to all users
    """

    class OrganizationType(models.TextChoices):
        CHARITY = "CTY"
        CREDIT_REPORTING_AGENCY = "CRA"
        EDUCATIONAL = "EDU"
        FINANCIAL = "FIN"
        GOVERNMENT = "GOV"
        MEDICAL = "MED"
        POLITICAL = "POL"
        RELIGIOUS = "RLG"
        RESTAURANT = "RST"
        RETAIL = "RTL"
        SERVICE = "SVC"

    name = models.CharField("Name", max_length=200, unique=True)
    organization_type = models.CharField(max_length=3, choices=OrganizationType.choices, default=OrganizationType.RETAIL, verbose_name="Organization Type")
    website_url = models.URLField(verbose_name="Website URL", null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.get_organization_type_display()})"

    class Meta:
        verbose_name = "Organization"
        verbose_name_plural = "Organizations"
        ordering =["organization_type", "name"]
        

class Person(models.Model):
    """
    Stores People (who may not be users) that reside within a Home.
    """
    class PersonStatus(models.TextChoices):
        ACTIVE = "A"
        INACTIVE = "I"
        PENDING = "P"
        NONE = "N"

    first_name = models.CharField("First Name", max_length=200)
    middle_name = models.CharField("Middle Name", max_length=200, blank=True)
    last_name = models.CharField("Last Name", max_length=200)
    status = models.CharField(max_length=1, choices=PersonStatus.choices, default=PersonStatus.NONE, verbose_name="Status")

    home = models.ForeignKey(to=Home, on_delete=models.PROTECT)
    user_account = models.OneToOneField(to=User, related_name="profile", on_delete=models.PROTECT, null=True, blank=True)

    def __str__(self):
        return ", ".join((self.last_name, self.first_name))

    class Meta:
        verbose_name_plural = "People"
        ordering = ["last_name", "first_name"]

class VerificationCode (models.Model):
    """
    Stores System-Generated Verification Codes (time-sensitive) used to activate newly registered accounts.
    """

    class CodeStatus(models.TextChoices):
        ACTIVE = "A"
        EXPIRED = "X"
        COMPLETED = "C"
        REVOKED = "R"

    user = models.ForeignKey(to=User, related_name="verification_code", on_delete=models.CASCADE)
    code = models.CharField("Code", max_length=6)
    create_date = models.DateTimeField("Create Date")
    expires = models.DateTimeField("Expires", auto_now_add=False)
    status = models.CharField(max_length=1, choices=CodeStatus.choices, default=CodeStatus.ACTIVE, verbose_name="Status")

    def __str__(self):
        return f"{self.user.username} - {self.code} ({self.expires})"

    class Meta:
        verbose_name_plural = "Verification Codes"
        ordering = ["-create_date"]