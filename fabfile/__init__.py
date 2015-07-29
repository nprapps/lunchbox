#!/usr/bin/env python

from datetime import datetime
import json
import os

from boto.s3.key import Key
from fabric.api import local, require, settings, task
from fabric.state import env
from termcolor import colored

import app_config

# Other fabfiles
import flat
import render
import utils

# Bootstrap can only be run once, then it's disabled
if app_config.PROJECT_SLUG == '$NEW_PROJECT_SLUG':
    import bootstrap

"""
Base configuration
"""
env.forward_agent = True

env.hosts = []
env.settings = None

"""
Environments

Changing environment requires a full-stack test.
An environment points to both a server and an S3
bucket.
"""
@task
def electron():
    """
    Run as though building electron app.
    """
    env.settings = 'electron'
    app_config.configure_targets(env.settings)

@task
def fileserver():
    """
    Run as though building electron app.
    """
    env.settings = 'fileserver'
    app_config.configure_targets(env.settings)

@task
def production():
    """
    Run as though on production.
    """
    env.settings = 'production'
    app_config.configure_targets(env.settings)

@task
def staging():
    """
    Run as though on staging.
    """
    env.settings = 'staging'
    app_config.configure_targets(env.settings)

"""
Branches

Changing branches requires deploying that branch to a host.
"""
@task
def stable():
    """
    Work on stable branch.
    """
    env.branch = 'stable'

@task
def master():
    """
    Work on development branch.
    """
    env.branch = 'master'

@task
def branch(branch_name):
    """
    Work on any specified branch.
    """
    env.branch = branch_name

"""
Running the app
"""
@task
def app(port='8000'):
    """
    Serve app.py.
    """
    if env.settings:
        local("DEPLOYMENT_TARGET=%s bash -c 'gunicorn -b 0.0.0.0:%s --timeout 3600 --debug --reload app:wsgi_app'" % (env.settings, port))
    else:
        local('gunicorn -b 0.0.0.0:%s --timeout 3600 --debug --reload app:wsgi_app' % port)

@task
def public_app(port='8001'):
    """
    Serve public_app.py.
    """
    if env.settings:
        local("DEPLOYMENT_TARGET=%s bash -c 'gunicorn -b 0.0.0.0:%s --timeout 3600 --debug --reload public_app:wsgi_app'" % (env.settings, port))
    else:
        local('gunicorn -b 0.0.0.0:%s --timeout 3600 --debug --reload public_app:wsgi_app' % port)

@task
def tests():
    """
    Run Python unit tests.
    """
    local('nosetests')

"""
Deployment

Changes to deployment requires a full-stack test. Deployment
has two primary functions: Pushing flat files to S3 and deploying
code to a remote server if required.
"""

@task
def deploy(remote='origin', reload=False):
    """
    Deploy the latest app to S3 and, if configured, to our servers.
    """
    require('settings', provided_by=[production, staging, electron])

    render.render_all()

    if env.settings == 'electron':
        if not os.path.exists('electron'):
            os.makedirs('electron')

        local('npm run-script pack')

    if env.settings == 'fileserver':
        local('rsync -vr www/ %s@%s:%s/%s' % (
            app_config.FILE_SERVER_USER,
            app_config.FILE_SERVER,
            app_config.FILE_SERVER_PATH,
            app_config.PROJECT_SLUG
        ))

    else:
        flat.deploy_folder(
            app_config.S3_BUCKET,
            'www',
            app_config.PROJECT_SLUG,
            headers={
                'Cache-Control': 'max-age=%i' % app_config.DEFAULT_MAX_AGE
            },
            ignore=['www/img/*', 'www/live-data/*']
        )

        flat.deploy_folder(
            app_config.S3_BUCKET,
            'www/img',
            '%s/img' % app_config.PROJECT_SLUG,
            headers={
                'Cache-Control': 'max-age=%i' % app_config.ASSETS_MAX_AGE
            }
        )

"""
Destruction

Changes to destruction require setup/deploy to a test host in order to test.
Destruction should remove all files related to the project from both a remote
host and S3.
"""

@task
def shiva_the_destroyer():
    """
    Deletes the app from s3
    """
    require('settings', provided_by=[production, staging])

    utils.confirm(
        colored("You are about to destroy everything deployed to %s for this project.\nDo you know what you're doing?')" % app_config.DEPLOYMENT_TARGET, "red")
    )

    with settings(warn_only=True):
        flat.delete_folder(app_config.S3_BUCKET, app_config.PROJECT_SLUG)

        if app_config.DEPLOY_TO_SERVERS:
            servers.delete_project()

            if app_config.DEPLOY_CRONTAB:
                servers.uninstall_crontab()

            if app_config.DEPLOY_SERVICES:
                servers.nuke_confs()
