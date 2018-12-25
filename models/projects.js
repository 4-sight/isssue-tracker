const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  issues: [{
    issue_title: String,
    issue_text: String,
    created_on: Date,
    updated_on: Date,
    created_by: String,
    assigned_to: String,
    open: Boolean,
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

  return this.findOneAndUpdate({
    project: project
  }, {
    $push: {
      issues: {
        issue_title: issue.title,
        issue_text: issue.text,
        created_on: new Date().toDateString,
        updated_on: new Date().toDateString,
        created_by: issue.created_by,
        assigned_to: issue.assigned_to ? issue.assigned_to : "",
        open: true,
        status_text: issue.status_text ? issue.status_text : ""
      }
    }
  }, {
    new: true,
    $project: {
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


ProjectModel.updateIssue = function (project, id, update) {

  /*return this.findOneAndUpdate(
    { project: project },
    { issues: { _id: id }}
  )*/
}


ProjectModel.listAllIssues = function (project) {

  return this.findOne({
    project: project
  })
}


ProjectModel.listFilteredIssues = function () {


}

module.exports = ProjectModel