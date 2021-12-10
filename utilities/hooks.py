from django_q.tasks import async_task, result

def import_complete(task):
    print(f"Finished Import! {task.result}")