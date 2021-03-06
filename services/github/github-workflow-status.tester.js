'use strict'

const Joi = require('joi')
const { isBuildStatus } = require('../build-status')
const t = (module.exports = require('../tester').createServiceTester())

const isWorkflowStatus = Joi.alternatives()
  .try(isBuildStatus, Joi.equal('no status'))
  .required()

t.create('nonexistent repo')
  .get('/badges/shields-fakeness/fake.json')
  .expectBadge({
    label: 'build',
    message: 'repo, branch, or workflow not found',
  })

t.create('nonexistent workflow')
  .get('/actions/toolkit/not-a-real-workflow.json')
  .expectBadge({
    label: 'build',
    message: 'repo, branch, or workflow not found',
  })

t.create('valid workflow')
  .get('/actions/toolkit/toolkit-unit-tests.json')
  .expectBadge({
    label: 'build',
    message: isWorkflowStatus,
  })

t.create('valid workflow (branch)')
  .get('/actions/toolkit/toolkit-unit-tests/master.json')
  .expectBadge({
    label: 'build',
    message: isWorkflowStatus,
  })

t.create('valid workflow (event)')
  .get('/actions/toolkit/toolkit-unit-tests.json?event=push')
  .expectBadge({
    label: 'build',
    message: isWorkflowStatus,
  })
