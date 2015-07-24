#!/usr/bin/env python

"""
Project-wide application configuration.

DO NOT STORE SECRETS, PASSWORDS, ETC. IN THIS FILE.
They will be exposed to users. Use environment variables instead.
See get_secrets() below for a fast way to access them.
"""

import os

"""
NAMES
"""
# Project name to be used in urls
# Use dashes, not underscores!
PROJECT_SLUG = 'lunchbox'

# Project name to be used in file paths
PROJECT_FILENAME = 'lunchbox'

# The name of the repository containing the source
REPOSITORY_NAME = 'lunchbox'
GITHUB_USERNAME = 'nprapps'
REPOSITORY_URL = 'git@github.com:%s/%s.git' % (GITHUB_USERNAME, REPOSITORY_NAME)
REPOSITORY_ALT_URL = None # 'git@bitbucket.org:nprapps/%s.git' % REPOSITORY_NAME'

DEV_CONTACT = 'EDIT THIS IN APP_CONFIG.PY'

"""
DEPLOYMENT
"""
PRODUCTION_S3_BUCKET = 'apps.npr.org'

STAGING_S3_BUCKET = 'stage-apps.npr.org'

ASSETS_S3_BUCKET = 'assets.apps.npr.org'

DEFAULT_MAX_AGE = 20

# These variables will be set at runtime. See configure_targets() below
S3_BUCKET = None
S3_BASE_URL = None
S3_DEPLOY_URL = None
DEBUG = True

"""
Utilities
"""
def get_secrets():
    """
    A method for accessing our secrets.
    """
    secrets_dict = {}

    for k,v in os.environ.items():
        if k.startswith(PROJECT_SLUG):
            k = k[len(PROJECT_SLUG) + 1:]
            secrets_dict[k] = v

    return secrets_dict

def configure_targets(deployment_target):
    """
    Configure deployment targets. Abstracted so this can be
    overriden for rendering before deployment.
    """
    global S3_BUCKET
    global S3_BASE_URL
    global S3_DEPLOY_URL
    global DEBUG
    global DEPLOYMENT_TARGET

    if deployment_target == 'production':
        S3_BUCKET = PRODUCTION_S3_BUCKET
        S3_BASE_URL = 'http://%s/%s' % (S3_BUCKET, PROJECT_SLUG)
        S3_DEPLOY_URL = 's3://%s/%s' % (S3_BUCKET, PROJECT_SLUG)
        DEBUG = False
    elif deployment_target == 'staging':
        S3_BUCKET = STAGING_S3_BUCKET
        S3_BASE_URL = 'http://%s/%s' % (S3_BUCKET, PROJECT_SLUG)
        S3_DEPLOY_URL = 's3://%s/%s' % (S3_BUCKET, PROJECT_SLUG)
        DEBUG = True
    else:
        S3_BUCKET = None
        S3_BASE_URL = 'http://127.0.0.1:8000'
        S3_DEPLOY_URL = None
        DEBUG = True

    DEPLOYMENT_TARGET = deployment_target

"""
Run automated configuration
"""
DEPLOYMENT_TARGET = os.environ.get('DEPLOYMENT_TARGET', None)

configure_targets(DEPLOYMENT_TARGET)
