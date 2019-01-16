function Details(){
    let user = $(mod-recup);
    user.on("click", function{
        console.log($(this));
    });
}

Details();