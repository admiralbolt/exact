# Generated by Django 2.2.7 on 2020-04-15 03:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_auto_20200414_0320'),
    ]

    operations = [
        migrations.CreateModel(
            name='FroalaImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image_file', models.FileField(upload_to='images/')),
            ],
        ),
    ]
