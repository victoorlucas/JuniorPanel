//Este objeto agrupa todas as funções referentes ao controller de gerencia de usuários
var gerenciarUsuarios = {

	load: function(){
		var tableUsuarios = $('.tableUsuarios');

		$('.case .case-header span').html(`<i class="fa fa-circle-o-notch fa-spin"></i>`);
		$('.case .case-container').html(`<i class="fa fa-circle-o-notch fa-spin"></i>`);

		tableUsuarios.html(`<span class="loading"><i class="fa fa-circle-o-notch fa-spin"></i></span>`);

		db.ref('users').on('value',function(snapshot){
			tableUsuarios.html('');

			snapshot.forEach(function(childSnapshot) {
				vermelhoSeSaiu = (childSnapshot.val().dataSaida != "") ? "danger" : "";
				if(childSnapshot.val().status == 0){
					tableUsuarios.append(`
						<tr class="${childSnapshot.key} ${vermelhoSeSaiu}">
							<th scope="row">${childSnapshot.val().nome}</th>
							<td>${childSnapshot.val().matricula}</td>
							<td class="text-right">
								<button class="btn btn-fill btn-sm btnVisualizar" value="${childSnapshot.key}" data-case="show">Visualizar ${childSnapshot.val().nome}</button>
							</td>
						</tr>
					`);
				}
			});
		});
	},

	visualizar: function(userUid){
		cas_e.close();
		cas_e.open();
		db.ref('users').child(userUid).on('value', function(snapshot){
			$('.case .case-footer').remove();

			if(snapshot.val().dataSaida == ""){
				$('.case .case-header span').html("Visualizar "+snapshot.val().nome);
				$('.case .case-container').html(`
					<div class="row">
						<div class="col-md-6">
							<div class="form-group">
								<label>Nome</label>
								<input type="text" class="form-control inputNome" value="${snapshot.val().nome}" placeholder="Nome" disabled/>
							</div>
						</div>

						<div class="col-md-6">
							<div class="form-group">
								<label>Matricula</label>
								<input type="text" class="form-control inputMatricula" value="${snapshot.val().matricula}" placeholder="Nome" disabled/>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="col-md-6">
							<div class="form-group">
								<label>CPF</label>
								<input type="text" class="form-control inputCpf" value="${snapshot.val().cpf}" placeholder="Nome" disabled/>
							</div>
						</div>

						<div class="col-md-6">
							<div class="form-group">
								<label>Whatsapp</label>
								<input type="text" class="form-control inputWhatsapp" value="${snapshot.val().whatsapp}" placeholder="Nome" disabled/>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="col-md-3">
							<div class="form-group">
								<label>Curso</label>
								<input type="text" class="form-control inputCurso" value="${snapshot.val().curso}" placeholder="Nome" disabled/>
							</div>
						</div>

						<div class="col-md-3">
							<div class="form-group">
								<label>Semestre</label>
								<input type="number" class="form-control inputSemestre" value="${snapshot.val().semestre}" placeholder="Nome" disabled/>
							</div>
						</div>

						<div class="col-md-6">
							<div class="form-group">
								<label>Data de admissão</label>
								<input type="date" class="form-control inputAdmissao" value="${snapshot.val().dataAdmissao}" placeholder="Nome" disabled/>
							</div>
						</div>
					</div>
				`);
				$('.case').append(`
					<div class="case-footer">
						<div class="text-right">
							<button class="btn btn-default btn-fill btn-sm btnEditar" value="${userUid}"><div class="fa fa-pencil-square-o"></div> Editar</button>
							<button class="btn btn-default btn-fill btn-sm btnBloquear" value="${userUid}"><div class="fa fa-lock"></div> Bloquear</button>
							<button class="btn btn-default btn-fill btn-sm btnRemover" value="${userUid}"><div class="fa fa-ban"></div> Remover</button>
							<button class="btn btn-default btn-fill btn-sm btnCancelar btnVisualizar" value="${userUid}" data-case="show" style="display: none;">Cancelar</button>
						</div>
					</div>
				`);
			}else{
				$('.case .case-header span').html("Visualizar "+snapshot.val().nome);
				$('.case .case-container').html(`<div class="alert alert-danger" role="alert">O membro <strong>${snapshot.val().nome}</strong> encontra-se atualmente bloqueado!</div>
												 <div class="alert alert-info" role="alert">Um membro é bloquedo quando é solicitada saída da empresa e o processo de emissão de horas complementares ainda não foi completo ou quando o membro faltou três vezes à reuniões</div>`);
				$('.case').append(`
					<div class="case-footer">
						<div class="text-right">
							<button class="btn btn-default btn-fill btn-sm btnDesbloquear" value="${userUid}"><div class="fa fa-unlock"></div> Desbloquear</button>
							<button class="btn btn-default btn-fill btn-sm btnRemover" value="${userUid}"><div class="fa fa-ban"></div> Remover</button>
							<button class="btn btn-default btn-fill btn-sm btnCancelar btnVisualizar" value="${userUid}" data-case="show" style="display: none;">Cancelar</button>
						</div>
					</div>
				`);
			}
		});

		for(key in cargos){
			$('.inputCargo').append(`<option value="${cargos[key]}">${key}</option>`);
		}
	},

	verifica: function(data, userUid){
		$.notifyClose();

		for(key in data){
            if(data[key]==''){
                $.notify({message: "Preencha o campo "+key}, {type: 'danger', timer: 3000, newest_on_top: true});
                return;
            }
		}

		if(!data.nome.match('[a-zA-Z]+')){
			$.notify({message: "Digite um nome válido"}, {type: 'danger', timer: 3000, newest_on_top: true});
		}else if(!data.cpf.match('[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}')){
            $.notify({message: "Digite um CPF válido"}, {type: 'danger', timer: 3000, newest_on_top: true});
        }else if(data.matricula.length <= 3){
            $.notify({message: "A matrícula deve ter 4 ou mais caracteres"}, {type: 'danger', timer: 3000, newest_on_top: true});
        }else if(data.whatsapp.match('\([0-9]{2}\)[0-9]{5}\-[0-9]{4}')){
            $.notify({message: "Digite um whatsapp válido"}, {type: 'danger', timer: 3000, newest_on_top: true});
        }else if(!data.dataAdmissao.match('[0-9]{2}\/[0-9]{2}\/[0-9]{4}')){
			$.notify({message: "Digite uma data de admissão válida"}, {type: 'danger', timer: 3000, newest_on_top: true});
		}else{
			verificaNivel(0, gerenciarUsuarios.editar(data, userUid));
		}
	},

	editar: function(data, userUid){
		$.notifyClose();
		db
			.ref('users')
			.child(userUid)
			.update(data)
			.catch(function(error){
				console.log(error);
			})
			.then(function(result){
				$.notify({message: "Usuário editado com sucesso"}, {type: "info", timer: 3000, newest_on_top: true});
			});
	},

	bloquear: function(data, userUid){
		$.notifyClose();
		cas_e.close();
		db
		.ref('users')
		.child(userUid)
		.update(data)
		.catch(function(error){
			console.log(error);
		})
		.then(function(result){
			$.notify({message: "Usuário bloqueado!"}, {type: "danger", timer: 5000, newest_on_top: true});
		});
	},

	desbloquear: function(data, userUid){
		$.notifyClose();
		db
		.ref('users')
		.child(userUid)
		.update(data)
		.catch(function(error){
			console.log(error);
		})
		.then(function(result){
			$.notify({message: "Usuário desbloqueado com sucesso!"}, {type: "info", timer: 3000, newest_on_top: true});
		});
	},

	remover: function(userUid){
		$.notifyClose();
		db
		.ref('users')
		.child(userUid)
		.set({})
		.catch(function(error){
			console.log(error);
		})
		.then(function(result){
			$.notify({message: "Usuário removido com sucesso!"}, {type: "danger", timer: 5000, newest_on_top: true});
		});
	},


}

//Push data on table
gerenciarUsuarios.load();

//Edit function
$(document).on('click','.btnEditar',function(){
	$('.btnBloquear').fadeOut(1);
	$('.btnRemover').fadeOut(1);
	$(this).removeClass('btn-default btnEditar').addClass('btn-info btnEditarUsuario');
	$('.btnCancelar').fadeIn();

	$('.inputAdmissao').mask('00/00/0000');
	$('.inputCpf').mask('000.000.000-00');
	$('.inputWhatsapp').mask('(00)00000-0000');

	$('.case input').prop("disabled", false);
});

$(document).on('click','.btnEditarUsuario',function(){

	var data = {
		nome: $('.inputNome').val(),
		cpf: $('.inputCpf').val(),
		matricula: $('.inputMatricula').val(),
		dataAdmissao: $('.inputAdmissao').val(),
		curso: $('.inputCurso').val(),
		semestre: $('.inputSemestre').val(),
		cargo: $('.inputCargo').val(),
		whatsapp: $('.inputWhatsapp').val()
	};

	gerenciarUsuarios.verifica(data, this.value);
});

//Lock function
$(document).on('click','.btnBloquear',function(){
	$('.btnEditar').fadeOut(1);
	$('.btnRemover').fadeOut(1);
	$('.btnCancelar').fadeIn();
	$(this).removeClass('btn-default btnBloquear').addClass('btn-danger btnBloquearUsuario');
	$('.case .case-container').html(`<div class="alert alert-info" role="alert">O bloqueio manual de membro é feito apenas quando o mesmo solicitou saída da empresa e está em processo de emissão de horas complementares.
	<br /> Deseja realmente bloquear este membro e marcar data de saída em <strong>${dataCompleta}</strong>?</div>`);
});

$(document).on('click', '.btnBloquearUsuario', function(){
	var data = {
		dataSaida: dataCompleta,
		faltas: 3
	}

	gerenciarUsuarios.bloquear(data,this.value);
});

//Unlock
$(document).on('click','.btnDesbloquear',function(){
	$('.btnRemover').fadeOut(1);
	$('.btnCancelar').fadeIn();
	$(this).removeClass('btn-default btnDesbloquear').addClass('btn-danger btnDesbloquearUsuario');
	$('.case .case-container').html(`<div class="alert alert-info" role="alert">O desbloqueio setará a data de saída do membro para inexistente e eliminará todas as faltas do mesmo.
	<br /> Deseja realmente desbloquear este membro?</div>`);
});

$(document).on('click', '.btnDesbloquearUsuario', function(){
	var data = {
		dataSaida: "",
		faltas: 0
	}

	gerenciarUsuarios.desbloquear(data,this.value);
});


//Total remove function
$(document).on('click','.btnRemover',function(){
	$('.btnDesbloquear').fadeOut(1);
	$('.btnBloquear').fadeOut(1);
	$('.btnEditar').fadeOut(1);
	$('.btnCancelar').fadeIn();
	$(this).removeClass('btn-default btnRemover').addClass('btn-danger btnRemoverUsuario');

	$('.case .case-container').html(`<div class="alert alert-info" role="alert"><strong>ATENÇÃO! </strong> A remoção de um usuário implica na perda total dos dados do mesmo, inviabilizando o acesso ou recuperação futura de tais dados. <br /> Deseja realmente remover este usuário?</div>`);
});

$(document).on('click','.btnRemoverUsuario', function(){
	gerenciarUsuarios.remover(this.value);
});

//Visualization
$(document).on('click','.btnVisualizar', function(){
	verificaNivel(0, gerenciarUsuarios.visualizar(this.value));
});