# Generated by Django 2.2.7 on 2020-04-08 20:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_auto_20200404_1723'),
    ]

    operations = [
        migrations.AlterField(
            model_name='equationtype',
            name='ordinal',
            field=models.FloatField(blank=True),
        ),
    ]
