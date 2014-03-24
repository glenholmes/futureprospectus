
// Policy Mapping
// This is the area where policies are mapped to pages and restful requests.
// There are currently four policies in this web application:
// flash : Access to page by any user but errors are still traced using flash.
// isAuthenticated : The user has signed in and is in session.
// userAdmin : The user can only view the page if it is part of their profile or 
//   if the user is an administrator.
// isAdmin : checks the users user type if they are admin they have full access.


module.exports.policies = {
  user: {
    'new' : "flash",
    create : "flash",
    edit : "userAdmin",
    show: "userAdmin",
    '*' : "isAdmin"
  },
  student:{
    edit : "userAdmin",
    profile : "userAdmin"
  },
  subject:{
    selector : "userAdmin",
    subjectadmin : "isAdmin"
  },
  studentriasec:{
    'new' : "userAdmin",
    personality : "userAdmin"
  },
  student:{
    '*' : "userAdmin"
  },
  sport:{
    sportadmin : "isAdmin",
    '*' : "isAuthenticated"
  },
  recommendations:{
    '*' : "userAdmin"
  },
  occupation:{
    occupationriasec : "userAdmin",
    index : "isAuthenticated",
    adminindex: "isAdmin"
  },
  institute:{
    edit : "userAdmin",
    'new' : "isAdmin",
  },
  course:{
    index : "flash",
    show: "flash",
    indexcao : "flash",
    edit : "isAuthenticated",
    destroy : "isAuthenticated",
    '*' : "userAdmin"
  },
  county:{
    '*' : "isAuthenticated"
  },
  amenity:{
    amenityadmin : "isAdmin",
    '*' : "isAuthenticated"
  },
  
  '*': 'flash'
};