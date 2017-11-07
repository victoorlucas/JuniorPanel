var adicionarUsuario = {
	load: function(){
		$('.inputDataAdmissao').mask('00/00/0000');
		$('.inputDataSaida').mask('00/00/0000');
		$('.inputCpf').mask('000.000.000-00');
		$('.inputWhatsapp').mask('(00)00000-0000');
	},

    adicionar: function(data){

			auth
			.createUserWithEmailAndPassword(data.email, data.senha)
			.catch(function(error){
				if(error.code == 'auth/email-already-in-use'){
					$.notify({message: "Este e-mail já está em uso!"}, { type: 'danger', timer: 3000 });
				}else if(error.code == 'auth/invalid-email'){ 
					$.notify({message: "Por favor, digite um e-mail válido!"}, {type: 'danger',timer: 3000});
				}else if(error.code == 'auth/weak-password'){
					$.notify({message: "Por favor, digite uma senha forte!"}, {type: 'danger',timer: 3000});
				}
			})
			.then(function(user){
				delete data.email;
				delete data.senha;
				db.ref('users').child(user.uid).set(data);
				$.notify({message: "Usuário adicionado"}, {type: 'info',timer: 3000});
			});
	},

	verifica: function(data){
		$.notifyClose();

		for(key in data){
            if(data[key]=='' && key != 'dataSaida'){
                $.notify({message: "Preencha o campo "+key}, {type: 'danger', timer: 3000, newest_on_top: true});
                // data[key].select();
                return;
            }
		}


		if(!data.nome.match('[a-zA-Z]+')){
			$.notify({message: "Digite um nome válido"}, {type: 'danger', timer: 3000, newest_on_top: true});
            // data.nome.select();
		}else if(!data.cpf.match('[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}')){
            $.notify({message: "Digite um CPF válido"}, {type: 'danger', timer: 3000, newest_on_top: true});
            // data.cpf.select();
        }else if(data.matricula.length <= 3){
            $.notify({message: "A matrícula deve ter 4 ou mais caracteres"}, {type: 'danger', timer: 3000, newest_on_top: true});
            // data.matricula.select();
        }else if(!data.dataAdmissao.match('[0-9]{2}\/[0-9]{2}\/[0-9]{4}')){
			$.notify({message: "Digite uma data de admissão válida"}, {type: 'danger', timer: 3000, newest_on_top: true});
            // data.dataAdmissao.select();
		}else if(data.dataSaida != '' && !data.dataSaida.match('[0-9]{2}\/[0-9]{2}\/[0-9]{4}')){
			$.notify({message: "Digite uma data de saída válida"}, {type: 'danger', timer: 3000, newest_on_top: true});
            // data.dataAdmissao.select();
		}else if(data.whatsapp.match('\([0-9]{2}\)[0-9]{5}\-[0-9]{4}')){
            $.notify({message: "Digite um whatsapp válido"}, {type: 'danger', timer: 3000, newest_on_top: true});
            // data.whatsapp.select();
        }else if(data.senha != data.confirmaSenha){
			$.notify({message: "Digite senhas iguais"}, {type: 'danger', timer: 3000, newest_on_top: true});
            // data.senha.select();
		}else{
			verificaNilve(0,adicionarUsuario.adicionar(data));
		}
	}

};



$(function(){
	adicionarUsuario.load();

	$('.btnAdicionarUsuario').on('click', function(){
		var data = {
			nome: $('.inputNome').val(),
			cpf: $('.inputCpf').val(),
			matricula: $('.inputMatricula').val(),
			dataAdmissao: $('.inputDataAdmissao').val(),
			dataSaida: $('.inputDataSaida').val(),
			curso: $('.inputCurso').val(),
			semestre: $('.inputSemestre').val(),
			email: $('.inputEmail').val(),
			cargo: $('.inputCargo'),
			whatsapp: $('.inputWhatsapp').val(),
			senha: $('.inputSenha').val(),
			confirmaSenha: $('.inputConfirmaSenha').val(),
			nivel: 1
		};

		adicionarUsuario.verifica(data);
	});

});