/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

const ProjectModel = require('../models/projects')


module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(async (req, res) => {
      let project = req.params.project;
      let response = await ProjectModel.listAllIssues(project)
      if (!response) {
        res.send('project could not be found')
      }
      console.log('project: ', project)
      console.log('response: ', response)
    })

    .post(function (req, res) {
      let project = req.params.project;

    })

    .put(function (req, res) {
      let project = req.params.project;

    })

    .delete(function (req, res) {
      let project = req.params.project;

    });

};