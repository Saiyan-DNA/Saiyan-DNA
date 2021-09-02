from django.shortcuts import render
from django.core.cache import cache

from django.conf import settings
from django_q.tasks import async_iter, async_task, schedule

import csv
from io import StringIO
import json
import uuid

from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from rest_framework.response import Response

from .models import ImportTemplate
from .tasks import import_transaction

@api_view(['GET', 'POST'])
def manage_keys(request, *arts, **kwargs):
    if (request.method == 'GET'):
        items = {}
        count = 0

        for key in cache.keys("*"):
            try:
                items[key] = {
                    'value': json.dumps(cache.get(key)),
                    'expires': cache.ttl(key)
                }
            except (TypeError, OverflowError):
                items[key] = {
                    'value': cache.get(key).__str__(),
                    'expires': cache.ttl(key)
                }

            count += 1
        
        response = {
            'count': count,
            'msg': f"Found {count} items in the Redis Cache.",
            'items': items
        }

        return Response(response, status=200)

class ImportView(APIView):
    parser_classes = [MultiPartParser, FormParser,]

    def put(self, request, *args, **kwargs):
        file_data = request.FILES.get('file').read().decode('utf-8')
        account_id = request.data.get('account_id')
        import_template_id = request.data.get('import_template_id')

        async_task('utilities.tasks.queue_import', file_data, request.user, account_id, import_template_id)

        return Response({'result': 'Import File Sent to Queue Processing.'}, status=200)

    def get(self, request, *args, **kwargs):

        return(Response({'msg':'Hello.'}))

@api_view(['GET', 'PUT'])
def import_file(request, *args, **kwargs):
    if (request.method == 'GET'):
       
        response = {
            'command': 'import',
            'data': 'PLACEHOLDER',
        }

        return Response(response, status=200)

    if (request.method == 'PUT'):
        file_obj = request.FILES.get('file')
        import_teplate = request.description
        print(file_obj.content_type)

        response = {
            'file_type': file_obj.content_type
        }

        return Response(response, status=200)