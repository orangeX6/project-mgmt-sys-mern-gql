const { projects, clients } = require('../sampleData');

//Mongoose Models
const Project = require('../models/Project');
const Client = require('../models/Client');

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLList,
  GraphQLEnumType,
} = require('graphql');

String.prototype.toObjectId = function () {
  var ObjectId = require('mongoose').Types.ObjectId;
  return new ObjectId(this.toString());
};

//Client Type
const ClientType = new GraphQLObjectType({
  name: 'Client',
  description: 'This represents a client',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    phone: { type: GraphQLNonNull(GraphQLString) },
    project: {
      type: ProjectType,
      resolve: (client) => {
        // projects.filter((project) => project.clientId === client.id);
        const clientID = client.id.toObjectId();
        return Project.findOne({ clientId: clientID });
      },
    },
  }),
});

//Project Type
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  description: 'This represents a project',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    clientId: { type: GraphQLNonNull(GraphQLID) },
    client: {
      type: ClientType,
      resolve: (parent) => Client.findById(parent.clientId),
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  description: 'Root Query',
  fields: {
    client: {
      type: ClientType,
      description: 'A single client',
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => Client.findById(args.id),
    },
    clients: {
      type: new GraphQLList(ClientType),
      description: 'List of Clients',
      resolve: () => Client.find(),
    },
    project: {
      type: ProjectType,
      description: 'A single Project',
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => Project.findById(args.id),
    },
    projects: {
      type: new GraphQLList(ProjectType),
      description: 'List of Projects',
      resolve: () => Project.find(),
    },
  },
});

// MUtations
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: {
    addClient: {
      type: ClientType,
      description: 'Add a Client',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone,
        });
        return client.save();
      },
    },
    deleteClient: {
      type: ClientType,
      description: 'Delete a Client',
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: (_, args) => {
        Project.find({ clientId: args.id }).then((projects) => {
          projects.forEach((project) => project.remove());
        });
        return Client.findByIdAndDelete(args.id);
      },
    },

    // Add a project
    addProject: {
      type: ProjectType,
      description: 'Add A project',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatus',
            values: {
              new: { value: 'Not Started' },
              progress: { value: 'In Progress' },
              completed: { value: 'Completed' },
            },
          }),
          defaultValue: 'Not Started',
        },
        clientId: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, args) => {
        const project = await Project.create({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId,
        });

        return project;
      },
    },

    // Delete Project
    deleteProject: {
      type: ProjectType,
      description: 'Delete a Project',
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Project.findByIdAndRemove(args.id);
      },
    },
    // Update a Project
    updateProject: {
      type: ProjectType,
      description: 'Update a Project',
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatusUpdate',
            values: {
              new: { value: 'Not Started' },
              progress: { value: 'In Progress' },
              completed: { value: 'Completed' },
            },
          }),
          defaultValue: 'Not Started',
        },
      },
      resolve: (parent, args) => {
        return Project.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              description: args.description,
              status: args.status,
            },
          },
          { new: true }
        );
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
