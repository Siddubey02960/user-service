# 🧑‍💼 User Service – Stories Platform 

This is the **User Service** for a scalable Stories backend (like Instagram/Snapchat), built as a microservice with:

-  gRPC communication
-  PostgreSQL for data storage
-  JWT authentication
-  Dockerized deployment

---

## Key Features

- Register/Login via email & password
- JWT-based auth
- Follow/Unfollow users
- Get followers list
- gRPC APIs defined in `user.proto`

---


Steps to run

1.clone
git clone https://github.com/yourname/stories-platform.git


2.add env 
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=postgres
DB_PORT=5432
DB_NAME=userdb
JWT_SECRET=supersecret



3.run docker comand to create build
docker-compose up --build


## sample calls

 ## login
 grpcurl -plaintext -d '{"name":"Sid","email":"sid@example.com","password":"secret"}' \
  localhost:50051 user.UserService/Register

  ## register
  grpcurl -plaintext -d '{"email":"sid@example.com","password":"secret"}' \
  localhost:50051 user.UserService/Login




