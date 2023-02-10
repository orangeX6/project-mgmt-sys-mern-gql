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
} = require('graphql');

//Client Type
const ClientType = new GraphQLObjectType({
  name: 'Client',
  description: 'This represents a client',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    phone: { type: GraphQLNonNull(GraphQLInt) },
    project: {
      type: ProjectType,
      resolve: (client) => {
        // projects.filter((project) => project.clientId === client.id);
        Project.findOne({ clientId: client.id });
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
    clientId: { type: GraphQLNonNull(GraphQLInt) },
    client: {
      type: ClientType,
      resolve: (parent) => clients.findById(parent.clientId),
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

module.exports = new GraphQLSchema({
  query: RootQuery,
});
