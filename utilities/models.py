from django.db import models

from core.models import User

# Create your models here.

class ImportType (models.Model):

    class DataType(models.TextChoices):
        FINANCIAL_TRANSACTION = "FT"
        FINANCIAL_CATEGORY = "FC"
        FINANCIAL_BUDGET = "FB"
        UNDEFINED = "UN"
    
    name = models.CharField(max_length=150, verbose_name="Name")
    description = models.CharField(max_length=300, verbose_name="Description", null=True)
    data_type = models.CharField(max_length=2, choices=DataType.choices, default=DataType.UNDEFINED, verbose_name="Data Format")

    def __str__(self):
        return f"{self.name} ({self.data_type})"

class ImportTemplate (models.Model):

    class DataFormat(models.TextChoices):
        UNKNOWN = "U"
        CSV = "C"
        XML = "X"

    class Delimiter (models.TextChoices):
        COMMA = "C"
        TAB = "T"
        PIPE = "P"
        NONE = "N"

    name = models.CharField(max_length=150, verbose_name="Name")
    import_type = models.ForeignKey(to=ImportType, related_name="import_template", on_delete=models.PROTECT)
    data_format = models.CharField(max_length=1, choices=DataFormat.choices, default=DataFormat.UNKNOWN, verbose_name="Data Format")
    file_delimiter = models.CharField(max_length=1, choices=Delimiter.choices, default=Delimiter.NONE, verbose_name="File Delimiter")

    def __str__(self):
        return f"{self.name} - {self.import_type.name} ({self.data_format})"

class ImportTask (models.Model):
    """
    Stores System-Generated Verification Codes (time-sensitive) used to activate newly registered accounts.
    """

    class TaskStatus(models.TextChoices):
        PENDING = "P"
        RUNNING = "R"
        HALTED = "H"
        CANCELLED = "C"
        SUCCESS = "S"
        ERROR = "E"
        WARNING = "W"


    user = models.ForeignKey(to=User, related_name="import_task", on_delete=models.CASCADE)
    import_template = models.ForeignKey(to=ImportTemplate, related_name="import_task", on_delete = models.CASCADE)
    created = models.DateTimeField(verbose_name="Created Time")
    completed = models.DateTimeField(verbose_name="Completed Time", auto_now_add=False, null=True)
    file_name = models.CharField(max_length=150,verbose_name="File Name")
    status = models.CharField(max_length=1, choices=TaskStatus.choices, default=TaskStatus.PENDING, verbose_name="Status")

    def __str__(self):
        return f"{self.user.username} - {self.code} ({self.expires})"

    class Meta:
        verbose_name_plural = "Verification Codes"
        ordering = ["-created"]