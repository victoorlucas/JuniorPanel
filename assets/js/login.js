/*
    Version 1.0
    Write by Victor Lucas

    Futuramente pretendo implementar o login de forma a tornar mais fácil o acesso à ferramenta, por enquanto ainda estou tentando implementar todas as funções necessárias para o bom funcionamento.
*/
var login = {
    login: function(data){

        //
        auth
            .signInWithEmailAndPassword(data.email, data.senha)
            .catch(function(error) {
                if(error=="auth/network-request-failed"){
                    $.notify({message: "Por favor conecte-se a internet"}, {type: 'danger',timer: 2000,newest_on_top: true});
                }else{
                    $.notify({message: "E-mail ou senha incorretos!"}, {type: 'danger',timer: 2000,newest_on_top: true});
                }
                $('.btnLogin').html(`Login <i class="fa fa-arrow-right" aria-hidden="true"></i>`);
            })
            .then(function(result) {
                location.href = "index.html";
                localStorage.currentUid = result.uid;
                $('.btnLogin').html(`<i class="fa fa-check" aria-hidden="true"></i> Logado`);
            });

    },

    verifica: function(data){
         $('.btnLogin').html(`<i class="fa fa-circle-o-notch fa-spin"></i>`);
        $.notifyClose();

        for(key in data){
            if(data[key].val()==''){
                $.notify({message: "Preencha o campo "+key}, {type: 'danger', timer: 3000, newest_on_top: true});
                $('.btnLogin').html(`Login <i class="fa fa-arrow-right" aria-hidden="true"></i>`);
                return;
            }
        }

        var data = {
            email: data.email.val(),
            senha: data.senha.val()
        };

        login.login(data);
    }
}

$(function() {
    auth.onAuthStateChanged(function(user) {
      if (user) {
        location.href="index.html";
      }
    });

    //quando apertar enter, executar o login tbm
    $(document).keypress(function(e) {
        var data = {
            email: $('.inputEmail'),
            senha: $('.inputSenha')
        };

        if (e.which == 13) {
            login.verifica(data);
            e.preventDefault();
        }
    });

    $('.btnLogin').on('click',function(){
        var data = {
            email: $('.inputEmail'),
            senha: $('.inputSenha')
        };

        login.verifica(data);
    });
});