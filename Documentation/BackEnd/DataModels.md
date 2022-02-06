# Data Models

[< Back to Index](index.md)

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Core](#core)
  - [Home](#home)
  - [Organization](#organization)
- [Financial](#financial)

***

## Core

### Home

|Field Name|Data Type|Allow Null/Blank|Description|
|:--|:--|:--:|:---|
|name|CharField|No|The user-specified name for the home|
|street_address1|CharField|Yes|The home's street address (line 1)|
|street_address2|CharField|Yes|The home's street address (line 2)|
|city|CharField|Yes|The city where the home is located|
|zip_code|CharField|Yes|The zip code where the home is located|
|owner|ForeignKey|No|The owner (creator) of the home|

**Related Models**

- User

**Definition**

```python
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
```



### Organization

|Field Name|Data Type|Allow Null/Blank|Description|
|:--|:--|:--:|:---|
|name|CharField|No|The organization's name|
|organization_type|ChoiceField|No|The type of organization|
|website_url|URLField|Yes|The organization's website URL|
|created_by|ForeignKey|Yes|The user who created the organization|

**Related Models**

- User

**Choices**

- Organization Type
  - Charity (CTY)
  - Credit Reporting Agency (CRA)
  - Educational (EDU)
  - Financial (FIN)
  - Government (GOV)
  - Medical (MED)
  - Other (OTH)
  - Political (POL)
  - Religious (RLG)
  - Restaurant (RST)
  - Retail (RTL)
  - Service (SVC)

**Definition**

```python
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
        OTHER = "OTH"
        POLITICAL = "POL"
        RELIGIOUS = "RLG"
        RESTAURANT = "RST"
        RETAIL = "RTL"
        SERVICE = "SVC"

    name = models.CharField("Name", max_length=200, unique=True)
    organization_type = models.CharField(max_length=3, choices=OrganizationType.choices, default=OrganizationType.RETAIL, verbose_name="Organization Type")
    website_url = models.URLField(verbose_name="Website URL", null=True, blank=True)
    created_by = models.ForeignKey(to=User, related_name="organizations", on_delete=models.CASCADE, verbose_name="Created By", null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.get_organization_type_display()})"

    class Meta:
        verbose_name = "Organization"
        verbose_name_plural = "Organizations"
        ordering =["name"]
```

***

## Financial