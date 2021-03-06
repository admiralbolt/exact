# Generated by Django 2.2.7 on 2020-03-23 00:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='equation',
            name='is_live',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='equation',
            name='source_file',
            field=models.FileField(blank=True, upload_to='sources/'),
        ),
    ]
