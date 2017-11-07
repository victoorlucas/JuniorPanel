//Este objeto agrupa todas as funções referentes ao controller de gerencia de usuários
var gerenciarUsuarios = {

	load: function(){
		var tableUsuarios = $('.tableUsuarios');

		$('.case .case-header span').html(`<i class="fa fa-circle-o-notch fa-spin"></i>`);
		$('.case .case-container').html(`<i class="fa fa-circle-o-notch fa-spin"></i>`);

		tableUsuarios.html(`<span class="loading"><i class="fa fa-circle-o-notch fa-spin"></i></span>`);

		db.ref('users').orderByChild("nome").on('value',function(snapshot){
			if(snapshot.val() != null){
				tableUsuarios.html(' ');

				snapshot.forEach(function(childSnapshot){
					if(childSnapshot.val().status != 'bloqueado' && childSnapshot.val().status != 'removido'){
						tableUsuarios.append(`
						<tr>
							<th scope="row">${childSnapshot.val().nome}</th>
							<td>${childSnapshot.val().matricula}</td>
							<td class="text-right">
								<button class="btn btn-fill btn-sm btnVisualizar" value="${childSnapshot.key}" data-case="show">Visualizar ${childSnapshot.val().nome}</button>
							</td>
						</tr>`);
					}
				});
			}else{
				tableUsuarios.html(`<span>Nenhum usuário cadastrado</span>`);
			}
		});

		$()
	},

	visualizar: function(userUid){
		$('.case .case-footer').remove();

		db
		.ref('users')
		.child(userUid)
		.on('value', function(snapshot){
			var dataSaida = (snapshot.val().dataSaida == undefined) ? "ainda ativo" : snapshot.val().dataSaida;
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
					<div class="col-md-6">
						<div class="form-group">
							<label>Curso</label>
							<input type="text" class="form-control inputCurso" value="${snapshot.val().curso}" placeholder="Nome" disabled/>
						</div>
					</div>

					<div class="col-md-6">
						<div class="form-group">
							<label>Semestre</label>
							<input type="number" class="form-control inputSemestre" value="${snapshot.val().semestre}" placeholder="Nome" disabled/>
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col-md-6">
						<div class="form-group">
							<label>Data de admissão</label>
							<input type="date" class="form-control inputDataAdmissao" value="${snapshot.val().dataAdmissao}" placeholder="Nome" disabled/>
						</div>
					</div>

					<div class="col-md-6">
						<div class="form-group">
							<label>Cargo</label>
							<input type="number" class="form-control inputCargo" value="${snapshot.val().cargo}" placeholder="Nome" disabled/>
						</div>
					</div>
				</div>
			`);
			$('.case').append(`
				<div class="case-footer">
					<div class="text-right">
						<button class="btn btn-default btn-fill btn-sm btnEditar" value="${userUid}"><div class="fa fa-pencil-square-o"></div> Editar</button>
						<button class="btn btn-default btn-fill btn-sm btnBloquear" value="${userUid}"><div class="fa fa-lock"></div> Bloquear</button>
						<button class="btn btn-default btn-fill btn-sm btnRemover" value="${userUid}"><div class="fa fa-ban"></div> Excluir</button>
					</div>
				</div>`);
		});

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
			verificaNilve(0, gerenciarUsuarios.editar(data, userUid));
		}
	},

	editar: function(data, userUid){
		//Função editar aqui
	},

	bloquear: function(userUid){
		//Função bloquear aqui
	},

	remover: function(userUid){
		//Função remover aqui
	},


}


gerenciarUsuarios.load();

$(document).on('click','.btnEditar',function(){
	$('.btnBloquear').fadeOut(100);
	$('.btnRemover').fadeOut(100);
	$(this).removeClass('btn-default').addClass('btn-info');

	$('.inputAdmissao').mask('00/00/0000');
	$('.inputCpf').mask('000.000.000-00');
	$('.inputWhatsapp').mask('(00)00000-0000');

	$('.case input').prop("disabled", false);

	var data = {
		nome: $('.inputNome').val(),
		cpf: $('.inputCpf').val(),
		matricula: $('.inputMatricula').val(),
		dataAdmissao: $('.inputDataAdmissao').val(),
		curso: $('.inputCurso').val(),
		semestre: $('.inputSemestre').val(),
		cargo: $('.inputCargo'),
		whatsapp: $('.inputWhatsapp').val()
	};

	gerenciarUsuarios.verifica(data, this.value);
});

$(document).on('click','.btnBloquear',function(){
	gerenciarUsuarios.bloquear(this.value);
});

$(document).on('click','.btnRemover',function(){
	gerenciarUsuarios.remover(this.value);
});

$(document).on('click','.btnVisualizar', function(){
	verificaNivel(0, gerenciarUsuarios.visualizar(this.value));
});