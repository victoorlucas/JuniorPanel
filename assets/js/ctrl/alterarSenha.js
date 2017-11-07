var alterarSenha = {
    alterar: function(data){
        auth.onAuthStateChanged(function(user) {
            const credential = firebase.auth.EmailAuthProvider.credential(user.email, data.senhaAntiga.val());
            if(user){
                user.reauthenticateWithCredential(credential).then(function(){
                    user.updatePassword(data.senhaNova.val());
                    console.log("deucerto");
                }).catch(function(erro){
                    if(erro.code=='auth/wrong-password'){
                        $.notify({message: "Você não tem permissões para realizar esta ação!"}, {type: 'danger', timer: 3000, newest_on_top: true});
                    }else if(erro.code=='auth/user-not-found' || erro.code=='auth/invalid-email'){
                        $.notify({message: "Um erro ocorreu"}, {type: 'danger', timer: 3000, newest_on_top: true});
                    }
                });
            }else{
                $.notify({message: "Você não tem permissões para realizar esta ação!"}, {type: 'danger', timer: 3000, newest_on_top: true});
                loadPage('inicio');
            }
        });
    },

    verifica: function(data){
        $.notifyClose();
        if(data.senhaAntiga.val() == ''){
            $.notify({message: "Digite a senha antiga"}, {type: 'danger', timer: 3000, newest_on_top: true});
            data.senhaAntiga.select();
        }else if(data.senhaNova.val() == ''){
            $.notify({message: "Digite a nova senha"}, {type: 'danger', timer: 3000, newest_on_top: true});
            data.senhaNova.select();
        }else if(data.senhaNovaRepetida.val() == ''){
            $.notify({message: "Digite a senha antiga novamente"}, {type: 'danger', timer: 3000, newest_on_top: true});
            data.senhaNovaRepetida.select();
        }else if(data.senhaNova.val() != data.senhaNovaRepetida.val()){
            $.notify({message: "Digite senhas iguais"}, {type: 'danger', timer: 3000, newest_on_top: true});
            data.senhaNova.select();
        }else{
            alterarSenha.alterar(data);
        }
    }
}

$(function(){
    var data = {
        senhaAntiga: $('.inputASenhaAtual'),
        senhaNova: $('.inputANovaSenha'),
        senhaNovaRepetida: $('.inputANovaSenhaRepetida')
    };

    $('.btnAlterarSenha').on('click',function(){
        alterarSenha.verifica(data);
    });
});