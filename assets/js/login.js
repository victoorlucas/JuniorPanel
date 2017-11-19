/*
    Pre-release 0.1 [AdventureTime]
    Author: Victor Lucas
    Author website: victorlucss.com
*/

window.login = window.login || {
    login(data){
        auth
            .signInWithEmailAndPassword(data.email, data.senha)
            .then(result => {
                location.href = "index.html";
                localStorage.currentUid = result.uid;
                $('.btnLogin').html(`<i class="fa fa-check" aria-hidden="true"></i> Redirecionando`);
            }, error => {
                $.notify({message: "E-mail ou senha incorretos!"}, {type: 'danger',timer: 2000,newest_on_top: true});
                $('.btnLogin').html(`Login <i class="fa fa-arrow-right" aria-hidden="true"></i>`);
            });

    },

    verifica(data){
        $.notifyClose();
         $('.btnLogin').html(`<i class="fa fa-circle-o-notch fa-spin"></i>`);

        for(key in data){
            if(data[key] == ''){
                $.notify({message: "Preencha o campo "+key}, {type: 'danger', timer: 3000, newest_on_top: true});
                $('.btnLogin').html(`Login <i class="fa fa-arrow-right" aria-hidden="true"></i>`);
                return;
            }
        }

        login.login(data);
    }
}

$(() => {
    auth.onAuthStateChanged(function(user) {
      if(user)
        location.href="index.html";
    });


    $(document).keypress(function(e) {
        const data = {
            email: $('.inputEmail').val(),
            senha: $('.inputSenha').val()
        };

        if(e.which == 13){
            login.verifica(data);
            e.preventDefault();
        }
    });

    $('.btnLogin').on('click',function(e){
        const data = {
            email: $('.inputEmail').val(),
            senha: $('.inputSenha').val()
        };

        login.verifica(data);

        e.preventDefault();
    });
});