/************************************************************** */
/** MAIN PROGRAM */
/************************************************************** */
/* global downloadPromise uploadPromise resetPromise updatePromise */
/* see http://eslint.org/docs/rules/no-undef */

/************************************************************** */
/* CONSTANTES */
/************************************************************** */

const base_url = "http://lifap5.univ-lyon1.fr/";
const local_todos = "./Projet-2018-todos.json";
const local_users = "./Projet-2018-users.json";



////////////////////////////////////////////////////////////////////////////////
// ETAT : classe d'objet pour gérer l'état courant de l'application
////////////////////////////////////////////////////////////////////////////////

function State(users = [], todos = [], filters = [], sort = "NONE") {
  this.users = users;
  this.todos = todos;
  this.filters = filters;
  this.sort = sort;

  //returns the JSON object of a user
  this.get_user_info = (user_id) => {
    return this.users.find((o) => o['_id'] === user_id);
  };

  //returns the TODO objects created by a user
  this.get_user_todos = (user_id) => {
    // console.debug(`get_user_todos(${user_id})`); // with ${this.todos}
    const result = this.todos.filter(o => o['createdBy'] === user_id);
    return result;
  };

  this.filter = () => this.todos.filter(todo => this.filters.find(filter => filter==todo.status) !== undefined );
  

  this.get_other_todos = (user_id) => {
    const mentioned_todos = this.todos.filter(todo => todo.people != undefined ? 
      (todo.people.find(p => p == user_id) !== undefined)
      : false);
    return mentioned_todos;
  };

  //returns the TODO objects where a user is mentioned
  this.get_mentioned_todos = (user_id) => {
    let mentioned_todos = [];
    return mentioned_todos;
  };

  this.sort_by_title = () => {
    this.todos.sort(this.sort_fun_str("title"));

  };

  this.delete_todo = (id) => this.todos = this.todos.filter(todo => todo._id != id);
  
  // func to sort by string attr is the arribute of the abject a & b
  this.sort_fun_str = (attr) => (a, b) => a[attr].localeCompare(b[attr]);

  // sort by date
  this.sort_by_date = () => this.todos.sort((a, b) => {
    return new Date(a.deadline) - new Date(b.deadline);
  });

  this.sort_by_status = () => {
    let res = this.todos.reduce((new_assoc_arr, val) => {
      new_assoc_arr[val.status].push(val);
      return new_assoc_arr;
    }, {
      "TODO": [],
      "DOING": [],
      "DONE": []
    });
    this.todos = [].concat(res["DOING"], res["TODO"], res["DONE"]);
  };
} //end State

function modifHTMLid(id, text) {
  document.getElementById(id).innerHTML = text;
}
function statut_to_img(status) {
  let icone = "./img/";
  switch (status) {
    case "DONE":
      icone += "cloud-done.svg";
      break;
    case "DOING":
      icone += "run.svg";
      break;
    case "TODO":
      icone += "bookmark.svg";
      break;
    default:
      icone += "panorama.svg";
      break;
  }
  return icone;
}

function reduce_User_Todos(acc, val) {
  acc +=
    `<div class="flex-row padding-2 hov">
         <img class="img-50x50 flex-col-1 mng-recup" src="` + statut_to_img(val['status']) + `" alt="Status">
    <div class="flex-col-10 mng-recup" >
         <div>${val['title']}</div>
         <span class="text-muted">${val['deadline']} </span>
         <span>
            <a href="mailto:exemple@exple.com">${val['people']}</a>
         </span>
        </div>
           <div class="hidden"> ${val['desc']}
           </div>
        <div class="hidden-id">${val['_id']}</div>          
        <span class="flex-col-2"  data-toggle="modal" data-target="#uploadModal2">
            <img class="img-30x30 btn-edit d-inline" src="./img/edit.svg"> </span>
        <span class="flex-col-2">            
            <img class="img-30x30 btn-del d-inline" src="./img/trash-alt.svg">
          </span>
          </div>  `;
  return acc;
}

function reduce_Other_Todos(acc, val) {
  acc +=
    `<div class="flex-row padding-2 hov">
   <img class="img-50x50 flex-col-1 mng-recup" src="` + statut_to_img(val['status']) + `" alt="Status">`;
  acc += ` <div class="flex-col-10 mng-recup" >
   <div>${val['title']}</div>
   <span class="text-muted">${val['deadline']} </span>
   <span>
      <a href="mailto:exemple@exple.com">${val['people']}</a>
   </span>
   </div>
     <div class="hidden"> ${val['desc']}
     </div>
     <div class="hidden-id">${val['_id']}</div>
   </div>  `;
  return acc;
}

let HTML_Current_User = (user) => user.reduce(reduce_User_Todos, "");

let HTML_Other_Users = (user) => user.reduce(reduce_Other_Todos, "");

////////////////////////////////////////////////////////////////////////////////
// OUTILS : fonctions outils, manipulation et filtrage de TODOs
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// RENDU : fonctions génération de HTML à partir des données JSON
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// HANDLERS : gestion des évenements de l'utilisateur dans l'interface HTML
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// FETCH Fonction permettant de charger des données asynchrones
////////////////////////////////////////////////////////////////////////////////
function get_local_todos() {
  return fetch(local_todos)
    .then(response => response.text())
}

function get_local_users() {
  return fetch(local_users)
    .then(response => response.text())
}



function Affiche() {

  let list = $('.mng-recup');
  list.on("click", function () {
    let parent = $(this).parent();
    let res = "";
    let tmp = "";
    res += `<img id="selected-todo-status" class="img-50x50 d-inline margin-5" src="${parent.children('img').attr("src")}">\n `;
    tmp = parent.children(".flex-col-10").html();
    res += `<div class="flex-col-10">${tmp}</div>`;
    tmp = parent.children(".hidden").html();
    res += `<p class="bg-light text-justify container-fluid">${tmp}</p></div>`;
    modifHTMLid("todo-details", res);
  });
}




function fetch_url_todos() {
  const api_key_value = 'faea45285956347583bd';
  const api_header = 'X-API-KEY';
  let headers = new Headers();
  headers.set(api_header, api_key_value);
  const url = 'http://localhost:8186/index.php/todos/';

  return fetch(url, {
      method: 'GET',
      headers: headers
    })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        console.log(`Erreur dans la requête ${url}: ${response.code}`);
        throw ("Erreur lors de la requête sur le serveur");
      }
    })
}

function fetch_url_users() {
  const api_key_value = 'faea45285956347583bd';
  const api_header = 'X-API-KEY';
  let headers = new Headers();
  headers.set(api_header, api_key_value);
  const url = 'http://localhost:8186/index.php/users/';

  return fetch(url, {
      method: 'GET',
      headers: headers
    })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        console.log(`Erreur dans la requête ${url}: ${response.code}`);
        throw ("Erreur lors de la requête sur le serveur");
      }
    })
}

function connectionPost(string, State, user) {
  const api_header = 'X-API-KEY';
  const api_key_value = 'faea45285956347583bd';
  let headers = new Headers();
  headers.set(api_header, api_key_value);
  // attention ci-dessous, pas d'id dans l'URL
  const url = 'http://localhost:8186/index.php/todos/';

  const data = JSON.stringify(string);
  fetch(url, {
      method: 'POST',
      headers: headers,
      body: data
    })
    .then(function (response) {
      if (response.ok)
        return response.json();
    }).then(function (us){
      call_fundc()
        .then(state => main(state, user));
    });
}

function tabJSON(num) {
  var todo = {};
  todo.title = $("#upload-title" + num).val();
  todo.desc = $("#upload-desc" + num).val();
  todo.people = $("#upload-ment" + num).val().split(" ");
  todo.deadline = $('#upload-dead' + num).val();
  todo.status = $('#upload-state' + num).val();
  todo.createdBy = "p1612177";
  return todo;
}

let add = $("#upload-button");
function string_form(State, user) {
  add.off('click');
  add = $("#upload-button");
  add.on("click", function () {
    connectionPost(tabJSON(''), State, user);
  });

  let add2 = $("#upload-button2")
  add2.on("click", function () {
    modifierTodos(State, user, tabJSON('2'), $(this));
  });
}

function del(State, user) {
  let del = $('.btn-del');
  del.on("click", function () {
    let parent = $(this).parent().parent();
    id = parent.children(".hidden-id").html();
    const api_header = 'X-API-KEY';
    const api_key_value = 'faea45285956347583bd';
    let headers = new Headers();
    headers.set(api_header, api_key_value);
    url = "http://localhost:8186/index.php/todos/" + id;
    fetch(url, {
        method: 'DELETE',
        headers: headers
      })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
      })
      .then(val => {
        call_fundc()
        .then(state => main(state, user));
      });
  });
}

let modifierTodos = function (State, user, str) {
  const api_header = 'X-API-KEY';
  const api_key_value = 'faea45285956347583bd';
  let api_headers = new Headers();
  api_headers.set(api_header, api_key_value);
  let parent = $(".btn-edit").parent().parent();
  id = parent.children(".hidden-id").html();
  url = `http://localhost:8186/index.php/todos/${id}`;
  str._id = id;
  fetch(url, {
    method: "PUT",
    headers: api_headers,
    body: JSON.stringify(str)
  }).
  then(rep => {
    if (rep.ok)
      return rep.text();
    else {
      console.log(`Erreur dans la requête ${url}: ${rep.code}`);
      throw ("Erreur lors de la requête sur le serveur");
    }
  }).then(function (us){
    call_fundc()
      .then(state => main(state, user));
  });
};

let Tri = (value, State) => {
  switch (value) {
    case "Titre":
      State.sort_by_title();
      break;
    case "Date":
      State.sort_by_date();
      break;
    case "Etat":
      State.sort_by_status();
      break;
  }
}

let filter_current = (State, user, id) => {
  $(id).on("change", function () {
    let valeur = $(id).val();
    Tri(valeur, State);
    reset_current_Todos(State, user);
    Affiche();
    del(State, user);
  });
}

let filter_others = (State, user, id) => {
  $(id).on("change", function () {
    let valeur = $(id).val();
    Tri(valeur, State);
    reset_other_Todos(State, user);
    Affiche();
    del(State, user);
  });
}

let reset_current_Todos = function (State, user) {
  const html = State.get_user_todos(user).reduce(reduce_User_Todos,"");
 /* console.log(user);
  console.log(State.get_user_todos(user));*/
  modifHTMLid("list-of-current-user-todos",html);
}

let reset_other_Todos = function (State, user) {
  modifHTMLid("list-of-other-user-info",
    HTML_Other_Users(State.get_other_todos(user)));
}

function main(State, user) {
  reset_current_Todos(State, user);
  reset_other_Todos(State, user);
  string_form(State, user);
  filter_current(State, user, "#user_todo_sort");
  filter_others(State, user, "#mentioned_todo_sort");
  select(".filter-user-todo", State, user);
  selother(".filter-mentioned-todo", State, user);
 // filter_todos();
  Affiche();
  del(State,user);
}

function getClass(classNames) {
  return Array.from(document.getElementsByClassName(classNames));
}

function select(classe, state, user){
  $(classe).on("click", function (){
    $(this).toggleClass("selected-filter");
    var val= $(this).children("span").html(); 
    state.filters = getClass('selected-filter').map(ele => $(ele).children("span").html());
    const todo_filtre = state.filter();
    reset_current_Todos(new State( State.users,todo_filtre ), user);
    del(state,user);
    Affiche();
  });
  
}
function selother(classe, state, user){
  $(classe).on("click", function (){
    $(this).toggleClass("selected-other-filter");
    console.log("tes");
    var val= $(this).children("span").html(); 
    state.filters = getClass('selected-other-filter').map(ele => $(ele).children("span").html());
    const todo_filtre = state.filter();
    reset_other_Todos(new State( State.users,todo_filtre ), user);
    del(state,user);
    Affiche();
  });
}

let call_fundc = () => {
  return Promise.all([fetch_url_users(), fetch_url_todos()])
  .then(values => new State(values[0], values[1]))
};


document.addEventListener('DOMContentLoaded', function () {
  let state = {};

  call_fundc()
  .then(state => main(state, "p1612177"));

}, false);