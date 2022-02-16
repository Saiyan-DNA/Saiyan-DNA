from django.apps import AppConfig
from django.core.signals import request_finished


class FinancialConfig(AppConfig):
    name = 'financial'

    def ready(self):
        from . import signals

