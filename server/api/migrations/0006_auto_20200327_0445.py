# Generated by Django 2.2.7 on 2020-03-27 04:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_page'),
    ]

    operations = [
        migrations.RenameField(
            model_name='equationtype',
            old_name='name',
            new_name='category',
        ),
        migrations.AddField(
            model_name='equationtype',
            name='coordinate_system',
            field=models.CharField(choices=[('cartesian', 'Cartesian'), ('cylindrical', 'Cylindrical'), ('spherical', 'Spherical'), ('other', 'Other')], default='cartesian', max_length=32),
        ),
    ]
