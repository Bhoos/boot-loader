# boot-loader
App installation and update library

# There are three components to the infrastructure management
1. Server: A server instance that tracks and manages the client applications
2. Client: A library that needs to be embedded within the main application to be
           managed within the infrastructure
3. CLI: A helper utility to install applications (client as well as server) on an
        instance so that can be run as a linux daemon
        
# Features/Objectives
1. Manage Development/Staging/Production deploy of applications
2. Use github flow to automatically update running instances
   * github/master for `Development` mode
   * github/draft-release for `Staging` mode
   * github/release for `Production` mode
3. Add/Remove application instances as required
4. Define rules for application scaling 
5. Provide message queing (pub/sub) across applications
6. Use infrastructure api (Digital Ocean/AWS, etc) separately to make the
   infrastructure management work seamlessly with different vendors.
   

  
