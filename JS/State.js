////////////////////////////////////////////////////////////////////////////////
// ETAT : classe d'objet pour gérer l'état courant de l'application
////////////////////////////////////////////////////////////////////////////////

function State(users = [], todos = [], filters = [], sort = "NONE"){
    this.users  = users;
    this.todos  = todos;
    this.filters = filters;
    this.sort   = sort;
  
    //returns the JSON object of a user
    this.get_user_info = (user_id) => {
      return this.users.find((o)=>o['_id']===user_id);
    };
  
    //returns the TODO objects created by a user
    this.get_user_todos = (user_id) => {
      console.debug(`get_user_todos(${user_id})`); // with ${this.todos}
      const result = this.todos.filter( o => o['createdBy']===user_id );
      return result;
    };
  
    this.get_other_todos = (user_id) => {
      console.debug(`get_user_todos(${user_id})`); // with ${this.todos}
      const result = this.todos.filter( o => o['createdBy']!==user_id );
      return result;
    };
  
    //returns the TODO objects where a user is mentioned
    this.get_mentioned_todos = (user_id) => {
      let mentioned_todos = [];
      return mentioned_todos;
    };
    
  
  }//end State