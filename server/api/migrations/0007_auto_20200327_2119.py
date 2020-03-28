# Generated by Django 2.2.7 on 2020-03-27 21:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_auto_20200327_0445'),
    ]

    operations = [
        migrations.AlterField(
            model_name='equationtype',
            name='category',
            field=models.CharField(max_length=128),
        ),
        migrations.AlterUniqueTogether(
            name='equationtype',
            unique_together={('coordinate_system', 'category')},
        ),
    ]