const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const userController = require('./controller/user-controller')

const PROTO_PATH = path.join(__dirname, '../');

// Load proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userProto = grpc.loadPackageDefinition(packageDefinition).user;

// gRPC service implemented here
const userServiceImpl = {
  Register: async (call, callback) => {
    try {
      const result = await userController.register(call.request);
      callback(null, result);
    } catch (err) {
      console.log("Error while registering user", err);
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  },

  Login: async (call, callback) => {
    try {
      const result = await userController.login(call.request);
      callback(null, result);
    } catch (err) {
      console.log("Error while login", err);
      callback({ code: grpc.status.UNAUTHENTICATED, message: err.message });
    }
  },

  FollowUser: async (call, callback) => {
    try {
      const result = await userController.followUser(call.request);
      callback(null, result);
    } catch (err) {
        console.log("Error while following user", err);
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  },

  UnfollowUser: async (call, callback) => {
    try {
      const result = await userController.unfollowUser(call.request);
      callback(null, result);
    } catch (err) {
        console.log("Error while unfollowing user", err);
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  },

  GetFollowers: async (call, callback) => {
    try {
      const result = await userController.getFollowers(call.request);
      callback(null, result);
    } catch (err) {
      console.log("Error while fetching followers", err);
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  },
};

// Start server
function main() {
  const server = new grpc.Server();
  server.addService(userProto.UserService.service, userServiceImpl);
  server.bind('0.0.0.0:5005', grpc.ServerCredentials.createInsecure());
  server.start();
  console.log('UserService gRPC server running on port 5005');
}

main();
