var perfil = {
    load: function(){
        db.ref('users').child(localStorage.currentUid).on('value', function(snapshot){
            if(snapshot.val() != null){

            $('.inputPerfilWhatsapp').val(snapshot.val().whatsapp).mask('(00)00000-0000');
            $('.inputPerfilNome').val(snapshot.val().nome);
            $('.inputPerfilMatricula').val(snapshot.val().matricula);
            $('.inputPerfilCpf').val(snapshot.val().cpf).mask('000.000.000-00');

            auth.onAuthStateChanged(function(user) {
                if(user){
                    $('.inputPerfilEmail').val(user.email);
                }
            });

            }
        });
    },

    editar: function(data){
		db.ref('users').child(localStorage.currentUid).update(data)
			.catch(function(error){
				console.log(error.code);
			})
			.then(function(handle){
				$.notify({message: "Perfil atualizado com sucesso!"}, {type: 'info', timer: 5000});
			});
    },

    verifica: function(data){
        $.notifyClose();
        for(key in data){
            if(data[key].val()==''){
                $.notify({message: "Preencha o campo "+key}, {type: 'danger', timer: 3000,newest_on_top: true});
                data.key.select();
                return;
            }
        }

        if(data.matricula.val().length <= 3){
            $.notify({message: "A matrícula deve ter 4 ou mais caracteres"}, {type: 'danger', timer: 3000});
            data.matricula.select();
        }else if(!data.cpf.val().match('[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}')){
            $.notify({message: "Digite um CPF válido"}, {type: 'danger', timer: 3000});
            data.cpf.select();
        }else if(data.whatsapp.val().match('\([0-9]{2}\)[0-9]{5}\-[0-9]{4}')){
            $.notify({message: "Digite um whatsapp válido"}, {type: 'danger', timer: 3000});
            data.whatsapp.select();
        }else{
            var data = {
                nome: data.nome.val(),
                matricula: data.matricula.val(),
                cpf: data.cpf.val(),
                whatsapp: data.whatsapp.val()
            }

            perfil.editar(data);
        }
    }
}

$(function(){
    perfil.load();

    var data = {
        matricula: $('.inputPerfilMatricula'),
        whatsapp: $('.inputPerfilWhatsapp'),
        nome: $('.inputPerfilNome'),
        cpf: $('.inputPerfilCpf'),
    };

    $('.btnEditarPerfil').on('click',function(){
		perfil.verifica(data);
    });

});