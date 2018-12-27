const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  project: String,
  issues: [{
    issue_title: String,
    issue_text: String,
    created_on: Date,
    updated_on: Date,
    created_by: String,
    assigned_to: String,
    open: String,
    status_text: String
  }]
})

const ProjectModel = mongoose.model("projects", projectSchema)

// Methods
ProjectModel.addProject = function (project) {

  return this.create({
    project: project
  })
}


ProjectModel.findProject = function (project) {

  return this.findOne({
    project: project
  })
}


ProjectModel.addIssue = function (project, issue) {

  let timeStamp = new Date().toString()

  return this.findOneAndUpdate({
    project: project
  }, {
    $push: {
      issues: {
        issue_title: issue.issue_title,
        issue_text: issue.issue_text,
        created_on: timeStamp,
        updated_on: timeStamp,
        created_by: issue.created_by,
        assigned_to: issue.assigned_to ? issue.assigned_to : "",
        open: 'true',
        status_text: issue.status_text ? issue.status_text : ""
      }
    }
  }, {
    new: true,
    projection: {
      _id: 0,
      project: 0,
      issues: {
        $slice: -1
      }
    }
  })
}

ProjectModel.deleteIssue = function (project, id) {

  return this.findOneAndUpdate({
    project: project
  }, {
    $pull: {
      issues: {
        _id: id
      }
    }
  })
}


ProjectModel.findIssue = function (id) {

  return this.find(
    { 'issues._id': id },
    { 'issues.$': true },
  )
}

ProjectModel.updateIssue = function(id, update) {
  
  return this.findOneAndUpdate(
    { 'issues._id': id },
    { $set: { 'issues.$': update}},
    { new: true }
  )
}


ProjectModel.listAllIssues = function (project) {

  return this.findOne({
    project: project
  })
}


ProjectModel.listFilteredIssues = function (project, queries) {

  let key = 'open'
  let conditions= []

  for(let key in queries) {
    conditions.push({ $eq: [`$$issue.${key}`, queries[key]]})
  }

  return ProjectModel.aggregate(
    [
      { $match: {project: project}},
      { $project: {
        issues: {$filter: {
          input: '$issues',
          as: 'issue',
          cond: {$and: conditions}
        }}
      }}
    ]
  )
}

module.exports = ProjectModel