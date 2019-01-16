/* global downloadPromise uploadPromise resetPromise updatePromise */
/* see http://eslint.org/docs/rules/no-undef */

/************************************************************** */
/* CONSTANTES */
/************************************************************** */

const base_url = "http://lifap5.univ-lyon1.fr/";
const local_todos = "./Projet-2018-todos.json";
const local_users = "./Projet-2018-users.json";

function modifHTMLid(id, text){
      document.getElementById(id).innerHTML=text;
} 

function modifHTMLclass(classe , text){
      document.getElementByClass(classe)= text;
}

function st_recupHTML(user){
  var res="";
  res += `<p>${user['_id']}</p><br>`;
  res+= `<img src='image/${user['avatar']}'>`;
  res+= `<a href='mailto:${user['email']}'> ${user['email']} </a>`;
  res+= `<p>Date joinedOn : ${user['joinedOn']}`;
  return res;
}

function reduce_User_Todos(acc, val){
    acc+=                <a href="mailto:exemple@exple.com">${val['people']}</a>

    `   <div class="flex-row padding-2">
            <img class="img-50x50 flex-col-1 mod-recup" src="./img/cloud-done-symbol.png" alt="Status">
            <div class="flex-col-10 mod-recup" >
            <div>${val['title']}</div>
            <span class="text-muted">${val['deadline']} </span>
            <span>
              <a href="mailto:exemple@exple.com">${val['people']}</a>
            </span>
          </div>
          <span class="flex-col-2">
            <img class="img-30x30 btn-edit d-inline" src="./img/edit.svg">
            <img class="img-30x30 btn-del d-inline" src="./img/trash-alt.svg">
          </span>
        </div>  `
    return acc;
}

function reduce_Other_Todos(acc, val){
    acc+=
    `  
     <div class="flex-row padding-2">
        <img class="img-50x50 flex-col-1" src="./img/cloud-done-symbol.png" alt="Status">
            <div class="flex-col-10">
                <div>
                    ${val['title']}
                </div>
            <span class="text-muted">${val['deadline']} </span>
            <span>
                <a href="mailto:exemple@exple.com">${val['people']}</a>            </span>
            </div>
        </div>
    `
    return acc;
}

function HTML_Current_User(user){
  var init="<p>";
  init= user.reduce(reduce_User_Todos, init);
  init+= "</p>";
  return init;
}

function HTML_Other_Users(user){
    var init="<p>";
    init= user.reduce(reduce_Other_Todos, init);
    init+= "</p>";
    return init;
}

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


