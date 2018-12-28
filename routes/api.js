/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

const ProjectModel = require('../models/projects')

const isEmpty = (obj) => {
  for(let key in obj) {
    if(obj.hasOwnProperty(key))
    return false
  }
  return true
}


module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(async (req, res) => {

      const project = req.params.project;
      const { query } = req
      let response

      if(isEmpty(req.query)) {
        try{response = await ProjectModel.listAllIssues(project)}
        catch(err){console.error('Failed to access db', err)}
        if (!response) {
          res.send('project could not be found')
        }
        res.json(response.issues)
      } else {
        try{response = await ProjectModel.listFilteredIssues(project, query)}
        catch(err){console.error('Failed to access db', err)}
        console.log(response)
        res.json(response[0].issues)
      }
    })

    .post(async (req, res) => {
      const project = req.params.project;
      const issue = req.body
      const {
        issue_title,
        issue_text,
        created_by
      } = req.body

      if (!issue_title || !issue_text || !created_by) {
        res.send('missing inputs')
      } 
      else {
        let check
        //Check if project exists
        try{check = await ProjectModel.findProject(project)}
        catch(err){console.error('Failed to access db', err)}
        //If not create project
        if(!check) { 
          try{await ProjectModel.addProject(project)}
          catch(err){ console.error('failed to create new Project', err)}
        }
        //Add issue to project
        let response
        try{response = await ProjectModel.addIssue(project, issue)}
        catch(err) {console.error('failed to add issue', err)}
        //Return added issue
        res.json(response.issues[0])
      }
    })

    .put(async (req, res) => {
      const project = req.params.project;
      const id = req.body._id
      let changes = {}

      for(let prop in req.body) {
        if(
          req.body[prop] !== undefined &&
          req.body[prop] !== "" &&
          prop !== '_id'
          ) {
            changes[prop] = req.body[prop]
          }
      }
      if(!id) {res.send('_id error')}
      else if(changes.length === 0){
        res.send('no updated field sent')
      } else {
        let response
        try {
          response = await ProjectModel.findIssue(id)
          
          const oldIssue = response[0]._doc.issues[0]._doc
          const timeStamp = new Date().toString()
          const updatedIssue = {
            _id: id,
            issue_title: changes.issue_title || oldIssue.issue_title,
            issue_text: changes.issue_text || oldIssue.issue_text,
            created_by: changes.created_by || oldIssue.created_by,
            assigned_to: changes.assigned_to || oldIssue.assigned_to,
            status_text: changes.status_text || oldIssue.status_text,
            open: changes.open || oldIssue.open,
            updated_on: timeStamp
          }
          await ProjectModel.updateIssue(id, updatedIssue)
        }
        catch(err) {
          console.error('could not update', err)
          res.send(`could not update ${id}`)
        }
        res.send('successfully updated')
      }
    })

    .delete(async(req, res) => {
      const project = req.params.project;
      const id = req.body._id

      if(!id) {res.send('_id error')}
      else {
        try{await ProjectModel.deleteIssue(project, id)}
        catch(err){
          console.error('failed to delete', err)
          res.send(`could not delete ${id}`)
        }
        res.send(`deleted ${id}`)
      }
    });

};